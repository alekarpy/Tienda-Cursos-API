import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { CommonModule } from "@angular/common";
import {
  WishlistService,
  Wishlist,
  Product,
} from "../../services/wishlist.service";
import { CarritoService } from "../../services/cart.service";
import { WishlistSkeletonComponent } from "../../components/wishlist-skeleton/wishlist-skeleton.component";

@Component({
  selector: "app-wishlist",
  templateUrl: "./wishlist.component.html",
  styleUrls: ["./wishlist.component.css"],
  standalone: true,
  imports: [CommonModule, WishlistSkeletonComponent],
})
export class WishlistComponent implements OnInit, OnDestroy {
  wishlist: Wishlist | null = null;
  products: Product[] = [];
  isLoading: boolean = false;
  error: string | null = null;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private wishlistService: WishlistService,
    private cartService: CarritoService,
    private router: Router
  ) {}

  ngOnInit() {
    // 🚀 LAZY LOADING: Este log solo aparece cuando navegas a /wishlist
    console.log(
      "🚀 [LAZY LOADING] ✅ WishlistComponent cargado - Módulo Usuario se cargó de forma diferida"
    );
    this.loadWishlist();

    // Suscribirse a cambios en la wishlist
    const wishlistSub = this.wishlistService.wishlist$.subscribe((wishlist) => {
      this.wishlist = wishlist;
      this.products = wishlist?.products || [];
    });
    this.subscriptions.add(wishlistSub);
  }

  loadWishlist() {
    this.isLoading = true;
    this.error = null;

    console.log("📋 [WishlistComponent] Iniciando carga de wishlist...");

    // Timeout de seguridad: si la carga tarda más de 5 segundos, mostrar estado vacío
    const timeoutId = setTimeout(() => {
      if (this.isLoading) {
        console.warn(
          "⚠️ [WishlistComponent] Timeout: La carga está tardando demasiado"
        );
        this.isLoading = false;
        this.error = null; // No mostrar error, solo mostrar estado vacío
        this.products = [];
      }
    }, 5000);

    const loadSub = this.wishlistService.getWishlist().subscribe({
      next: (response) => {
        console.log("📋 [WishlistComponent] Respuesta recibida:", response);

        if (!response) {
          console.error("📋 [WishlistComponent] Respuesta inválida:", response);
          this.error = null; // No mostrar error, solo mostrar estado vacío
          this.products = [];
          clearTimeout(timeoutId);
          this.isLoading = false;
          return;
        }

        // Si la respuesta no es exitosa, tratar como wishlist vacía
        if (!response.success) {
          console.warn(
            "⚠️ [WishlistComponent] Respuesta no exitosa, wishlist vacía"
          );
          this.wishlist = null;
          this.products = [];
          clearTimeout(timeoutId);
          this.isLoading = false;
          return;
        }

        this.wishlist = response.data;
        this.products = response.data?.products || [];

        // Debug: verificar estructura de categorías
        console.log(
          "📋 [WishlistComponent] Productos cargados:",
          this.products.length
        );
        console.log(
          "📋 [WishlistComponent] isLoading antes de poner en false:",
          this.isLoading
        );
        if (this.products.length > 0) {
          console.log(
            "📋 [WishlistComponent] Primer producto:",
            this.products[0]
          );
          console.log(
            "📋 [WishlistComponent] Categoría del primer producto:",
            this.products[0].category
          );
          console.log(
            "📋 [WishlistComponent] Tipo de categoría:",
            typeof this.products[0].category
          );
        }

        clearTimeout(timeoutId); // Limpiar timeout si la carga fue exitosa
        this.isLoading = false;
        console.log(
          "📋 [WishlistComponent] isLoading después de cargar:",
          this.isLoading
        );
        console.log(
          "📋 [WishlistComponent] products.length:",
          this.products.length
        );
      },
      error: (error) => {
        clearTimeout(timeoutId); // Limpiar timeout en caso de error
        console.error(
          "❌ [WishlistComponent] Error al cargar wishlist:",
          error
        );
        console.error(
          "❌ [WishlistComponent] Error completo:",
          JSON.stringify(error, null, 2)
        );
        console.error("❌ [WishlistComponent] Error status:", error.status);
        console.error("❌ [WishlistComponent] Error message:", error.message);
        console.error("❌ [WishlistComponent] Error error:", error.error);

        // Si es un error de conexión o timeout, no mostrar error, solo mostrar estado vacío
        if (error.status === 0 || error.name === "TimeoutError") {
          this.error = null;
          this.products = [];
        } else {
          const errorMessage =
            error.error?.message || error.message || "Error desconocido";
          this.error = `Error al cargar tu lista de deseos: ${errorMessage}`;
        }
        this.isLoading = false;
      },
    });

    this.subscriptions.add(loadSub);
  }

  removeFromWishlist(productId: string) {
    if (!productId) return;

    this.isLoading = true;
    const removeSub = this.wishlistService
      .removeFromWishlist(productId)
      .subscribe({
        next: (response) => {
          this.wishlist = response.data;
          this.products = response.data.products || [];
          this.isLoading = false;
        },
        error: (error) => {
          console.error("Error al eliminar de wishlist:", error);
          this.error = "Error al eliminar el producto de la lista de deseos";
          this.isLoading = false;
        },
      });

    this.subscriptions.add(removeSub);
  }

  clearWishlist() {
    if (!confirm("¿Estás seguro de que quieres vaciar tu lista de deseos?")) {
      return;
    }

    this.isLoading = true;
    const clearSub = this.wishlistService.clearWishlist().subscribe({
      next: (response) => {
        this.wishlist = response.data;
        this.products = [];
        this.isLoading = false;
      },
      error: (error) => {
        console.error("Error al limpiar wishlist:", error);
        this.error = "Error al limpiar la lista de deseos";
        this.isLoading = false;
      },
    });

    this.subscriptions.add(clearSub);
  }

  addToCart(product: Product) {
    // Convertir Product a Datos para el carrito
    const datosProduct = {
      id: parseInt(product._id || "0") || 0,
      nombre: product.title,
      descripcion: product.description,
      precio: product.price,
      alumnos: product.students || 0,
      nivel: product.level,
      calificacion: product.rating || 0,
      categoria:
        typeof product.category === "object"
          ? product.category.name
          : product.category,
      // Usar el mismo método getProductImage para mantener consistencia
      imagen: this.getProductImage(product),
      cantidad: 1,
    };

    this.cartService.addToCart(datosProduct);
    alert(`${product.title} agregado al carrito`);
  }

  goBack() {
    this.router.navigate(["/profile"]);
  }

  goToCourses() {
    this.router.navigate(["/cursos"]);
  }

  getProductImage(product: Product): string {
    // Si el producto tiene una imagen personalizada y no es el placeholder del backend, usarla
    const backendPlaceholder =
      "https://cdn.pixabay.com/photo/2023/12/15/17/09/ai-generated-8451031_1280.png";

    if (product.image && product.image !== backendPlaceholder) {
      return product.image;
    }

    // Si es el placeholder o no tiene imagen, mapear según el título (igual que ProductService)
    if (product.title) {
      const imageMap: Record<string, string> = {
        "Javascript Avanzado: Domínalo Como Un Master": "assets/img/img6.png",
        "React: Crea Aplicaciones Web de Alto Nivel": "assets/img/img2.png",
        "Python Total: Analiza Datos En Tiempo Real": "assets/img/img3.png",
        "Angular: Crea Aplicaciones Web Complejas": "assets/img/img4.png",
        "Consumo de APIS: Aprende con Node.JS": "assets/img/img1.png",
        "Diseño de Interfaces: Aprende con Figma": "assets/img/img5.png",
        "Desarrollo de Aplicaciones Móviles: Aprende con React Native":
          "assets/img/img8.png",
        "Marketing Digital: Aprende con Google Analytics":
          "assets/img/img9.png",
        "SQL : Aprende a Utilizar Bases de Datos": "assets/img/img10.png",
        "Power Bi : Aprende a Crear Informes para tu Negocio":
          "assets/img/img7.png",
        "Conoce a tu Cliente: Aprende a Crear Personas": "assets/img/img11.png",
        "Ilustrator : Conviértete en un Gran Ilustrador":
          "assets/img/img13.png",
        "Fotografía Creativa: Vuélvete un Gran Fotógrafo":
          "assets/img/img12.png",
      };

      return imageMap[product.title] || "assets/img/img6.png";
    }

    return product.image || "assets/img/img6.png";
  }

  getCategoryName(product: Product): string {
    // Debug: ver qué estructura tiene la categoría
    console.log(
      "🏷️ [WishlistComponent] getCategoryName - producto:",
      product.title
    );
    console.log(
      "🏷️ [WishlistComponent] getCategoryName - category:",
      product.category
    );
    console.log(
      "🏷️ [WishlistComponent] getCategoryName - typeof:",
      typeof product.category
    );

    // Si la categoría es un objeto con name, usar el name
    if (typeof product.category === "object" && product.category !== null) {
      // Verificar si tiene la propiedad 'name'
      const categoryObj = product.category as { _id?: string; name?: string };
      if (categoryObj.name) {
        console.log(
          "🏷️ [WishlistComponent] Categoría encontrada (objeto con name):",
          categoryObj.name
        );
        return categoryObj.name;
      }
      // Si es un objeto pero no tiene name, podría ser solo el _id
      if (categoryObj._id) {
        console.warn(
          "🏷️ [WishlistComponent] Categoría es un objeto solo con _id:",
          categoryObj._id
        );
        return "Sin categoría";
      }
    }

    // Si es un string, devolverlo directamente
    if (typeof product.category === "string") {
      // Si parece un ObjectId (24 caracteres hexadecimales), no es válido
      if (/^[0-9a-fA-F]{24}$/.test(product.category)) {
        console.warn(
          "🏷️ [WishlistComponent] Categoría es un ID sin poblar:",
          product.category
        );
        return "Sin categoría";
      }
      console.log(
        "🏷️ [WishlistComponent] Categoría encontrada (string):",
        product.category
      );
      return product.category;
    }

    console.warn(
      "🏷️ [WishlistComponent] No se pudo determinar la categoría para:",
      product.title
    );
    return "Sin categoría";
  }

  getTotalValue(): number {
    return this.products.reduce((total, product) => total + product.price, 0);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}

