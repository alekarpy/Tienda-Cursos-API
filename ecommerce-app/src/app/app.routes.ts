import { Routes, RouterModule } from "@angular/router";
import { HeroComponent } from "./components/hero/hero.component";
import { SobreNosotrosComponent } from "./pages/sobre-nosotros/sobre-nosotros.component";
import { NgModule } from "@angular/core";
import { InicioComponent } from "./pages/inicio/inicio.component";
import { CursesComponent } from "./components/curses/curses.component";
import { CheckoutComponent } from "./pages/checkout/checkout.component";
import { ContactoComponent } from "./pages/contacto/contacto.component";
import { LoginComponent } from "./pages/login/login.component";
import { RegisterComponent } from "./pages/register/register.component";
import { CommonModule } from "@angular/common";
import { AuthGuard } from "./guards/auth.guard";
import { FormDeactivateGuard } from "./guards/form-deactivate.guard";

export const routes: Routes = [
  // Redirecciones
  { path: "", redirectTo: "login", pathMatch: "full" },

  // Rutas PÚBLICAS (sin AuthGuard)
  { path: "login", component: LoginComponent },
  { path: "register", component: RegisterComponent },
  { path: "inicio", component: InicioComponent },
  { path: "sobrenosotros", component: SobreNosotrosComponent },
  { path: "cursos", component: CursesComponent },
  { path: "contacto", component: ContactoComponent },
  { path: "hero", component: HeroComponent },

  // Ruta PROTEGIDA: Checkout (requiere autenticación y protege formulario)
  {
    path: "checkout",
    component: CheckoutComponent,
    canActivate: [AuthGuard],
    canDeactivate: [FormDeactivateGuard],
  },
  {
    path: "checkout/success",
    loadComponent: () =>
      import("./pages/checkout-success/checkout-success.component").then(
        (m) => m.CheckoutSuccessComponent
      ),
  },
  {
    path: "checkout/cancel",
    loadComponent: () =>
      import("./pages/checkout-cancel/checkout-cancel.component").then(
        (m) => m.CheckoutCancelComponent
      ),
  },

  // Rutas PROTEGIDAS (con AuthGuard) - Carga diferida (Lazy Loading)
  // Módulo de Usuario/Perfil - cada ruta se carga de forma lazy
  // Importamos las rutas del módulo de usuario y las expandimos
  // Nota: En Angular standalone, para rutas sin prefijo común, usamos loadComponent individual
  // pero las agrupamos conceptualmente en el archivo user.routes.ts
  {
    path: "profile",
    loadComponent: () =>
      import("./components/profile/profile.component").then(
        (m) => m.ProfileComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "order-history",
    loadComponent: () =>
      import("./components/order-history/order-history.component").then(
        (m) => m.OrderHistoryComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "wishlist",
    loadComponent: () =>
      import("./pages/wishlist/wishlist.component").then(
        (m) => m.WishlistComponent
      ),
    canActivate: [AuthGuard],
  },
  {
    path: "cart",
    loadComponent: () =>
      import("./pages/cart/cart.component").then((m) => m.CartComponent),
    canActivate: [AuthGuard],
  },
  {
    path: "cart-full",
    loadComponent: () =>
      import("./pages/cart-full/cart-full.component").then(
        (m) => m.CartFullComponent
      ),
    canActivate: [AuthGuard],
  },

  // Rutas de ADMINISTRACIÓN (con AdminGuard) - Carga diferida (Lazy Loading)
  {
    path: "admin",
    loadChildren: () =>
      import("./routes/admin.routes").then((m) => m.ADMIN_ROUTES),
  },

  // Redirección para rutas no encontradas
  { path: "**", redirectTo: "login" },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule, CommonModule],
})
export class AppRoutingModule {}
