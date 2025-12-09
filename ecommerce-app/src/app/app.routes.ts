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
import {OrderHistoryComponent} from "./components/order-history/order-history.component";
import {ProfileComponent} from "./components/profile/profile.component";
import {CartComponent} from "./pages/cart/cart.component";
import {CommonModule} from "@angular/common";
import {CartFullComponent} from "./pages/cart-full/cart-full.component";


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


    // Redirecciones
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule, CommonModule]
})
export class AppRoutingModule { }
