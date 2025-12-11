// admin-category.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Category {
    _id?: string;
    name: string;
    description: string;
    imageURL?: string;
    parentCategory?: string | { _id: string; name: string };
    courses?: string[];
    createdAt?: string;
    updatedAt?: string;
}

export interface CategoryResponse {
    success: boolean;
    data: Category;
}

export interface CategoriesResponse {
    success: boolean;
    count: number;
    total: number;
    data: Category[];
}

@Injectable({
    providedIn: 'root'
})
export class AdminCategoryService {
    private apiUrl = `${environment.apiUrl}/categories`;

    constructor(private http: HttpClient) {}

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
    }

    // CREATE - Crear categoría
    createCategory(category: Partial<Category>): Observable<CategoryResponse> {
        console.log('📁 [AdminCategoryService] createCategory() → Creando categoría:', category);
        return this.http.post<CategoryResponse>(this.apiUrl, category, {
            headers: this.getHeaders()
        });
    }

    // READ - Obtener todas las categorías
    getCategories(): Observable<CategoriesResponse> {
        console.log('📁 [AdminCategoryService] getCategories() → Obteniendo categorías');
        return this.http.get<CategoriesResponse>(this.apiUrl, {
            headers: this.getHeaders()
        });
    }

    // READ - Obtener categoría por ID
    getCategoryById(id: string): Observable<CategoryResponse> {
        console.log(`📁 [AdminCategoryService] getCategoryById() → ID: ${id}`);
        return this.http.get<CategoryResponse>(`${this.apiUrl}/${id}`, {
            headers: this.getHeaders()
        });
    }

    // UPDATE - Actualizar categoría
    updateCategory(id: string, category: Partial<Category>): Observable<CategoryResponse> {
        console.log(`📁 [AdminCategoryService] updateCategory() → ID: ${id}`, category);
        return this.http.put<CategoryResponse>(`${this.apiUrl}/${id}`, category, {
            headers: this.getHeaders()
        });
    }

    // DELETE - Eliminar categoría
    deleteCategory(id: string): Observable<{ success: boolean; message: string }> {
        console.log(`📁 [AdminCategoryService] deleteCategory() → ID: ${id}`);
        return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`, {
            headers: this.getHeaders()
        });
    }
}

