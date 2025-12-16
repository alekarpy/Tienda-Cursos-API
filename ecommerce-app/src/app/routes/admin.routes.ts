import { Routes } from "@angular/router";
import { AdminGuard } from "../guards/admin.guard";

/**
 * Rutas del módulo de Administración
 * Estas rutas se cargan de forma diferida (lazy loading)
 * Solo se cargan cuando un administrador accede a alguna de estas rutas
 */

export const ADMIN_ROUTES: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("../pages/admin/admin-dashboard.component").then(
        (m) => m.AdminDashboardComponent
      ),
    canActivate: [AdminGuard],
  },
  {
    path: "products",
    loadComponent: () =>
      import("../pages/admin/admin-products.component").then(
        (m) => m.AdminProductsComponent
      ),
    canActivate: [AdminGuard],
  },
  {
    path: "products/new",
    loadComponent: () =>
      import("../pages/admin/admin-product-form.component").then(
        (m) => m.AdminProductFormComponent
      ),
    canActivate: [AdminGuard],
  },
  {
    path: "products/edit/:id",
    loadComponent: () =>
      import("../pages/admin/admin-product-form.component").then(
        (m) => m.AdminProductFormComponent
      ),
    canActivate: [AdminGuard],
  },
  {
    path: "categories",
    loadComponent: () =>
      import("../pages/admin/admin-categories.component").then(
        (m) => m.AdminCategoriesComponent
      ),
    canActivate: [AdminGuard],
  },
  {
    path: "categories/new",
    loadComponent: () =>
      import("../pages/admin/admin-category-form.component").then(
        (m) => m.AdminCategoryFormComponent
      ),
    canActivate: [AdminGuard],
  },
  {
    path: "categories/edit/:id",
    loadComponent: () =>
      import("../pages/admin/admin-category-form.component").then(
        (m) => m.AdminCategoryFormComponent
      ),
    canActivate: [AdminGuard],
  },
];

