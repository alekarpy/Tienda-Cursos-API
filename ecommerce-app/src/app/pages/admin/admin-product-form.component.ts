// admin-product-form.component.ts
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from "@angular/forms";
import {
  AdminProductService,
  Product,
} from "../../services/admin-product.service";
import {
  AdminCategoryService,
  Category,
} from "../../services/admin-category.service";
import { ProductService } from "../../services/product.service";

@Component({
  selector: "app-admin-product-form",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: "./admin-product-form.component.html",
  styleUrls: ["./admin-product-form.component.css"],
})
export class AdminProductFormComponent implements OnInit {
  productForm: FormGroup;
  categories: Category[] = [];
  isEditMode = false;
  productId: string | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private productService: AdminProductService,
    private categoryService: AdminCategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private publicProductService: ProductService
  ) {
    this.productForm = this.fb.group({
      title: ["", [Validators.required, Validators.minLength(3)]],
      description: ["", [Validators.required, Validators.minLength(10)]],
      price: [0, [Validators.required, Validators.min(0)]],
      category: ["", Validators.required],
      instructor: [""],
      duration: [0, [Validators.required, Validators.min(1)]],
      level: ["principiante", Validators.required],
      image: [""],
      students: [0],
      rating: [0, [Validators.min(0), Validators.max(5)]],
    });
  }

  ngOnInit() {
    this.loadCategories();

    const id = this.route.snapshot.paramMap.get("id");
    if (id && id !== "new") {
      this.isEditMode = true;
      this.productId = id;
      this.loadProduct(id);
    }
  }

  loadCategories() {
    console.log("📁 [AdminProductForm] loadCategories() → Cargando categorías");
    this.categoryService.getCategories().subscribe({
      next: (response) => {
        console.log("📁 [AdminProductForm] Categorías cargadas:", response);
        this.categories = response.data;
      },
      error: (err) => {
        console.error("❌ [AdminProductForm] Error al cargar categorías:", err);
        this.error = "Error al cargar categorías";
      },
    });
  }

  loadProduct(id: string) {
    this.loading = true;
    console.log(
      `📦 [AdminProductForm] loadProduct() → Cargando producto ${id}`
    );

    this.productService.getProductById(id).subscribe({
      next: (response) => {
        console.log("📦 [AdminProductForm] Producto cargado:", response);
        const product = response.data;
        this.productForm.patchValue({
          title: product.title,
          description: product.description,
          price: product.price,
          category:
            typeof product.category === "object"
              ? product.category._id
              : product.category,
          instructor: product.instructor || "",
          duration: product.duration,
          level: product.level,
          image: product.image || "",
          students: product.students || 0,
          rating: product.rating || 0,
        });
        this.loading = false;
      },
      error: (err) => {
        console.error("❌ [AdminProductForm] Error al cargar producto:", err);
        this.error = "Error al cargar producto";
        this.loading = false;
      },
    });
  }

  onSubmit() {
    if (this.productForm.invalid) {
      console.log("❌ [AdminProductForm] Formulario inválido");
      return;
    }

    this.loading = true;
    this.error = null;

    const productData = this.productForm.value;
    console.log(
      `📦 [AdminProductForm] onSubmit() → ${
        this.isEditMode ? "Actualizando" : "Creando"
      } producto:`,
      productData
    );

    const operation = this.isEditMode
      ? this.productService.updateProduct(this.productId!, productData)
      : this.productService.createProduct(productData);

    operation.subscribe({
      next: async (response) => {
        // #region agent log
        fetch(
          "http://127.0.0.1:7242/ingest/6a71a13e-6f5d-4bf5-a51d-55bfedcbd571",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              sessionId: "debug-session",
              runId: "refresh-issue",
              hypothesisId: "D",
              location: "admin-product-form.component.ts:onSubmit:next",
              message:
                "Producto creado/actualizado exitosamente, refrescando productos públicos",
              data: {
                isEditMode: this.isEditMode,
                productId: this.productId,
                productTitle: response.data?.title,
              },
              timestamp: Date.now(),
            }),
          }
        ).catch(() => {});
        // #endregion
        console.log(
          `✅ [AdminProductForm] Producto ${
            this.isEditMode ? "actualizado" : "creado"
          }:`,
          response
        );
        // Refrescar los productos en el servicio público para que la página de cursos se actualice
        await this.publicProductService.refreshProducts();
        this.router.navigate(["/admin/products"]);
      },
      error: (err) => {
        console.error(
          `❌ [AdminProductForm] Error al ${
            this.isEditMode ? "actualizar" : "crear"
          } producto:`,
          err
        );
        this.error = `Error al ${
          this.isEditMode ? "actualizar" : "crear"
        } producto. Por favor, intenta nuevamente.`;
        this.loading = false;
      },
    });
  }

  goBack() {
    this.router.navigate(["/admin/products"]);
  }
}
