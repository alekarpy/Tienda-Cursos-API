// admin-category-form.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AdminCategoryService, Category } from '../../services/admin-category.service';

@Component({
    selector: 'app-admin-category-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './admin-category-form.component.html',
    styleUrls: ['./admin-category-form.component.css']
})
export class AdminCategoryFormComponent implements OnInit {
    categoryForm: FormGroup;
    categories: Category[] = [];
    isEditMode = false;
    categoryId: string | null = null;
    loading = false;
    error: string | null = null;

    constructor(
        private fb: FormBuilder,
        private categoryService: AdminCategoryService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.categoryForm = this.fb.group({
            name: ['', [Validators.required, Validators.minLength(2)]],
            description: ['', [Validators.required, Validators.minLength(5)]],
            imageURL: ['']
        });
    }

    ngOnInit() {
        this.loadCategories();

        const id = this.route.snapshot.paramMap.get('id');
        if (id && id !== 'new') {
            this.isEditMode = true;
            this.categoryId = id;
            this.loadCategory(id);
        }
    }

    loadCategories() {
        console.log('📁 [AdminCategoryForm] loadCategories() → Cargando categorías');
        this.categoryService.getCategories().subscribe({
            next: (response) => {
                console.log('📁 [AdminCategoryForm] Categorías cargadas:', response);
                this.categories = response.data;
            },
            error: (err) => {
                console.error('❌ [AdminCategoryForm] Error al cargar categorías:', err);
            }
        });
    }

    loadCategory(id: string) {
        this.loading = true;
        console.log(`📁 [AdminCategoryForm] loadCategory() → Cargando categoría ${id}`);
        
        this.categoryService.getCategoryById(id).subscribe({
            next: (response) => {
                console.log('📁 [AdminCategoryForm] Categoría cargada:', response);
                const category = response.data;
                this.categoryForm.patchValue({
                    name: category.name,
                    description: category.description,
                    imageURL: category.imageURL || ''
                });
                this.loading = false;
            },
            error: (err) => {
                console.error('❌ [AdminCategoryForm] Error al cargar categoría:', err);
                this.error = 'Error al cargar categoría';
                this.loading = false;
            }
        });
    }

    onSubmit() {
        if (this.categoryForm.invalid) {
            console.log('❌ [AdminCategoryForm] Formulario inválido');
            return;
        }

        this.loading = true;
        this.error = null;

        const categoryData = this.categoryForm.value;
        console.log(`📁 [AdminCategoryForm] onSubmit() → ${this.isEditMode ? 'Actualizando' : 'Creando'} categoría:`, categoryData);

        const operation = this.isEditMode
            ? this.categoryService.updateCategory(this.categoryId!, categoryData)
            : this.categoryService.createCategory(categoryData);

        operation.subscribe({
            next: (response) => {
                console.log(`✅ [AdminCategoryForm] Categoría ${this.isEditMode ? 'actualizada' : 'creada'}:`, response);
                this.router.navigate(['/admin/categories']);
            },
            error: (err) => {
                console.error(`❌ [AdminCategoryForm] Error al ${this.isEditMode ? 'actualizar' : 'crear'} categoría:`, err);
                this.error = `Error al ${this.isEditMode ? 'actualizar' : 'crear'} categoría. Por favor, intenta nuevamente.`;
                this.loading = false;
            }
        });
    }

    goBack() {
        this.router.navigate(['/admin/categories']);
    }
}

