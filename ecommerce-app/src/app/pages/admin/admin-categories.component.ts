// admin-categories.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AdminCategoryService, Category } from '../../services/admin-category.service';

@Component({
    selector: 'app-admin-categories',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './admin-categories.component.html',
    styleUrls: ['./admin-categories.component.css']
})
export class AdminCategoriesComponent implements OnInit {
    categories: Category[] = [];
    loading = false;
    error: string | null = null;

    constructor(
        private categoryService: AdminCategoryService,
        private router: Router
    ) {}

    ngOnInit() {
        this.loadCategories();
    }

    loadCategories() {
        this.loading = true;
        this.error = null;

        console.log('📁 [AdminCategories] loadCategories() → Cargando categorías');

        this.categoryService.getCategories().subscribe({
            next: (response) => {
                console.log('📁 [AdminCategories] Categorías cargadas:', response);
                this.categories = response.data;
                this.loading = false;
            },
            error: (err) => {
                console.error('❌ [AdminCategories] Error al cargar categorías:', err);
                this.error = 'Error al cargar categorías. Por favor, intenta nuevamente.';
                this.loading = false;
            }
        });
    }

    createCategory() {
        this.router.navigate(['/admin/categories/new']);
    }

    editCategory(categoryId: string) {
        this.router.navigate(['/admin/categories/edit', categoryId]);
    }

    deleteCategory(categoryId: string) {
        if (!confirm('¿Estás seguro de que deseas eliminar esta categoría?')) {
            return;
        }

        console.log(`📁 [AdminCategories] deleteCategory() → Eliminando categoría ${categoryId}`);

        this.categoryService.deleteCategory(categoryId).subscribe({
            next: (response) => {
                console.log('✅ [AdminCategories] Categoría eliminada:', response);
                this.loadCategories();
            },
            error: (err) => {
                console.error('❌ [AdminCategories] Error al eliminar categoría:', err);
                alert('Error al eliminar categoría. Por favor, intenta nuevamente.');
            }
        });
    }

    goBack() {
        this.router.navigate(['/admin']);
    }
}

