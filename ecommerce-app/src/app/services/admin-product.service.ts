// admin-product.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Product {
    _id?: string;
    title: string;
    description: string;
    price: number;
    category: string | { _id: string; name: string };
    instructor?: string;
    duration: number;
    level: 'principiante' | 'intermedio' | 'avanzado';
    image?: string;
    students?: number;
    rating?: number;
    isActive?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export interface ProductResponse {
    success: boolean;
    data: Product;
}

export interface ProductsResponse {
    success: boolean;
    count: number;
    total: number;
    pagination: {
        page: number;
        pages: number;
    };
    data: Product[];
}

@Injectable({
    providedIn: 'root'
})
export class AdminProductService {
    private apiUrl = `${environment.apiUrl}/products`;

    constructor(private http: HttpClient) {}

    private getHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        });
    }

    // CREATE - Crear producto
    createProduct(product: Partial<Product>): Observable<ProductResponse> {
        console.log('📦 [AdminProductService] createProduct() → Creando producto:', product);
        return this.http.post<ProductResponse>(this.apiUrl, product, {
            headers: this.getHeaders()
        });
    }

    // READ - Obtener todos los productos
    getProducts(page: number = 1, limit: number = 10): Observable<ProductsResponse> {
        console.log(`📦 [AdminProductService] getProducts() → Página ${page}, Límite ${limit}`);
        return this.http.get<ProductsResponse>(`${this.apiUrl}?page=${page}&limit=${limit}`, {
            headers: this.getHeaders()
        });
    }

    // READ - Obtener producto por ID
    getProductById(id: string): Observable<ProductResponse> {
        console.log(`📦 [AdminProductService] getProductById() → ID: ${id}`);
        return this.http.get<ProductResponse>(`${this.apiUrl}/${id}`, {
            headers: this.getHeaders()
        });
    }

    // UPDATE - Actualizar producto
    updateProduct(id: string, product: Partial<Product>): Observable<ProductResponse> {
        console.log(`📦 [AdminProductService] updateProduct() → ID: ${id}`, product);
        return this.http.put<ProductResponse>(`${this.apiUrl}/${id}`, product, {
            headers: this.getHeaders()
        });
    }

    // DELETE - Eliminar producto
    deleteProduct(id: string): Observable<{ success: boolean; message: string }> {
        console.log(`📦 [AdminProductService] deleteProduct() → ID: ${id}`);
        return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`, {
            headers: this.getHeaders()
        });
    }
}

