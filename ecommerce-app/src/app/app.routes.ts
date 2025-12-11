import { Routes, RouterModule } from '@angular/router';
import {HeroComponent} from './components/hero/hero.component';
import {SobreNosotrosComponent} from './pages/sobre-nosotros/sobre-nosotros.component';
import { NgModule } from '@angular/core';
import {InicioComponent} from './pages/inicio/inicio.component';
import {CursesComponent} from './components/curses/curses.component';
import {CheckoutComponent} from './pages/checkout/checkout.component';
import {ContactoComponent} from './pages/contacto/contacto.component';
import {LoginComponent} from './pages/login/login.component';
import {RegisterComponent} from "./pages/register/register.component";
import {AuthGuard} from './guards/auth.guard';
import {AdminGuard} from './guards/admin.guard';
import {OrderHistoryComponent} from "./components/order-history/order-history.component";
import {ProfileComponent} from "./components/profile/profile.component";
import {CartComponent} from "./pages/cart/cart.component";
import {CommonModule} from "@angular/common";
import {CartFullComponent} from "./pages/cart-full/cart-full.component";
import {AdminDashboardComponent} from "./pages/admin/admin-dashboard.component";
import {AdminProductsComponent} from "./pages/admin/admin-products.component";
import {AdminProductFormComponent} from "./pages/admin/admin-product-form.component";
import {AdminCategoriesComponent} from "./pages/admin/admin-categories.component";
import {AdminCategoryFormComponent} from "./pages/admin/admin-category-form.component";


export const routes: Routes = [
    // Rutas PÚBLICAS (sin AuthGuard)
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'inicio', component: InicioComponent },
    { path: 'sobrenosotros', component: SobreNosotrosComponent },
    { path: 'cursos', component: CursesComponent },
    { path: 'checkout', component: CheckoutComponent },
    { path: 'contacto', component: ContactoComponent },
    { path: 'hero', component: HeroComponent },

    // Rutas PROTEGIDAS (con AuthGuard) - SOLO estas
    { path: 'profile', component: ProfileComponent, canActivate: [AuthGuard] },
    { path: 'order-history', component: OrderHistoryComponent, canActivate: [AuthGuard] },
    { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
    { path: 'cart-full', component: CartFullComponent, canActivate: [AuthGuard] },

    // Rutas de ADMINISTRACIÓN (con AdminGuard) - Solo para administradores
    { path: 'admin', component: AdminDashboardComponent, canActivate: [AdminGuard] },
    { path: 'admin/products', component: AdminProductsComponent, canActivate: [AdminGuard] },
    { path: 'admin/products/new', component: AdminProductFormComponent, canActivate: [AdminGuard] },
    { path: 'admin/products/edit/:id', component: AdminProductFormComponent, canActivate: [AdminGuard] },
    { path: 'admin/categories', component: AdminCategoriesComponent, canActivate: [AdminGuard] },
    { path: 'admin/categories/new', component: AdminCategoryFormComponent, canActivate: [AdminGuard] },
    { path: 'admin/categories/edit/:id', component: AdminCategoryFormComponent, canActivate: [AdminGuard] },


    // Redirecciones
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule, CommonModule]
})
export class AppRoutingModule { }
