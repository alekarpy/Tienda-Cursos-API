import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { OrderService } from "../../services/order.service";
import { PayPalService } from "../../services/paypal.service";

@Component({
  selector: "app-checkout-success",
  templateUrl: "./checkout-success.component.html",
  styleUrls: ["./checkout-success.component.css"],
  standalone: true,
  imports: [CommonModule],
})
export class CheckoutSuccessComponent implements OnInit {
  loading = true;
  error: string | null = null;
  order: any = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService,
    private paypalService: PayPalService
  ) {}

  ngOnInit() {
    // Obtener parámetros de la URL de PayPal
    this.route.queryParams.subscribe((params) => {
      const token = params["token"]; // Este es el paypalOrderId
      const payerId = params["PayerID"];
      const orderId =
        params["orderId"] || localStorage.getItem("pendingPayPalOrderId");

      console.log("📦 [CheckoutSuccess] Parámetros recibidos:", {
        token,
        payerId,
        orderId,
      });

      if (token && orderId) {
        // token es el paypalOrderId que PayPal devuelve
        this.capturePayPalPayment(token, orderId);
      } else {
        this.loading = false;
        this.error =
          "Parámetros de PayPal no encontrados. Por favor, verifica tu orden en el historial.";
      }
    });
  }

  private capturePayPalPayment(paypalOrderId: string, orderId: string) {
    console.log("💳 [CheckoutSuccess] Capturando pago de PayPal:", {
      paypalOrderId,
      orderId,
    });

    this.paypalService.captureOrder(paypalOrderId, orderId).subscribe({
      next: (response) => {
        console.log(
          "✅ [CheckoutSuccess] Pago capturado exitosamente:",
          response
        );
        this.order = response.data.order;
        this.loading = false;

        // Limpiar el orderId pendiente
        localStorage.removeItem("pendingPayPalOrderId");

        // Redirigir al historial después de 3 segundos
        setTimeout(() => {
          this.router.navigate(["/order-history"], {
            queryParams: {
              success: "true",
              orderId: orderId,
            },
          });
        }, 3000);
      },
      error: (error) => {
        console.error("❌ [CheckoutSuccess] Error al capturar pago:", error);
        this.loading = false;
        this.error =
          error.error?.message ||
          "Error al procesar el pago. Por favor, contacta al soporte.";
      },
    });
  }

  goToOrderHistory() {
    this.router.navigate(["/order-history"]);
  }
}
