// admin-products.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminProductService, Product } from '../../services/admin-product.service';

@Component({
    selector: 'app-admin-products',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './admin-products.component.html',
    styleUrls: ['./admin-products.component.css']
})
export class AdminProductsComponent implements OnInit {
    products: Product[] = [];
    loading = false;
    error: string | null = null;
    currentPage = 1;
    totalPages = 1;
    totalProducts = 0;

    constructor(
        private productService: AdminProductService,
        private router: Router
    ) {}

    ngOnInit() {
        this.loadProducts();
    }

    loadProducts(page: number = 1) {
        this.loading = true;
        this.error = null;
        this.currentPage = page;

        console.log(`📦 [AdminProducts] loadProducts() → Cargando página ${page}`);

        this.productService.getProducts(page, 10).subscribe({
            next: (response) => {
                console.log('📦 [AdminProducts] Productos cargados:', response);
                this.products = response.data;
                this.totalProducts = response.total;
                this.totalPages = response.pagination.pages;
                this.loading = false;
            },
            error: (err) => {
                console.error('❌ [AdminProducts] Error al cargar productos:', err);
                this.error = 'Error al cargar productos. Por favor, intenta nuevamente.';
                this.loading = false;
            }
        });
    }

    createProduct() {
        this.router.navigate(['/admin/products/new']);
    }

    editProduct(productId: string) {
        this.router.navigate(['/admin/products/edit', productId]);
    }

    deleteProduct(productId: string) {
        if (!confirm('¿Estás seguro de que deseas eliminar este producto?')) {
            return;
        }

        console.log(`📦 [AdminProducts] deleteProduct() → Eliminando producto ${productId}`);

        this.productService.deleteProduct(productId).subscribe({
            next: (response) => {
                console.log('✅ [AdminProducts] Producto eliminado:', response);
                this.loadProducts(this.currentPage);
            },
            error: (err) => {
                console.error('❌ [AdminProducts] Error al eliminar producto:', err);
                alert('Error al eliminar producto. Por favor, intenta nuevamente.');
            }
        });
    }

    goBack() {
        this.router.navigate(['/admin']);
    }
}

