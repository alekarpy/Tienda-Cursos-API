import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { OrderService, Order } from "../../services/order.service";
import { ProductService } from "../../services/product.service";

@Component({
  selector: "app-order-history",
  templateUrl: "./order-history.component.html",
  styleUrls: ["./order-history.component.css"],
  standalone: true,
  imports: [CommonModule],
})
export class OrderHistoryComponent implements OnInit {
  allOrders: any[] = []; // Cambiar a any[] temporalmente
  loading = false;
  error: string | null = null;

  constructor(
    private orderService: OrderService,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit() {
    // 🚀 LAZY LOADING: Este log solo aparece cuando navegas a /order-history
    console.log(
      "🚀 [LAZY LOADING] ✅ OrderHistoryComponent cargado - Módulo Usuario se cargó de forma diferida"
    );
    this.loadOrders();
  }

  loadOrders() {
    this.loading = true;
    this.error = null;

    // Intentar obtener órdenes del backend primero
    this.orderService.getUserOrders().subscribe({
      next: (response) => {
        console.log(
          "📦 [OrderHistory] Órdenes obtenidas del backend:",
          response
        );

        if (response.success && response.data) {
          // El backend puede devolver un array o un objeto con count y data
          const orders = Array.isArray(response.data)
            ? response.data
            : response.data.count
            ? response.data.data
            : [];

          // Mapear las órdenes del backend al formato esperado por el componente
          this.allOrders = orders.map((order: any) =>
            this.mapBackendOrderToFrontend(order)
          );
          console.log("📦 [OrderHistory] Órdenes mapeadas:", this.allOrders);
        } else {
          this.allOrders = [];
        }

        this.loading = false;
      },
      error: (error) => {
        console.error(
          "❌ [OrderHistory] Error al obtener órdenes del backend:",
          error
        );

        // Si falla, intentar cargar del localStorage como fallback
        console.log(
          "⚠️ [OrderHistory] Intentando cargar órdenes del localStorage..."
        );
        this.allOrders = this.orderService.getAllOrders();

        // Si no hay órdenes en ningún lado, crear algunas de ejemplo
        if (this.allOrders.length === 0) {
          console.log("📦 [OrderHistory] No hay órdenes, creando ejemplos...");
          this.createSampleOrders();
        }

        this.loading = false;

        // Solo mostrar error si no hay órdenes en localStorage
        if (this.allOrders.length === 0) {
          this.error =
            "No se pudieron cargar las órdenes. Por favor, intenta nuevamente.";
        }
      },
    });
  }

  /**
   * Mapea una orden del backend al formato esperado por el frontend
   */
  private mapBackendOrderToFrontend(backendOrder: any): any {
    console.log("📦 [OrderHistory] Mapeando orden del backend:", {
      orderId: backendOrder._id || backendOrder.id,
      itemsCount: backendOrder.items?.length || 0,
      items:
        backendOrder.items?.map((item: any) => ({
          productId: item.product?._id || item.product,
          productName: item.product?.title || item.product?.nombre || "N/A",
          quantity: item.quantity,
          price: item.price,
        })) || [],
      total: backendOrder.total,
    });

    // SIEMPRE calcular el subtotal desde los items (fuente de verdad)
    // El total del backend puede estar incorrecto si solo se guardó un producto
    const itemsSubtotal = (backendOrder.items || []).reduce(
      (sum: number, item: any) => {
        const itemTotal = (item.price || 0) * (item.quantity || 1);
        console.log("💰 [OrderHistory] Item subtotal:", {
          productName: item.product?.title || item.product?.nombre || "N/A",
          price: item.price,
          quantity: item.quantity,
          itemTotal: itemTotal,
        });
        return sum + itemTotal;
      },
      0
    );

    console.log("💰 [OrderHistory] Cálculo de totales:", {
      itemsSubtotal: itemsSubtotal,
      backendTotal: backendOrder.total,
      itemsCount: backendOrder.items?.length || 0,
      diferencia: itemsSubtotal - (backendOrder.total || 0),
    });

    // Usar el subtotal calculado desde los items (más confiable)
    // Solo usar backendOrder.total como fallback si no hay items
    const subtotal =
      itemsSubtotal > 0 ? itemsSubtotal : backendOrder.total || 0;
    const tax = subtotal * 0.16; // 16% de IVA
    const total = subtotal + tax;

    console.log("💰 [OrderHistory] Totales finales:", {
      subtotal: subtotal,
      tax: tax,
      total: total,
    });

    return {
      id: backendOrder._id || backendOrder.id,
      date: backendOrder.createdAt || backendOrder.date || new Date(),
      subtotal: Math.round(subtotal * 100) / 100, // Redondear a 2 decimales
      tax: Math.round(tax * 100) / 100, // Redondear a 2 decimales
      total: Math.round(total * 100) / 100, // Redondear a 2 decimales
      items: (backendOrder.items || []).map((item: any) => {
        const product = item.product || item;

        // Obtener la imagen usando el método del ProductService
        let imagen = "assets/img/img1.png";
        if (product.image) {
          // Si tiene imagen del backend y no es el placeholder, usarla
          const backendPlaceholder =
            "https://cdn.pixabay.com/photo/2023/12/15/17/09/ai-generated-8451031_1280.png";
          if (product.image !== backendPlaceholder) {
            imagen = product.image;
          } else {
            // Si es el placeholder, usar el mapeo del ProductService
            imagen = this.getImagenPorTitulo(product.title || product.nombre);
          }
        } else {
          // Si no tiene imagen, usar el mapeo del ProductService
          imagen = this.getImagenPorTitulo(product.title || product.nombre);
        }

        // Obtener la categoría
        let categoria = "Sin categoría";

        // Log detallado para debugging
        console.log("🔍 [OrderHistory] Producto completo:", {
          productId: product._id || product.id,
          productTitle: product.title || product.nombre,
          category: product.category,
          categoryType: typeof product.category,
          categoryIsObject: typeof product.category === "object",
          categoryIsNull: product.category === null,
          categoryKeys:
            product.category && typeof product.category === "object"
              ? Object.keys(product.category)
              : null,
          categoria: product.categoria,
        });

        // Intentar obtener la categoría de diferentes formas
        if (product.category) {
          if (
            typeof product.category === "object" &&
            product.category !== null
          ) {
            // Si es un objeto, buscar el nombre
            if (product.category.name) {
              categoria = product.category.name;
            } else if (product.category._id) {
              // Si solo tiene _id pero no name, puede que no esté populado
              console.warn(
                "⚠️ [OrderHistory] Category tiene _id pero no name, puede que no esté populado"
              );
              categoria = "Sin categoría";
            }
          } else if (typeof product.category === "string") {
            categoria = product.category;
          }
        } else if (product.categoria) {
          categoria = product.categoria;
        }

        console.log(
          "✅ [OrderHistory] Categoría final para",
          product.title || product.nombre,
          ":",
          categoria
        );

        return {
          id: product._id || product.id,
          nombre: product.title || product.nombre || "Producto sin nombre",
          precio: item.price || product.price || 0,
          cantidad: item.quantity || item.cantidad || 1,
          imagen: imagen,
          categoria: categoria,
        };
      }),
      status: backendOrder.status || "completed",
      showDetails: false,
      paymentMethod: backendOrder.paymentMethod || "tarjeta",
    };
  }

  /**
   * Obtiene la imagen correcta basándose en el título del producto
   * Usa el mismo mapeo que ProductService.getImagenParaProducto
   */
  private getImagenPorTitulo(titulo: string): string {
    if (!titulo) return "assets/img/img1.png";

    switch (titulo) {
      case "Javascript Avanzado: Domínalo Como Un Master":
        return "assets/img/img6.png";
      case "React: Crea Aplicaciones Web de Alto Nivel":
        return "assets/img/img2.png";
      case "Python Total: Analiza Datos En Tiempo Real":
        return "assets/img/img3.png";
      case "Angular: Crea Aplicaciones Web Complejas":
        return "assets/img/img4.png";
      case "Consumo de APIS: Aprende con Node.JS":
        return "assets/img/img1.png";
      case "Diseño de Interfaces: Aprende con Figma":
        return "assets/img/img5.png";
      case "Desarrollo de Aplicaciones Móviles: Aprende con React Native":
        return "assets/img/img8.png";
      case "Marketing Digital: Aprende con Google Analytics":
        return "assets/img/img9.png";
      case "SQL : Aprende a Utilizar Bases de Datos":
        return "assets/img/img10.png";
      case "Power Bi : Aprende a Crear Informes para tu Negocio":
        return "assets/img/img7.png";
      case "Conoce a tu Cliente: Aprende a Crear Personas":
        return "assets/img/img11.png";
      case "Ilustrator : Conviértete en un Gran Ilustrador":
        return "assets/img/img13.png";
      case "Fotografía Creativa: Vuélvete un Gran Fotógrafo":
        return "assets/img/img12.png";
      default:
        return "assets/img/img1.png";
    }
  }

  createSampleOrders() {
    console.log("🔄 Creando órdenes de ejemplo...");

    const sampleOrders = [
      {
        id: 1001,
        date: new Date("2024-01-15"),
        total: 1899,
        items: [
          {
            id: 1,
            nombre: "Javascript Avanzado: Domínalo Como Un Master",
            precio: 1899,
            cantidad: 1,
            imagen: "assets/img/img6.png",
            categoria: "Desarrollo Web",
          },
        ],
        status: "completed",
        showDetails: false, // ← Agregar esta propiedad
      },
      {
        id: 1002,
        date: new Date("2024-02-01"),
        total: 899,
        items: [
          {
            id: 2,
            nombre: "React: Crea Aplicaciones Web de Alto Nivel",
            precio: 899,
            cantidad: 1,
            imagen: "assets/img/img2.png",
            categoria: "Desarrollo Web",
          },
        ],
        status: "completed",
        showDetails: false, // ← Agregar esta propiedad
      },
    ];

    // Usar el OrderService para crear las órdenes (método local para datos de ejemplo)
    sampleOrders.forEach((order) => {
      this.orderService.createOrderLocal(order.items, order.total);
    });

    // Recargar las órdenes
    this.allOrders = this.orderService.getAllOrders();

    // Agregar la propiedad showDetails a todas las órdenes
    this.allOrders.forEach((order) => {
      order.showDetails = false;
    });
  }

  // 🔥 AGREGAR ESTE MÉTODO FALTANTE
  getStatusClass(status: string): string {
    // Normalizar el estado para las clases CSS
    const normalizedStatus = status?.toLowerCase() || "completed";
    if (normalizedStatus === "completado") return "completed";
    if (normalizedStatus === "pendiente") return "pending";
    if (normalizedStatus === "cancelado") return "cancelled";
    if (normalizedStatus === "en proceso") return "pending";
    return normalizedStatus;
  }

  getStatusText(status: string): string {
    const statusMap: { [key: string]: string } = {
      completed: "Completada",
      pending: "Pendiente",
      cancelled: "Cancelada",
      Completado: "Completada",
      Pendiente: "Pendiente",
      Cancelado: "Cancelada",
      "En Proceso": "En Proceso",
    };
    return statusMap[status] || status || "Completada";
  }

  toggleOrderDetails(order: any) {
    order.showDetails = !order.showDetails;
  }

  formatDate(date: Date | string): string {
    if (!date) return "Fecha no disponible";
    const dateObj = new Date(date);
    return dateObj.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  getTotalCourses(): number {
    return this.allOrders.reduce(
      (total, order) => total + order.items.length,
      0
    );
  }

  getTotalSpent(): number {
    return this.allOrders.reduce((total, order) => total + order.total, 0);
  }

  getUniqueMonths(): number {
    const months = new Set(
      this.allOrders.map((order) =>
        new Date(order.date).toLocaleDateString("es-ES", {
          year: "numeric",
          month: "long",
        })
      )
    );
    return months.size;
  }

  getFirstPurchaseDate(): string {
    if (this.allOrders.length === 0) return "N/A";
    const dates = this.allOrders.map((order) => new Date(order.date));
    const firstDate = new Date(
      Math.min(...dates.map((date) => date.getTime()))
    );
    return this.formatDate(firstDate);
  }

  goBack() {
    this.router.navigate(["/profile"]);
  }

  goToCourses() {
    this.router.navigate(["/cursos"]);
  }
}
