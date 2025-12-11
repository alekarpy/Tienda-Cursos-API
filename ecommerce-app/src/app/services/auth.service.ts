// auth.service.ts
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.checkAuthStatus());
    public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    constructor(private router: Router) {}

    // Método para compatibilidad con tu login existente
    setAuthFromLogin(token: string, user: any): void {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        localStorage.setItem('isLoggedIn', 'true'); // ← Agrega esto
        localStorage.setItem('currentUser', JSON.stringify(user)); // ← Y esto

        this.isAuthenticatedSubject.next(true);
    }

    login(credentials: any): boolean {
        // Este método ya no se usa si tienes tu propio login
        // Pero lo mantenemos por compatibilidad
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', JSON.stringify({
            name: 'Usuario Ejemplo',
            email: credentials.email
        }));
        this.isAuthenticatedSubject.next(true);
        this.router.navigate(['/profile']);
        return true;
    }

    logout(): void {
        // Limpiar TODOS los items de autenticación
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('currentUser');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.isAuthenticatedSubject.next(false);
        this.router.navigate(['/login']);
    }

    isLoggedIn(): boolean {
        return this.checkAuthStatus();
    }

    private checkAuthStatus(): boolean {
        const hasToken = !!localStorage.getItem('token');
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

        console.log('=== AUTH SERVICE DEBUG ===');
        console.log('hasToken:', hasToken);
        console.log('isLoggedIn flag:', isLoggedIn);
        console.log('checkAuthStatus result:', hasToken || isLoggedIn);

        return hasToken || isLoggedIn;
    }

    getCurrentUser(): any {
        // Intentar obtener de currentUser primero, luego de user
        const currentUser = localStorage.getItem('currentUser');
        if (currentUser) {
            return JSON.parse(currentUser);
        }

        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    }
}