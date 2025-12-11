// auth.guard.ts
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private authService: AuthService, private router: Router) {}

    canActivate(): boolean {
        console.log('=== AUTH GUARD DEBUG ===');
        console.log('1. Verificando autenticación...');

        const isLoggedIn = this.authService.isLoggedIn();
        console.log('2. isLoggedIn result:', isLoggedIn);

        const token = localStorage.getItem('token');
        const isLoggedInFlag = localStorage.getItem('isLoggedIn');
        const currentUser = localStorage.getItem('currentUser');
        const user = localStorage.getItem('user');

        console.log('3. localStorage items:');
        console.log('   - token:', token ? 'EXISTE' : 'NO EXISTE');
        console.log('   - isLoggedIn:', isLoggedInFlag);
        console.log('   - currentUser:', currentUser);
        console.log('   - user:', user);

        if (isLoggedIn) {
            console.log('4. ✅ Acceso PERMITIDO a la ruta');
            return true;
        } else {
            console.log('4. ❌ Acceso DENEGADO - redirigiendo a login');
            this.router.navigate(['/login']);
            return false;
        }
    }
}