// admin-products.component.ts
import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import {
  AdminProductService,
  Product,
} from "../../services/admin-product.service";
import { ProductService } from "../../services/product.service";
import { TableSkeletonComponent } from "../../components/table-skeleton/table-skeleton.component";

@Component({
  selector: "app-admin-products",
  standalone: true,
  imports: [CommonModule, TableSkeletonComponent],
  templateUrl: "./admin-products.component.html",
  styleUrls: ["./admin-products.component.css"],
})
export class AdminProductsComponent implements OnInit {
  products: Product[] = [];
  loading = false;
  error: string | null = null;
  currentPage = 1;
  totalPages = 1;
  totalProducts = 0;

  constructor(
    private productService: AdminProductService,
    private router: Router,
    private publicProductService: ProductService
  ) {}

  ngOnInit() {
    // 🚀 LAZY LOADING: Este log solo aparece cuando navegas a /admin/products
    console.log(
      "🚀 [LAZY LOADING] ✅ AdminProductsComponent cargado - Módulo Admin se cargó de forma diferida"
    );
    this.loadProducts();
  }

  loadProducts(page: number = 1) {
    this.loading = true;
    this.error = null;
    this.currentPage = page;

    console.log(`📦 [AdminProducts] loadProducts() → Cargando página ${page}`);

    this.productService.getProducts(page, 10).subscribe({
      next: (response) => {
        // #region agent log
        fetch(
          "http://127.0.0.1:7242/ingest/6a71a13e-6f5d-4bf5-a51d-55bfedcbd571",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId: "debug-session",
              runId: "admin-products",
              hypothesisId: "C",
              location: "admin-products.component.ts:next",
              message: "Respuesta exitosa de productos",
              data: {
                hasData: !!response.data,
                dataLength: response.data?.length,
                total: response.total,
              },
              timestamp: Date.now(),
            }),
          }
        ).catch(() => {});
        // #endregion
        console.log("📦 [AdminProducts] Productos cargados:", response);
        this.products = response.data;
        this.totalProducts = response.total;
        this.totalPages = response.pagination.pages;
        this.loading = false;
      },
      error: (err) => {
        // #region agent log
        fetch(
          "http://127.0.0.1:7242/ingest/6a71a13e-6f5d-4bf5-a51d-55bfedcbd571",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId: "debug-session",
              runId: "admin-products",
              hypothesisId: "D",
              location: "admin-products.component.ts:error",
              message: "Error HTTP al cargar productos",
              data: {
                status: err.status,
                statusText: err.statusText,
                error: err.error,
                message: err.message,
                url: err.url,
              },
              timestamp: Date.now(),
            }),
          }
        ).catch(() => {});
        // #endregion
        console.error("❌ [AdminProducts] Error al cargar productos:", err);
        console.error("❌ [AdminProducts] Detalles del error:", {
          status: err.status,
          statusText: err.statusText,
          error: err.error,
          message: err.message,
          url: err.url,
        });
        this.error = `Error al cargar productos: ${
          err.status || "Desconocido"
        } - ${
          err.statusText || err.message || "Por favor, intenta nuevamente."
        }`;
        this.loading = false;
      },
    });
  }

  createProduct() {
    this.router.navigate(["/admin/products/new"]);
  }

  editProduct(productId: string) {
    this.router.navigate(["/admin/products/edit", productId]);
  }

  deleteProduct(productId: string) {
    if (!confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      return;
    }

    console.log(
      `📦 [AdminProducts] deleteProduct() → Eliminando producto ${productId}`
    );

    this.productService.deleteProduct(productId).subscribe({
      next: async (response) => {
        console.log("✅ [AdminProducts] Producto eliminado:", response);
        // Refrescar los productos en el servicio público para que la página de cursos se actualice
        await this.publicProductService.refreshProducts();
        this.loadProducts(this.currentPage);
      },
      error: (err) => {
        console.error("❌ [AdminProducts] Error al eliminar producto:", err);
        alert("Error al eliminar producto. Por favor, intenta nuevamente.");
      },
    });
  }

  goBack() {
    this.router.navigate(["/admin"]);
  }
}
