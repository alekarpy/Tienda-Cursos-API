import { Component, OnInit } from "@angular/core";
import { CarritoService } from "../../services/cart.service";
import { CartStateService } from "../../services/cart-state.service";
import { OrderService } from "../../services/order.service";
import { CommonModule, CurrencyPipe } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { CanComponentDeactivate } from "../../guards/form-deactivate.guard";
import { Observable, forkJoin, of, throwError } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../../environments/environment";
import { catchError, map, switchMap } from "rxjs/operators";

@Component({
  selector: "app-checkout",
  templateUrl: "./checkout.component.html",
  styleUrls: ["./checkout.component.css"],
  standalone: true,
  imports: [CommonModule, CurrencyPipe, ReactiveFormsModule, RouterLink],
})
export class CheckoutComponent implements OnInit, CanComponentDeactivate {
  checkoutForm: FormGroup;
  formSubmitted = false;
  loading = false;
  error: string | null = null;

  selectedPaymentMethod: "tarjeta" | "paypal" = "tarjeta";

  constructor(
    public cartService: CarritoService,
    private cartStateService: CartStateService,
    private orderService: OrderService,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.checkoutForm = this.fb.group({
      nombre: ["", [Validators.required]],
      apellido: ["", [Validators.required]],
      email: ["", [Validators.required, Validators.email]],
      telefono: [
        "",
        [
          Validators.required,
          Validators.pattern(/^[0-9]+$/),
          Validators.minLength(10),
          Validators.maxLength(15),
        ],
      ],
      paymentMethod: ["tarjeta", [Validators.required]],
      // Campos de tarjeta
      cardName: [""],
      cardNumber: [""],
      expiryDate: [""],
      cvv: [""],
      // Campo de PayPal
      paypalEmail: [""],
    });

    // Actualizar validaciones según el método de pago seleccionado
    this.checkoutForm.get("paymentMethod")?.valueChanges.subscribe((method) => {
      this.selectedPaymentMethod = method;
      this.updatePaymentValidators();
    });

    // Inicializar validadores
    this.updatePaymentValidators();
  }

  updatePaymentValidators() {
    const cardName = this.checkoutForm.get("cardName");
    const cardNumber = this.checkoutForm.get("cardNumber");
    const expiryDate = this.checkoutForm.get("expiryDate");
    const cvv = this.checkoutForm.get("cvv");
    const paypalEmail = this.checkoutForm.get("paypalEmail");

    if (this.selectedPaymentMethod === "tarjeta") {
      cardName?.setValidators([Validators.required]);
      cardNumber?.setValidators([
        Validators.required,
        Validators.pattern(/^[0-9\s]+$/),
        Validators.minLength(13),
        Validators.maxLength(19),
      ]);
      expiryDate?.setValidators([
        Validators.required,
        Validators.pattern(/^(0[1-9]|1[0-2])\/\d{2}$/),
      ]);
      cvv?.setValidators([
        Validators.required,
        Validators.pattern(/^[0-9]{3,4}$/),
      ]);
      paypalEmail?.clearValidators();
      paypalEmail?.setValue("");
    } else {
      cardName?.clearValidators();
      cardNumber?.clearValidators();
      expiryDate?.clearValidators();
      cvv?.clearValidators();
      cardName?.setValue("");
      cardNumber?.setValue("");
      expiryDate?.setValue("");
      cvv?.setValue("");
      paypalEmail?.setValidators([Validators.required, Validators.email]);
    }

    cardName?.updateValueAndValidity({ emitEvent: false });
    cardNumber?.updateValueAndValidity({ emitEvent: false });
    expiryDate?.updateValueAndValidity({ emitEvent: false });
    cvv?.updateValueAndValidity({ emitEvent: false });
    paypalEmail?.updateValueAndValidity({ emitEvent: false });
  }

  ngOnInit() {
    // Redirigir si el carrito está vacío
    if (this.cartService.cartItems.length === 0) {
      this.router.navigate(["/"]);
    }
  }

  // Método para enviar el formulario
  onSubmit() {
    // Verificar tanto cartItems como items para asegurar que tenemos productos
    const cartItems = this.cartService.items || this.cartService.cartItems;
    if (cartItems.length === 0) {
      this.error =
        "El carrito está vacío. Por favor, agrega productos antes de proceder al pago.";
      return;
    }

    console.log("🛒 [Checkout] Verificando carrito antes de enviar:", {
      itemsCount: cartItems.length,
      items: cartItems.map((item) => ({
        nombre: item.nombre,
        id: item.id,
        _id: (item as any)._id,
        cantidad: item.cantidad,
      })),
    });

    if (this.checkoutForm.invalid) {
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.checkoutForm.controls).forEach((key) => {
        this.checkoutForm.get(key)?.markAsTouched();
      });
      return;
    }

    // Obtener el método de pago seleccionado
    const paymentMethod = this.checkoutForm.get("paymentMethod")?.value;

    if (!paymentMethod) {
      this.error = "Por favor, selecciona un método de pago";
      return;
    }

    // Iniciar proceso de pago
    this.loading = true;
    this.error = null;

    const formData = this.checkoutForm.value;
    console.log("💳 [Checkout] Procesando pago con datos:", {
      nombre: formData.nombre,
      email: formData.email,
      paymentMethod: paymentMethod,
    });

    // Sincronizar el carrito local con el backend antes de crear la orden
    this.syncCartWithBackend().subscribe({
      next: (syncResult) => {
        console.log(
          "✅ [Checkout] Carrito sincronizado con el backend",
          syncResult
        );

        // Verificar que al menos una sincronización fue exitosa
        const successfulSyncs = Array.isArray(syncResult)
          ? syncResult.filter((r: any) => r && r.success === true).length
          : 0;

        const totalItems = this.cartService.items.length;
        console.log(
          `📊 [Checkout] Sincronización: ${successfulSyncs}/${totalItems} items sincronizados exitosamente`
        );

        if (successfulSyncs === 0 && totalItems > 0) {
          console.error(
            "❌ [Checkout] Ningún item se sincronizó correctamente"
          );
          this.loading = false;
          this.error =
            "Error al sincronizar el carrito. Por favor, verifica que los productos sean válidos e intenta nuevamente.";
          return;
        }

        // Verificar el carrito del backend antes de crear la orden
        this.verifyBackendCart().subscribe({
          next: (cartVerified: boolean) => {
            if (!cartVerified) {
              console.error(
                "❌ [Checkout] El carrito del backend está vacío después de sincronizar"
              );
              this.loading = false;
              this.error =
                "El carrito no se sincronizó correctamente. Por favor, intenta nuevamente.";
              return;
            }

            console.log(
              "✅ [Checkout] Carrito del backend verificado, procediendo a crear orden"
            );
            // Crear la orden en el backend
            this.orderService.createOrder(paymentMethod).subscribe({
              next: (response) => {
                console.log(
                  "✅ [Checkout] Orden creada exitosamente:",
                  response
                );

                const orderId = response.data?._id || response.data?.id;

                // Confirmar el pago y redirigir
                this.confirmPaymentAndRedirect(orderId);
              },
              error: (error) => {
                console.error(
                  "❌ [Checkout] Error al procesar el pago:",
                  error
                );
                this.loading = false;

                // Mostrar mensaje de error apropiado
                if (error.error?.message) {
                  this.error = error.error.message;
                } else if (error.status === 401) {
                  this.error =
                    "Tu sesión ha expirado. Por favor, inicia sesión nuevamente.";
                  // Redirigir a login después de un momento
                  setTimeout(() => {
                    this.router.navigate(["/login"]);
                  }, 2000);
                } else if (error.status === 400) {
                  this.error =
                    error.error?.message || "No hay artículos en el carrito";
                } else {
                  this.error =
                    "Hubo un error al procesar tu pago. Por favor, intenta nuevamente.";
                }
              },
            });
          },
          error: (verifyError: any) => {
            console.error(
              "❌ [Checkout] Error al verificar carrito del backend:",
              verifyError
            );
            // Aún así intentar crear la orden
            console.log(
              "⚠️ [Checkout] Intentando crear orden sin verificación del carrito"
            );
            this.orderService.createOrder(paymentMethod).subscribe({
              next: (response) => {
                console.log(
                  "✅ [Checkout] Orden creada exitosamente:",
                  response
                );
                const orderId = response.data?._id || response.data?.id;
                // Confirmar el pago y cambiar el estado a "Completado"
                this.confirmPaymentAndRedirect(orderId);
              },
              error: (error) => {
                console.error(
                  "❌ [Checkout] Error al procesar el pago:",
                  error
                );
                this.loading = false;
                if (error.error?.message) {
                  this.error = error.error.message;
                } else if (error.status === 400) {
                  this.error =
                    error.error?.message ||
                    "No hay artículos en el carrito. Por favor, recarga la página e intenta nuevamente.";
                } else {
                  this.error =
                    "Hubo un error al procesar tu pago. Por favor, intenta nuevamente.";
                }
              },
            });
          },
        });
      },
      error: (syncError) => {
        console.error("❌ [Checkout] Error al sincronizar carrito:", syncError);
        this.loading = false;

        // Determinar el mensaje de error apropiado
        let errorMessage = "Error al sincronizar el carrito con el servidor.";
        if (syncError?.message) {
          errorMessage = syncError.message;
        } else if (syncError?.error?.message) {
          errorMessage = syncError.error.message;
        }

        this.error =
          errorMessage +
          " Por favor, verifica tu conexión e intenta nuevamente.";

        // Si el error es que el carrito está vacío, no intentar crear la orden
        if (errorMessage.includes("vacío") || errorMessage.includes("empty")) {
          return;
        }

        // Aún así intentar crear la orden, puede que el carrito ya tenga items
        console.log(
          "⚠️ [Checkout] Intentando crear orden a pesar del error de sincronización"
        );
        this.loading = true;
        this.orderService.createOrder(paymentMethod).subscribe({
          next: (response) => {
            console.log("✅ [Checkout] Orden creada exitosamente:", response);
            const orderId = response.data?._id || response.data?.id;
            // Confirmar el pago y cambiar el estado a "Completado"
            this.confirmPaymentAndRedirect(orderId);
          },
          error: (error) => {
            console.error("❌ [Checkout] Error al procesar el pago:", error);
            this.loading = false;
            if (error.error?.message) {
              this.error = error.error.message;
            } else if (error.status === 400) {
              this.error =
                error.error?.message ||
                "No hay artículos en el carrito. Por favor, agrega productos al carrito primero.";
            } else {
              this.error =
                "Hubo un error al procesar tu pago. Por favor, intenta nuevamente.";
            }
          },
        });
      },
    });
  }

  /**
   * Confirma el pago de una orden y redirige al historial
   * @param orderId ID de la orden a confirmar
   */
  private confirmPaymentAndRedirect(orderId: string) {
    console.log("💳 [Checkout] Confirmando pago para orden:", orderId);
    this.orderService.confirmPayment(orderId).subscribe({
      next: (paymentResponse) => {
        console.log(
          "✅ [Checkout] Pago confirmado, orden completada:",
          paymentResponse
        );

        // Marcar formulario como enviado (permite salir sin confirmación)
        this.formSubmitted = true;

        // Limpiar el carrito local
        this.cartService.clearCart();

        // Redirigir a página de éxito o historial de órdenes
        this.router.navigate(["/order-history"], {
          queryParams: {
            success: "true",
            orderId: orderId,
          },
        });
      },
      error: (paymentError) => {
        console.error("❌ [Checkout] Error al confirmar pago:", paymentError);
        // Aún así redirigir, la orden se creó pero quedó en "Pendiente"
        this.formSubmitted = true;
        this.cartService.clearCart();
        this.router.navigate(["/order-history"], {
          queryParams: {
            success: "true",
            orderId: orderId,
            warning: "payment_pending",
          },
        });
      },
    });
  }

  /**
   * Sincroniza el carrito local con el backend
   * Limpia el carrito del backend primero y luego agrega todos los items del carrito local
   */
  private syncCartWithBackend(): Observable<any> {
    const token = localStorage.getItem("token");

    if (!token) {
      return throwError(() => new Error("No hay token de autenticación"));
    }

    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });

    const cartItems = this.cartService.items;
    console.log("🔄 [Checkout] Sincronizando carrito con backend:", {
      itemsCount: cartItems.length,
      items: cartItems.map((item) => ({
        nombre: item.nombre,
        id: item.id,
        _id: (item as any)._id,
        cantidad: item.cantidad,
      })),
    });

    // Si no hay items, no hay nada que sincronizar
    if (cartItems.length === 0) {
      console.log("⚠️ [Checkout] Carrito vacío, no hay nada que sincronizar");
      return throwError(() => new Error("El carrito está vacío"));
    }

    // Verificar que los items tengan _id o id válido
    const itemsSinId = cartItems.filter(
      (item) => !(item as any)._id && !item.id
    );
    if (itemsSinId.length > 0) {
      console.error(
        "❌ [Checkout] Algunos items no tienen ID válido:",
        itemsSinId
      );
      return throwError(
        () =>
          new Error(
            "Algunos productos no tienen un ID válido. Por favor, recarga la página e intenta nuevamente."
          )
      );
    }

    // PRIMERO: Limpiar el carrito del backend para evitar items duplicados o incorrectos
    console.log(
      "🧹 [Checkout] Limpiando carrito del backend antes de sincronizar..."
    );

    return this.http.delete(`${environment.apiUrl}/cart`, { headers }).pipe(
      catchError((error) => {
        // Si falla al limpiar, continuar de todas formas (puede que el carrito ya esté vacío)
        console.warn(
          "⚠️ [Checkout] No se pudo limpiar el carrito del backend, continuando...",
          error
        );
        return of(null);
      }),
      switchMap(() => {
        console.log(
          "✅ [Checkout] Carrito del backend limpiado, agregando items..."
        );

        // DESPUÉS: Agregar todos los items del carrito local al backend
        const syncRequests = cartItems.map((item, index) => {
          // El backend espera el _id de MongoDB, no el id numérico
          const productId = (item as any)._id || item.id;

          // Validar que tenemos un ID válido
          if (!productId) {
            console.error(
              `❌ [Checkout] Item ${index} no tiene ID válido:`,
              item
            );
            return throwError(
              () =>
                new Error(`El producto "${item.nombre}" no tiene un ID válido`)
            );
          }

          console.log(
            `🔄 [Checkout] Sincronizando item ${index + 1}/${
              cartItems.length
            }:`,
            {
              nombre: item.nombre,
              id: item.id,
              _id: (item as any)._id,
              productIdUsado: productId,
              cantidad: item.cantidad,
            }
          );

          return this.http
            .post(
              `${environment.apiUrl}/cart/add`,
              {
                productId: productId,
                quantity: item.cantidad,
              },
              { headers }
            )
            .pipe(
              map((response) => {
                console.log(
                  `✅ [Checkout] Item ${item.nombre} sincronizado exitosamente`
                );
                return { success: true, item: item.nombre, response };
              }),
              catchError((error) => {
                console.error(
                  `❌ [Checkout] Error al sincronizar item "${item.nombre}" (ID: ${productId}):`,
                  error
                );
                // Retornar un objeto con error en lugar de null para poder rastrear qué falló
                return of({
                  success: false,
                  item: item.nombre,
                  error:
                    error.error?.message ||
                    error.message ||
                    "Error desconocido",
                });
              })
            );
        });

        // Ejecutar todas las sincronizaciones en paralelo
        return forkJoin(syncRequests);
      }),
      map((results) => {
        const successful = results.filter((r: any) => r && r.success).length;
        const failed = results.filter((r: any) => r && !r.success).length;

        console.log(`📊 [Checkout] Resultado de sincronización:`, {
          total: results.length,
          exitosas: successful,
          fallidas: failed,
          resultados: results,
        });

        if (successful === 0) {
          const errorMessages = results
            .filter((r: any) => r && !r.success)
            .map((r: any) => r.error || "Error desconocido")
            .join(", ");
          throw new Error(
            `No se pudo sincronizar ningún item: ${errorMessages}`
          );
        }

        if (failed > 0) {
          console.warn(
            `⚠️ [Checkout] ${failed} items no se sincronizaron correctamente, pero ${successful} sí`
          );
        }

        return results;
      }),
      catchError((error) => {
        console.error(
          "❌ [Checkout] Error general al sincronizar carrito:",
          error
        );
        return throwError(() => error);
      })
    );
  }

  /**
   * Verifica que el carrito del backend tenga items después de sincronizar
   */
  private verifyBackendCart(): Observable<boolean> {
    const token = localStorage.getItem("token");

    if (!token) {
      return throwError(() => new Error("No hay token de autenticación"));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    console.log("🔍 [Checkout] Verificando carrito del backend...");

    return this.http.get<any>(`${environment.apiUrl}/cart`, { headers }).pipe(
      map((response) => {
        if (response.success && response.data) {
          const itemsCount = response.data.items?.length || 0;
          console.log(
            `🔍 [Checkout] Carrito del backend tiene ${itemsCount} items`
          );

          if (itemsCount === 0) {
            console.error("❌ [Checkout] El carrito del backend está vacío");
            return false;
          }

          console.log(
            "✅ [Checkout] Carrito del backend verificado correctamente"
          );
          return true;
        }
        return false;
      }),
      catchError((error) => {
        console.error(
          "❌ [Checkout] Error al verificar carrito del backend:",
          error
        );
        return of(false);
      })
    );
  }

  /**
   * Implementación de CanComponentDeactivate
   * Previene que el usuario salga del formulario si hay cambios sin guardar
   */
  canDeactivate(): boolean | Observable<boolean> {
    // Si el formulario ya fue enviado, permitir salir
    if (this.formSubmitted) {
      return true;
    }

    // Si el formulario está limpio (sin cambios), permitir salir
    if (this.checkoutForm.pristine) {
      return true;
    }

    // Si hay cambios sin guardar, preguntar al usuario
    const hasChanges = this.checkoutForm.dirty;
    if (hasChanges) {
      const confirmLeave = confirm(
        "¿Estás seguro de que quieres salir? Los datos del formulario no se guardarán."
      );
      return confirmLeave;
    }

    return true;
  }

  get total() {
    return this.cartService.getTotalPrice();
  }

  get subtotal(): number {
    const summaryState = this.cartStateService.currentSummaryState;
    return summaryState?.subtotal ?? this.cartService.getTotalPrice();
  }

  get tax(): number {
    const summaryState = this.cartStateService.currentSummaryState;
    return summaryState?.tax ?? 0;
  }

  get totalWithTax(): number {
    const summaryState = this.cartStateService.currentSummaryState;
    return summaryState?.total ?? this.cartService.getTotalPrice();
  }

  /**
   * Formatea automáticamente la fecha de expiración mientras el usuario escribe
   * Formato: MM/AA (ej: 12/25)
   */
  formatExpiryDate(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, ""); // Solo números

    // Limitar a 4 dígitos
    if (value.length > 4) {
      value = value.substring(0, 4);
    }

    // Agregar "/" después de los primeros 2 dígitos
    if (value.length >= 2) {
      value = value.substring(0, 2) + "/" + value.substring(2);
    }

    // Actualizar el valor del formulario
    this.checkoutForm.get("expiryDate")?.setValue(value, { emitEvent: false });
  }
}
