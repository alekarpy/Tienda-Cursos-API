import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import { environment } from "../../environments/environment";

export interface PayPalCreateOrderResponse {
  success: boolean;
  data: {
    paypalOrderId: string;
    approvalUrl: string;
    status: string;
  };
}

export interface PayPalCaptureResponse {
  success: boolean;
  message: string;
  data: {
    order: any;
    paypalCapture: any;
  };
}

@Injectable({
  providedIn: "root",
})
export class PayPalService {
  private apiUrl = `${environment.apiUrl}/paypal`;

  constructor(private http: HttpClient) {}

  /**
   * Crea una orden de PayPal
   * @param orderId ID de la orden en nuestra base de datos
   * @returns Observable con la URL de aprobación de PayPal
   */
  createOrder(orderId: string): Observable<PayPalCreateOrderResponse> {
    const token = localStorage.getItem("token");

    if (!token) {
      return throwError(() => new Error("No hay token de autenticación"));
    }

    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });

    console.log(
      "💳 [PayPalService] Creando orden de PayPal para orden:",
      orderId
    );

    return this.http
      .post<PayPalCreateOrderResponse>(
        `${this.apiUrl}/create-order`,
        { orderId },
        { headers }
      )
      .pipe(
        catchError((error) => {
          console.error(
            "❌ [PayPalService] Error al crear orden de PayPal:",
            error
          );
          return throwError(() => error);
        })
      );
  }

  /**
   * Captura un pago de PayPal
   * @param paypalOrderId ID de la orden de PayPal
   * @param orderId ID de la orden en nuestra base de datos
   * @returns Observable con la confirmación del pago
   */
  captureOrder(
    paypalOrderId: string,
    orderId: string
  ): Observable<PayPalCaptureResponse> {
    const token = localStorage.getItem("token");

    if (!token) {
      return throwError(() => new Error("No hay token de autenticación"));
    }

    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });

    console.log("💳 [PayPalService] Capturando pago de PayPal:", {
      paypalOrderId,
      orderId,
    });

    return this.http
      .post<PayPalCaptureResponse>(
        `${this.apiUrl}/capture-order`,
        { paypalOrderId, orderId },
        { headers }
      )
      .pipe(
        catchError((error) => {
          console.error(
            "❌ [PayPalService] Error al capturar pago de PayPal:",
            error
          );
          return throwError(() => error);
        })
      );
  }
}
