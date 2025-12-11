import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { CarritoService } from '../../services/cart.service';

@Component({
    selector: 'app-profile-menu',
    templateUrl: './profile-menu.component.html',
    styleUrls: ['./profile-menu.component.css']
})
export class ProfileMenuComponent implements OnDestroy {
    isMenuOpen = false;
    private subscriptions: Subscription = new Subscription();

    constructor(
        private router: Router,
        private authService: AuthService,
        private cartService: CarritoService
    ) {}

    getInitials(): string {
        const user = this.authService.getCurrentUser();
        if (user && user.name) {
            return user.name.split(' ').map((n: any[]) => n[0]).join('').toUpperCase();
        }
        return 'U';
    }

    getDisplayName(): string {
        const user = this.authService.getCurrentUser();
        return user?.name || 'Usuario';
    }

    toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
    }

    // ESTE MeTODO DEBE SOLO NAVEGAR, NO CERRAR SESIÓN
    viewProfile() {
        this.router.navigate(['/profile']); // ← Solo esto
        this.isMenuOpen = false;
    }

    goToOrderHistory() {
        this.router.navigate(['/order-history']);
        this.isMenuOpen = false;
    }

    goToCart() {
        this.router.navigate(['/cart-full']);
        this.isMenuOpen = false;
    }

    // SOLO ESTE MeTODO DEBE CERRAR SESIÓN
    logout() {
        this.authService.logout(); // ← El logout va aquí
        this.isMenuOpen = false;
    }

    ngOnDestroy() {
        this.subscriptions.unsubscribe();
    }
}