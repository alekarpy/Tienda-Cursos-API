// order.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Order {
    id: number;
    date: Date;
    total: number;
    items: any[];
    status: string;
}

@Injectable({
    providedIn: 'root'
})
export class OrderService {
    private ordersSubject = new BehaviorSubject<Order[]>(this.getOrdersFromStorage());
    public orders$ = this.ordersSubject.asObservable();

    // Retorna Observable
    getRecentOrdersObservable(limit?: number): Observable<Order[]> {
        let orders = this.getOrdersFromStorage();
        orders = orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        if (limit) {
            orders = orders.slice(0, limit);
        }

        return new Observable(observer => {
            observer.next(orders);
            observer.complete();
        });
    }

    // Retorna datos directos (sincrono)
    getRecentOrders(limit?: number): Order[] {
        let orders = this.getOrdersFromStorage();
        orders = orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        return limit ? orders.slice(0, limit) : orders;
    }

    getAllOrders(): Order[] {
        return this.getOrdersFromStorage();
    }

    createOrder(cartItems: any[], total: number): Order {
        const newOrder: Order = {
            id: Date.now(),
            date: new Date(),
            total: total,
            items: [...cartItems],
            status: 'completed'
        };

        const currentOrders = this.getOrdersFromStorage();
        currentOrders.push(newOrder);
        this.saveOrdersToStorage(currentOrders);
        this.ordersSubject.next(currentOrders);

        return newOrder;
    }

    private getOrdersFromStorage(): Order[] {
        const orders = localStorage.getItem('userOrders');
        return orders ? JSON.parse(orders) : [];
    }

    private saveOrdersToStorage(orders: Order[]): void {
        localStorage.setItem('userOrders', JSON.stringify(orders));
    }
}