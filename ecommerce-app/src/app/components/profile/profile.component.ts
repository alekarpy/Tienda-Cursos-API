import {Component, OnInit, OnDestroy, Input} from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { UserService } from '../../services/user.service';
import { OrderService } from '../../services/order.service';
import { CarritoService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';


@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css'],
    standalone: true,
    imports: [CommonModule]
})
export class ProfileComponent implements OnInit, OnDestroy {
    user: any;
    recentOrders: any[] = [];
    cartItems: any[] = [];


    private subscriptions: Subscription = new Subscription();




    constructor(
        private userService: UserService,
        private orderService: OrderService,
        private cartService: CarritoService,
        private router: Router,


    ) {}


    getDisplayName(): string {
        const user = this.userService.getCurrentUser();
        return user.username || 'Usuario'; // ← Directamente desde el usuario
    }


    ngOnInit() {
        console.log('=== DEBUG PROFILE COMPONENT ===');

        this.loadUserData();
        this.loadRecentOrders();
        this.loadCartItems();

        // Las órdenes se crearán solo en OrderHistoryComponent si no existen
    }

    loadUserData() {
        this.user = this.userService.getCurrentUser();
        console.log('Usuario cargado:', this.user);
    }

    loadRecentOrders() {
        // Usar el servicio para obtener órdenes reales
        this.recentOrders = this.orderService.getRecentOrders(5);
        console.log('Órdenes recientes cargadas:', this.recentOrders);

        // Si no hay órdenes, mostrar array vacío (no crear ejemplos aquí)
        if (this.recentOrders.length === 0) {
            console.log('No hay órdenes recientes. Se crearán en OrderHistory si es necesario.');
        }
    }

    loadCartItems() {
        const cartSubscription = this.cartService.cartUpdated$.subscribe(items => {
            console.log('Carrito actualizado (observable):', items);
            this.cartItems = items;
        });
        this.subscriptions.add(cartSubscription);

        this.cartItems = this.cartService.cartItems;
        console.log('Carrito actual (directo):', this.cartItems);
    }

    formatDate(date: Date | string): string {
        if (!date) return 'Fecha no disponible';
        const dateObj = new Date(date);
        return dateObj.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    getCartTotal(): number {
        return this.cartService.getTotalPrice();
    }

    getMemberSince(): string {
        if (this.user?.createdAt) {
            return this.formatDate(this.user.createdAt);
        }
        return this.formatDate(new Date());
    }

    goToOrderHistory() {
        this.router.navigate(['/order-history']);
    }

    goToCart() {
        this.router.navigate(['/cart-full']);
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
}