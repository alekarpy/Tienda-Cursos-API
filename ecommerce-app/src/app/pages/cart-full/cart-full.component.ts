import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { CommonModule } from "@angular/common";
import { CarritoService } from "../../services/cart.service";
import { CartStateService } from "../../services/cart-state.service";
import { Datos } from "../../../datos";
import {
  CartState,
  CartSummaryState,
  CartUIState,
} from "../../models/cart-state.models";

@Component({
  selector: "app-cart-full",
  templateUrl: "./cart-full.component.html",
  styleUrls: ["./cart-full.component.css"],
  standalone: true,
  imports: [CommonModule],
})
export class CartFullComponent implements OnInit, OnDestroy {
  // Usando los nuevos estados
  cartItems: Datos[] = [];
  cartState: CartState | null = null;
  summaryState: CartSummaryState | null = null;
  uiState: CartUIState | null = null;

  private subscriptions: Subscription = new Subscription();

  constructor(
    private cartService: CarritoService,
    private cartStateService: CartStateService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCartItems();
    this.loadCartStates();
  }

  // Método legacy - mantiene compatibilidad
  loadCartItems() {
    const cartSubscription = this.cartService.cartUpdated$.subscribe(
      (items) => {
        this.cartItems = items;
        console.log("🛒 CartFull - Items cargados:", this.cartItems);
      }
    );
    this.subscriptions.add(cartSubscription);
  }

  // Nuevo método - usa los estados avanzados
  loadCartStates() {
    // Suscribirse al estado del carrito
    const cartStateSub = this.cartStateService.cartState$.subscribe((state) => {
      this.cartState = state;
      this.cartItems = state.items;
    });
    this.subscriptions.add(cartStateSub);

    // Suscribirse al resumen del carrito
    const summarySub = this.cartStateService.cartSummaryState$.subscribe(
      (summary) => {
        this.summaryState = summary;
      }
    );
    this.subscriptions.add(summarySub);

    // Suscribirse al estado de UI
    const uiSub = this.cartStateService.cartUIState$.subscribe((ui) => {
      this.uiState = ui;
    });
    this.subscriptions.add(uiSub);
  }

  increaseQuantity(product: Datos) {
    this.cartService.increaseQuantity(product);
  }

  decreaseQuantity(product: Datos) {
    this.cartService.decreaseQuantity(product);
  }

  removeItem(product: Datos) {
    this.cartService.removeFromCart(product);
  }

  clearCart() {
    if (confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
      this.cartService.clearCart();
    }
  }

  // Usar el resumen del estado si está disponible, sino usar método legacy
  getSubtotal(): number {
    return this.summaryState?.subtotal ?? this.cartService.getTotalPrice();
  }

  getCartTotal(): number {
    return this.summaryState?.total ?? this.cartService.getTotalPrice();
  }

  getTotalItems(): number {
    return (
      this.cartState?.totalItems ??
      this.cartItems.reduce((total, item) => total + item.cantidad, 0)
    );
  }

  // Métodos adicionales usando los nuevos estados
  getTax(): number {
    return this.summaryState?.tax ?? 0;
  }

  getDiscount(): number {
    return this.summaryState?.discount ?? 0;
  }

  isLoading(): boolean {
    return this.uiState?.isLoading ?? false;
  }

  hasError(): boolean {
    return !!this.uiState?.error;
  }

  getError(): string | null {
    return this.uiState?.error ?? null;
  }

  goBack() {
    this.router.navigate(["/profile"]);
  }

  goToCourses() {
    this.router.navigate(["/cursos"]);
  }

  proceedToCheckout() {
    if (this.cartItems.length === 0) {
      alert("Tu carrito está vacío");
      return;
    }
    this.router.navigate(["/checkout"]);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
