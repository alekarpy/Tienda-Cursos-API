// admin-dashboard.component.ts
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AuthService } from "../../services/auth.service";

@Component({
  selector: "app-admin-dashboard",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./admin-dashboard.component.html",
  styleUrls: ["./admin-dashboard.component.css"],
})
export class AdminDashboardComponent implements OnInit {
  currentUser: any;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // 🚀 LAZY LOADING: Este log solo aparece cuando navegas a /admin
    console.log(
      "🚀 [LAZY LOADING] ✅ AdminDashboard cargado - Módulo Admin se cargó de forma diferida"
    );
    this.currentUser = this.authService.getCurrentUser();
    console.log("👤 [AdminDashboard] Usuario actual:", this.currentUser);
  }

  navigateToProducts() {
    this.router.navigate(["/admin/products"]);
  }

  navigateToCategories() {
    this.router.navigate(["/admin/categories"]);
  }

  logout() {
    this.authService.logout();
  }
}
