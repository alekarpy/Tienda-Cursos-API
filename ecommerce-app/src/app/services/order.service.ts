// order.service.ts
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { BehaviorSubject, Observable, catchError, throwError } from "rxjs";
import { environment } from "../../environments/environment";

export interface Order {
  id: number;
  date: Date;
  total: number;
  items: any[];
  status: string;
}

export interface OrderResponse {
  success: boolean;
  data: any;
  message?: string;
}

@Injectable({
  providedIn: "root",
})
export class OrderService {
  private ordersSubject = new BehaviorSubject<Order[]>(
    this.getOrdersFromStorage()
  );
  public orders$ = this.ordersSubject.asObservable();
  private apiUrl = `${environment.apiUrl}/orders`;

  constructor(private http: HttpClient) {}

  // Retorna Observable
  getRecentOrdersObservable(limit?: number): Observable<Order[]> {
    let orders = this.getOrdersFromStorage();
    orders = orders.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    if (limit) {
      orders = orders.slice(0, limit);
    }

    return new Observable((observer) => {
      observer.next(orders);
      observer.complete();
    });
  }

  // Retorna datos directos (sincrono)
  getRecentOrders(limit?: number): Order[] {
    let orders = this.getOrdersFromStorage();
    orders = orders.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return limit ? orders.slice(0, limit) : orders;
  }

  getAllOrders(): Order[] {
    return this.getOrdersFromStorage();
  }

  /**
   * Crea una orden en el backend (requiere autenticación)
   * @param paymentMethod Método de pago (ej: 'tarjeta', 'paypal', etc.)
   * @returns Observable con la respuesta del servidor
   */
  createOrder(paymentMethod: string): Observable<OrderResponse> {
    const token = localStorage.getItem("token");

    if (!token) {
      return throwError(() => new Error("No hay token de autenticación"));
    }

    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });

    console.log(
      "📦 [OrderService] Creando orden con método de pago:",
      paymentMethod
    );

    return this.http
      .post<OrderResponse>(this.apiUrl, { paymentMethod }, { headers })
      .pipe(
        catchError((error) => {
          console.error("❌ [OrderService] Error al crear orden:", error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Obtiene todas las órdenes del usuario autenticado desde el backend
   * @returns Observable con las órdenes del usuario
   */
  getUserOrders(): Observable<OrderResponse> {
    const token = localStorage.getItem("token");

    if (!token) {
      return throwError(() => new Error("No hay token de autenticación"));
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    console.log("📦 [OrderService] Obteniendo órdenes del usuario");

    return this.http.get<OrderResponse>(this.apiUrl, { headers }).pipe(
      catchError((error) => {
        console.error("❌ [OrderService] Error al obtener órdenes:", error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Confirma el pago de una orden y cambia su estado a "Completado"
   * @param orderId ID de la orden a confirmar
   * @returns Observable con la respuesta del servidor
   */
  confirmPayment(orderId: string): Observable<OrderResponse> {
    const token = localStorage.getItem("token");

    if (!token) {
      return throwError(() => new Error("No hay token de autenticación"));
    }

    const headers = new HttpHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    });

    console.log("💳 [OrderService] Confirmando pago para orden:", orderId);

    return this.http
      .post<OrderResponse>(
        `${this.apiUrl}/${orderId}/confirm-payment`,
        {},
        { headers }
      )
      .pipe(
        catchError((error) => {
          console.error("❌ [OrderService] Error al confirmar pago:", error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Crea una orden local (para compatibilidad con código existente)
   * @deprecated Usar createOrder() para crear órdenes en el backend
   */
  createOrderLocal(cartItems: any[], total: number): Order {
    const newOrder: Order = {
      id: Date.now(),
      date: new Date(),
      total: total,
      items: [...cartItems],
      status: "completed",
    };

    const currentOrders = this.getOrdersFromStorage();
    currentOrders.push(newOrder);
    this.saveOrdersToStorage(currentOrders);
    this.ordersSubject.next(currentOrders);

    return newOrder;
  }

  private getOrdersFromStorage(): Order[] {
    const orders = localStorage.getItem("userOrders");
    return orders ? JSON.parse(orders) : [];
  }

  private saveOrdersToStorage(orders: Order[]): void {
    localStorage.setItem("userOrders", JSON.stringify(orders));
  }
}
