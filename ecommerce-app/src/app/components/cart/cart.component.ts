// cart.component.ts
import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';
import { Datos } from  '../../../datos'

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {
    cartItems: Datos[] = [];

    constructor(
        private carritoService: CarritoService,
        private orderService: OrderService,
        private router: Router
    ) {}

    ngOnInit() {
        this.carritoService.cartUpdated$.subscribe(items => {
            this.cartItems = items;
        });
    }

    increaseQuantity(product: Datos) {
        this.carritoService.increaseQuantity(product);
    }

    decreaseQuantity(product: Datos) {
        this.carritoService.decreaseQuantity(product);
    }

    removeFromCart(product: Datos) {
        this.carritoService.removeFromCart(product);
    }

    getTotalPrice(): number {
        return this.carritoService.getTotalPrice();
    }

    checkout() {
        if (this.cartItems.length === 0) return;

        // Crear orden
        const order = this.orderService.createOrder(this.cartItems, this.getTotalPrice());

        // Limpiar carrito
        this.carritoService.clearCart();

        // Redirigir a confirmación o historial
        this.router.navigate(['/order-history']);
    }
}