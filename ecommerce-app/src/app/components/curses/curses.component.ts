import {
  Component,
  OnInit,
  OnDestroy,
  ChangeDetectorRef,
  NgZone,
} from "@angular/core";
import { ProductService } from "../../services/product.service";
import { CurrencyPipe } from "@angular/common";
import { CarritoService } from "../../services/cart.service";
import { WishlistService } from "../../services/wishlist.service";
import { Datos } from "../../../datos";
import { CartComponent } from "../../pages/cart/cart.component";
import { CommonModule } from "@angular/common";
import { Subscription } from "rxjs";
import { ProductSkeletonComponent } from "../product-skeleton/product-skeleton.component";

@Component({
  selector: "app-curses",
  templateUrl: "./curses.component.html",
  styleUrls: ["./curses.component.css"],

  standalone: true,
  imports: [
    CurrencyPipe,
    CommonModule,
    CartComponent,
    ProductSkeletonComponent,
  ],
})
export class CursesComponent implements OnInit, OnDestroy {
  mostrarCarrito: boolean = false;

  notificacionVisible = false;

  cursos: Datos[] = [];

  categoriaSeleccionada: string = "Todos";
  loading: boolean = false;
  error: string | null = null;
  private productsSubscription?: Subscription;

  wishlistProducts: Set<string> = new Set(); // IDs de productos en wishlist

  // Acceso al servicio de ProductService y de CarritoService (cartService)
  constructor(
    public productService: ProductService,
    public cartService: CarritoService,
    private wishlistService: WishlistService,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone
  ) {}

  async ngOnInit() {
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/6a71a13e-6f5d-4bf5-a51d-55bfedcbd571", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "refresh-issue",
        hypothesisId: "A",
        location: "curses.component.ts:ngOnInit",
        message: "CursesComponent ngOnInit ejecutado",
        data: { timestamp: Date.now() },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    console.log(
      "📡 [CursesComponent] ngOnInit - loading inicial:",
      this.loading
    );
    console.log(
      "📡 [CursesComponent] ngOnInit - cursos inicial:",
      this.cursos.length
    );

    // Mostrar skeletons brevemente solo si no hay datos locales
    const datosLocales = this.productService.getTodosLosDatos();
    if (datosLocales.length > 0 && this.cursos.length === 0) {
      // Mostrar skeletons por un momento para mejor UX
      this.loading = true;
      this.cdr.detectChanges();

      // Luego cargar datos locales después de un breve delay
      setTimeout(() => {
        this.cursos = datosLocales;
        this.loading = false;
        console.log(
          "📡 [CursesComponent] Datos locales cargados:",
          this.cursos.length
        );
        this.cdr.detectChanges();
      }, 300); // 300ms de delay para mostrar skeletons brevemente
    } else {
      // Si no hay datos locales, mostrar skeletons mientras carga
      this.loading = true;
    }

    // Luego intentar cargar desde la API en segundo plano (sin bloquear la UI)
    this.cargarCursos().catch((error) => {
      console.error("❌ [CursesComponent] Error al cargar desde API:", error);
      // Si ya tenemos datos locales, no es crítico
      if (this.cursos.length === 0) {
        this.cursos = this.productService.getTodosLosDatos();
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
    console.log(
      "📡 [CursesComponent] ngOnInit - loading después de cargar:",
      this.loading
    );
    console.log(
      "📡 [CursesComponent] ngOnInit - cursos después de cargar:",
      this.cursos.length
    );
    this.cargarWishlist();

    // Suscribirse a cambios en los productos para actualizar automáticamente
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/6a71a13e-6f5d-4bf5-a51d-55bfedcbd571", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "refresh-issue",
        hypothesisId: "C",
        location: "curses.component.ts:ngOnInit:beforeSubscribe",
        message: "Estableciendo suscripción a productsUpdated",
        data: { timestamp: Date.now() },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
    this.productsSubscription = this.productService.productsUpdated.subscribe(
      (updatedProducts) => {
        // #region agent log
        fetch(
          "http://127.0.0.1:7242/ingest/6a71a13e-6f5d-4bf5-a51d-55bfedcbd571",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId: "debug-session",
              runId: "refresh-issue",
              hypothesisId: "C",
              location: "curses.component.ts:ngOnInit:subscription",
              message: "Productos actualizados recibidos via observable",
              data: {
                updatedProductsLength: updatedProducts.length,
                firstProduct: updatedProducts[0]?.nombre,
                currentCursosLength: this.cursos.length,
                willUpdate: updatedProducts.length > 0,
              },
              timestamp: Date.now(),
            }),
          }
        ).catch(() => {});
        // #endregion
        console.log(
          "🔄 [CursesComponent] Productos actualizados automáticamente:",
          updatedProducts.length
        );
        // Ejecutar dentro de NgZone para asegurar que Angular detecte los cambios
        this.ngZone.run(() => {
          if (updatedProducts && updatedProducts.length > 0) {
            // Actualizar los cursos con los productos del backend (que tienen _id)
            this.cursos = updatedProducts;
            console.log(
              "✅ [CursesComponent] Productos actualizados desde backend con _id"
            );
            // Forzar detección de cambios para asegurar que la vista se actualice
            this.cdr.detectChanges();
            // #region agent log
            fetch(
              "http://127.0.0.1:7242/ingest/6a71a13e-6f5d-4bf5-a51d-55bfedcbd571",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  sessionId: "debug-session",
                  runId: "refresh-issue",
                  hypothesisId: "C",
                  location:
                    "curses.component.ts:ngOnInit:subscription:afterUpdate",
                  message: "Cursos actualizados y detección de cambios forzada",
                  data: {
                    cursosLength: this.cursos.length,
                    firstCourse: this.cursos[0]?.nombre,
                  },
                  timestamp: Date.now(),
                }),
              }
            ).catch(() => {});
            // #endregion
          }
        });
      }
    );

    // Suscribirse a cambios en la wishlist
    this.wishlistService.wishlist$.subscribe((wishlist) => {
      this.wishlistProducts.clear();
      if (wishlist?.products) {
        wishlist.products.forEach((product) => {
          if (product._id) {
            this.wishlistProducts.add(product._id);
          }
        });
      }
      this.cdr.detectChanges();
    });
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/6a71a13e-6f5d-4bf5-a51d-55bfedcbd571", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: "debug-session",
        runId: "refresh-issue",
        hypothesisId: "C",
        location: "curses.component.ts:ngOnInit:afterSubscribe",
        message: "Suscripción establecida",
        data: { hasSubscription: !!this.productsSubscription },
        timestamp: Date.now(),
      }),
    }).catch(() => {});
    // #endregion
  }

  ngOnDestroy() {
    // Limpiar suscripción al destruir el componente
    if (this.productsSubscription) {
      this.productsSubscription.unsubscribe();
    }
  }

  private async cargarCursos() {
    // Solo mostrar loading si no tenemos datos locales
    if (this.cursos.length === 0) {
      this.loading = true;
    }
    this.error = null;

    // Timeout de seguridad: si la carga tarda más de 15 segundos, mostrar datos locales
    const timeoutId = setTimeout(() => {
      if (this.loading) {
        console.warn(
          "⚠️ [CursesComponent] Timeout: La carga está tardando demasiado, mostrando datos locales"
        );
        this.loading = false;
        this.error =
          "La carga está tardando más de lo esperado. Mostrando datos disponibles.";
        this.cursos = this.productService.getTodosLosDatos();
        this.cdr.detectChanges();
      }
    }, 15000);

    try {
      // #region agent log
      fetch(
        "http://127.0.0.1:7242/ingest/6a71a13e-6f5d-4bf5-a51d-55bfedcbd571",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: "debug-session",
            runId: "refresh-issue",
            hypothesisId: "A",
            location: "curses.component.ts:cargarCursos",
            message: "Iniciando carga de cursos",
            data: { cursosLength: this.cursos.length },
            timestamp: Date.now(),
          }),
        }
      ).catch(() => {});
      // #endregion
      console.log("📡 [CursesComponent] Cargando cursos desde API...");
      const cursosApi = await this.productService.traerProductosDesdeApi();
      this.cursos = cursosApi;
      // #region agent log
      fetch(
        "http://127.0.0.1:7242/ingest/6a71a13e-6f5d-4bf5-a51d-55bfedcbd571",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: "debug-session",
            runId: "refresh-issue",
            hypothesisId: "A",
            location: "curses.component.ts:cargarCursos",
            message: "Cursos cargados desde API",
            data: {
              cursosLength: this.cursos.length,
              firstCourse: this.cursos[0]?.nombre,
            },
            timestamp: Date.now(),
          }),
        }
      ).catch(() => {});
      // #endregion
      console.log("📡 [CursesComponent] Cursos cargados:", this.cursos.length);
      console.log(
        "📡 [CursesComponent] Loading después de cargar:",
        this.loading
      );

      // Actualizar productos locales con los _id del backend si es necesario
      if (
        this.cursos.length > 0 &&
        this.cursos[0] &&
        (this.cursos[0] as any)._id
      ) {
        console.log("✅ [CursesComponent] Productos tienen _id del backend");
      } else {
        console.warn(
          "⚠️ [CursesComponent] Algunos productos no tienen _id del backend"
        );
      }

      clearTimeout(timeoutId); // Limpiar timeout si la carga fue exitosa
    } catch (error) {
      console.error("❌ [CursesComponent] Error al cargar cursos:", error);
      this.error = "Error al cargar los cursos. Mostrando datos locales.";
      // Fallback: usar datos locales del servicio
      this.cursos = this.productService.getTodosLosDatos();
      clearTimeout(timeoutId); // Limpiar timeout en caso de error
    } finally {
      clearTimeout(timeoutId); // Asegurarse de limpiar el timeout
      this.loading = false;
      console.log("📡 [CursesComponent] Loading en finally:", this.loading);
      console.log(
        "📡 [CursesComponent] Cursos después de finally:",
        this.cursos.length
      );
      // Forzar detección de cambios
      this.cdr.detectChanges();
    }
  }

  agregarAlCarrito(product: Datos): void {
    this.cartService.addToCart(product);
    this.mostrarCarrito = true; // Esto activará el modal
    this.mostrarNotificacion();
  }

  cargarWishlist() {
    // Cargar wishlist inicial si el usuario está autenticado
    const token = localStorage.getItem("token");
    if (token) {
      this.wishlistService.getWishlist().subscribe({
        next: (response) => {
          this.wishlistProducts.clear();
          if (response.data?.products) {
            response.data.products.forEach((product) => {
              if (product._id) {
                this.wishlistProducts.add(product._id);
              }
            });
          }
        },
        error: (error) => {
          console.error("Error al cargar wishlist:", error);
        },
      });
    }
  }

  isInWishlist(product: Datos): boolean {
    // Buscar el producto en la wishlist por _id del backend
    const productId = (product as any)._id;
    if (!productId) {
      console.warn(
        "⚠️ [CursesComponent] isInWishlist - Producto sin _id:",
        product
      );
    }
    if (productId) {
      return this.wishlistProducts.has(productId);
    }
    return false;
  }

  toggleWishlist(product: Datos, event: Event): void {
    event.stopPropagation(); // Evitar que se active el click del card

    const token = localStorage.getItem("token");
    if (!token) {
      alert(
        "Por favor inicia sesión para agregar productos a tu lista de deseos"
      );
      return;
    }

    // Obtener el _id del backend (requerido para la wishlist)
    const productId = (product as any)._id;

    console.log("💝 [CursesComponent] toggleWishlist - Producto:", product);
    console.log("💝 [CursesComponent] toggleWishlist - productId:", productId);
    console.log(
      "💝 [CursesComponent] toggleWishlist - Tipo de productId:",
      typeof productId
    );
    console.log(
      "💝 [CursesComponent] toggleWishlist - Keys del producto:",
      Object.keys(product)
    );

    if (!productId) {
      console.warn(
        "⚠️ [CursesComponent] Producto sin _id. Intentando buscar en la lista actualizada..."
      );

      // Buscar en this.cursos primero (puede tener datos más recientes)
      let productoActualizado = this.cursos.find(
        (p) =>
          p.nombre === product.nombre &&
          p.precio === product.precio &&
          (p as any)._id
      );

      // Si no se encuentra en this.cursos, buscar en el servicio
      if (!productoActualizado) {
        const productosActualizados = this.productService.getTodosLosDatos();
        productoActualizado = productosActualizados.find(
          (p) =>
            p.nombre === product.nombre &&
            p.precio === product.precio &&
            (p as any)._id
        );
      }

      if (productoActualizado && (productoActualizado as any)._id) {
        // Actualizar el producto con el _id encontrado
        (product as any)._id = (productoActualizado as any)._id;

        // También actualizar el producto en this.cursos si existe
        const productoEnCursos = this.cursos.find(
          (p) => p.nombre === product.nombre && p.precio === product.precio
        );
        if (productoEnCursos) {
          (productoEnCursos as any)._id = (productoActualizado as any)._id;
        }

        console.log(
          "✅ [CursesComponent] _id encontrado y actualizado:",
          (product as any)._id
        );
        // Continuar con el proceso usando el _id encontrado
        const updatedProductId = (product as any)._id;
        this.procesarToggleWishlist(updatedProductId);
        return;
      }

      // Si aún no se encuentra, intentar recargar productos del backend automáticamente
      console.warn(
        "⚠️ [CursesComponent] _id no encontrado. Recargando productos del backend..."
      );
      console.log("📡 [CursesComponent] Producto buscado:", {
        nombre: product.nombre,
        precio: product.precio,
        tieneId: !!(product as any)._id,
      });

      // Mostrar un indicador visual de que se está cargando (opcional)
      // Por ahora, simplemente recargar en silencio

      // Intentar recargar productos del backend de forma asíncrona
      this.productService
        .traerProductosDesdeApi()
        .then((productosActualizados) => {
          console.log(
            "📡 [CursesComponent] Productos recargados:",
            productosActualizados.length
          );

          // Verificar si los productos recargados tienen _id (si no, la API no está disponible)
          const hayProductosConId = productosActualizados.some(
            (p) => (p as any)._id
          );

          if (!hayProductosConId) {
            console.warn(
              "⚠️ [CursesComponent] Los productos recargados no tienen _id. La API no está disponible."
            );
            alert(
              "⚠️ El servidor no está disponible en este momento.\n\n" +
                "La funcionalidad de lista de deseos requiere conexión al servidor.\n\n" +
                "Por favor:\n" +
                "1. Verifica que el servidor esté corriendo en http://localhost:3001\n" +
                "2. Verifica tu conexión a internet\n" +
                "3. Intenta nuevamente más tarde"
            );
            return;
          }

          // Buscar el producto en los datos recargados (primero por nombre y precio, luego verificar _id)
          const productoEncontrado = productosActualizados.find(
            (p) => p.nombre === product.nombre && p.precio === product.precio
          );

          console.log("🔍 [CursesComponent] Búsqueda de producto:", {
            buscando: { nombre: product.nombre, precio: product.precio },
            encontrado: productoEncontrado
              ? {
                  nombre: productoEncontrado.nombre,
                  precio: productoEncontrado.precio,
                  tieneId: !!(productoEncontrado as any)._id,
                  id:
                    (productoEncontrado as any)._id ||
                    (productoEncontrado as any).id,
                }
              : null,
            totalProductos: productosActualizados.length,
          });

          if (productoEncontrado) {
            // Si el producto encontrado tiene _id, usarlo
            if ((productoEncontrado as any)._id) {
              // Actualizar el producto con el _id encontrado
              (product as any)._id = (productoEncontrado as any)._id;

              // Actualizar también en this.cursos
              const productoEnCursos = this.cursos.find(
                (p) =>
                  p.nombre === product.nombre && p.precio === product.precio
              );
              if (productoEnCursos) {
                (productoEnCursos as any)._id = (productoEncontrado as any)._id;
              }

              // Actualizar todos los cursos con los datos recargados
              this.cursos = productosActualizados;
              this.cdr.detectChanges();

              console.log(
                "✅ [CursesComponent] _id encontrado después de recargar:",
                (productoEncontrado as any)._id
              );

              // Continuar con el proceso
              this.procesarToggleWishlist((productoEncontrado as any)._id);
            } else {
              // El producto se encontró pero no tiene _id (datos locales)
              console.warn(
                "⚠️ [CursesComponent] Producto encontrado pero sin _id. Los datos son locales, no del servidor."
              );
              alert(
                "⚠️ El servidor no está disponible en este momento.\n\n" +
                  "Se encontró el producto en los datos locales, pero la funcionalidad de lista de deseos requiere conexión al servidor.\n\n" +
                  "Por favor:\n" +
                  "1. Verifica que el servidor esté corriendo en http://localhost:3001\n" +
                  "2. Verifica tu conexión a internet\n" +
                  "3. Intenta nuevamente más tarde"
              );
            }
          } else {
            console.error(
              "❌ [CursesComponent] Producto no encontrado en los datos recargados"
            );
            console.error(
              "📋 [CursesComponent] Productos disponibles:",
              productosActualizados.map((p) => ({
                nombre: p.nombre,
                precio: p.precio,
                tieneId: !!(p as any)._id,
              }))
            );
            alert(
              "No se pudo encontrar este producto en el servidor. Por favor, recarga la página."
            );
          }
        })
        .catch((error) => {
          console.error(
            "❌ [CursesComponent] Error al recargar productos:",
            error
          );
          alert(
            "Error al conectar con el servidor. Por favor, verifica tu conexión e intenta nuevamente."
          );
        });

      return;
    }

    this.procesarToggleWishlist(productId);
  }

  private procesarToggleWishlist(productId: string): void {
    // Verificar si el producto está en la wishlist
    const isInWishlist = this.wishlistProducts.has(productId);

    if (isInWishlist) {
      // Remover de wishlist
      this.wishlistService.removeFromWishlist(productId).subscribe({
        next: () => {
          this.wishlistProducts.delete(productId);
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error("Error al remover de wishlist:", error);
          console.error("Error completo:", JSON.stringify(error, null, 2));
          const errorMessage =
            error.error?.message || error.message || "Error desconocido";
          alert(`Error al remover el producto: ${errorMessage}`);
        },
      });
    } else {
      // Agregar a wishlist
      this.wishlistService.addToWishlist(productId).subscribe({
        next: () => {
          this.wishlistProducts.add(productId);
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error("Error al agregar a wishlist:", error);
          console.error("Error completo:", JSON.stringify(error, null, 2));
          console.error("Status:", error.status);
          console.error("StatusText:", error.statusText);
          console.error("Error body:", error.error);

          let errorMessage =
            "Error al agregar el producto a la lista de deseos";

          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.message) {
            errorMessage = error.message;
          } else if (error.status === 0) {
            errorMessage =
              "Error de conexión. Verifica tu conexión a internet.";
          } else if (error.status === 401) {
            errorMessage =
              "Sesión expirada. Por favor, inicia sesión nuevamente.";
          } else if (error.status === 404) {
            errorMessage = "Producto no encontrado.";
          } else if (error.status === 400) {
            errorMessage =
              error.error?.message ||
              "El producto ya está en la lista de deseos";
          }

          alert(errorMessage);
        },
      });
    }
  }

  mostrarNotificacion() {
    this.notificacionVisible = true;
    setTimeout(() => {
      this.notificacionVisible = false;
    }, 3000); // 3 segundos
  }

  // Obtener categorías únicas de los cursos
  get categoriasUnicas(): string[] {
    const origen = this.cursos.length
      ? this.cursos
      : this.productService.getTodosLosDatos();
    const categorias = origen.map((curso) => curso.categoria);
    return [...new Set(categorias)]; // Elimina duplicados
  }

  // Cursos filtrados por categoría seleccionada
  get cursosFiltrados(): Datos[] {
    const origen = this.cursos.length
      ? this.cursos
      : this.productService.getTodosLosDatos();
    if (this.categoriaSeleccionada === "Todos") {
      return origen;
    }
    return origen.filter(
      (curso) => curso.categoria === this.categoriaSeleccionada
    );
  }

  cerrarCarrito() {
    this.mostrarCarrito = false;
  }
}

/*  this.cursos = this.productService.datos; // O usar un observable si es async */
