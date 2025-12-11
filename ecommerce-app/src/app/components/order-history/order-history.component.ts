import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderService, Order } from '../../services/order.service';

@Component({
    selector: 'app-order-history',
    templateUrl: './order-history.component.html',
    styleUrls: ['./order-history.component.css'],
    standalone: true,
    imports: [CommonModule]
})
export class OrderHistoryComponent implements OnInit {
    allOrders: any[] = []; // Cambiar a any[] temporalmente

    constructor(
        private orderService: OrderService,
        private router: Router
    ) {}

    ngOnInit() {
        this.loadOrders();
    }

    loadOrders() {
        this.allOrders = this.orderService.getAllOrders();
        console.log('📦 OrderHistory - Órdenes cargadas:', this.allOrders);

        // Si no hay órdenes, crear algunas de ejemplo
        if (this.allOrders.length === 0) {
            this.createSampleOrders();
        }
    }

    createSampleOrders() {
        console.log('🔄 Creando órdenes de ejemplo...');

        const sampleOrders = [
            {
                id: 1001,
                date: new Date('2024-01-15'),
                total: 1899,
                items: [
                    {
                        id: 1,
                        nombre: 'Javascript Avanzado: Domínalo Como Un Master',
                        precio: 1899,
                        cantidad: 1,
                        imagen: 'assets/img/img6.png',
                        categoria: 'Desarrollo Web'
                    }
                ],
                status: 'completed',
                showDetails: false // ← Agregar esta propiedad
            },
            {
                id: 1002,
                date: new Date('2024-02-01'),
                total: 899,
                items: [
                    {
                        id: 2,
                        nombre: 'React: Crea Aplicaciones Web de Alto Nivel',
                        precio: 899,
                        cantidad: 1,
                        imagen: 'assets/img/img2.png',
                        categoria: 'Desarrollo Web'
                    }
                ],
                status: 'completed',
                showDetails: false // ← Agregar esta propiedad
            }
        ];

        // Usar el OrderService para crear las órdenes
        sampleOrders.forEach(order => {
            this.orderService.createOrder(order.items, order.total);
        });

        // Recargar las órdenes
        this.allOrders = this.orderService.getAllOrders();

        // Agregar la propiedad showDetails a todas las órdenes
        this.allOrders.forEach(order => {
            order.showDetails = false;
        });
    }

    // 🔥 AGREGAR ESTE MÉTODO FALTANTE
    getStatusClass(status: string): string {
        return status || 'completed';
    }

    getStatusText(status: string): string {
        const statusMap: { [key: string]: string } = {
            'completed': 'Completada',
            'pending': 'Pendiente',
            'cancelled': 'Cancelada'
        };
        return statusMap[status] || 'Completada';
    }

    toggleOrderDetails(order: any) {
        order.showDetails = !order.showDetails;
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

    getTotalCourses(): number {
        return this.allOrders.reduce((total, order) =>
            total + order.items.length, 0
        );
    }

    getTotalSpent(): number {
        return this.allOrders.reduce((total, order) =>
            total + order.total, 0
        );
    }

    getUniqueMonths(): number {
        const months = new Set(
            this.allOrders.map(order =>
                new Date(order.date).toLocaleDateString('es-ES', { year: 'numeric', month: 'long' })
            )
        );
        return months.size;
    }

    getFirstPurchaseDate(): string {
        if (this.allOrders.length === 0) return 'N/A';
        const dates = this.allOrders.map(order => new Date(order.date));
        const firstDate = new Date(Math.min(...dates.map(date => date.getTime())));
        return this.formatDate(firstDate);
    }

    goBack() {
        this.router.navigate(['/profile']);
    }

    goToCourses() {
        this.router.navigate(['/cursos']);
    }
}