import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, combineLatest, map } from "rxjs";
import { Datos } from "../../datos";
import {
  CartState,
  CartUIState,
  CartSummaryState,
  CombinedCartState,
} from "../models/cart-state.models";

/**
 * Servicio de estado del carrito usando BehaviorSubject + RxJS
 * Maneja 3 estados independientes: CartState, CartUIState, CartSummaryState
 */
@Injectable({
  providedIn: "root",
})
export class CartStateService {
  // Estado 1: CartState - Estado principal del carrito
  private cartStateSubject = new BehaviorSubject<CartState>(
    this.getInitialCartState()
  );
  public cartState$: Observable<CartState> =
    this.cartStateSubject.asObservable();

  // Estado 2: CartUIState - Estado de la UI
  private cartUIStateSubject = new BehaviorSubject<CartUIState>(
    this.getInitialUIState()
  );
  public cartUIState$: Observable<CartUIState> =
    this.cartUIStateSubject.asObservable();

  // Estado 3: CartSummaryState - Resumen del carrito
  private cartSummaryStateSubject = new BehaviorSubject<CartSummaryState>(
    this.getInitialSummaryState()
  );
  public cartSummaryState$: Observable<CartSummaryState> =
    this.cartSummaryStateSubject.asObservable();

  // Estado combinado (derivado de los 3 estados)
  public combinedState$: Observable<CombinedCartState> = combineLatest([
    this.cartState$,
    this.cartUIState$,
    this.cartSummaryState$,
  ]).pipe(map(([cart, ui, summary]) => ({ cart, ui, summary })));

  constructor() {
    console.log("🛒 [CartStateService] Inicializando servicio...");
    console.log("🛒 [CartStateService] ✅ BehaviorSubject + RxJS (NO NgRx)");
    this.loadFromLocalStorage();
    // Actualizar summary cuando cambie el cart
    this.cartState$.subscribe((cart) => {
      console.log(
        "🔄 [CartStateService] CartState cambió → Actualizando summary automáticamente"
      );
      this.updateSummary(cart.items);
    });
    console.log("🛒 [CartStateService] ✅ Servicio inicializado correctamente");
  }

  // ========== Getters para valores actuales ==========
  get currentCartState(): CartState {
    return this.cartStateSubject.value;
  }

  get currentUIState(): CartUIState {
    return this.cartUIStateSubject.value;
  }

  get currentSummaryState(): CartSummaryState {
    return this.cartSummaryStateSubject.value;
  }

  // ========== Métodos para CartState ==========
  addItem(product: Datos): void {
    this.setLoading(true);
    try {
      const currentState = this.cartStateSubject.value;
      const existingItem = currentState.items.find(
        (item) => item.id === product.id
      );

      let updatedItems: Datos[];
      if (existingItem) {
        updatedItems = currentState.items.map((item) =>
          item.id === product.id
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      } else {
        updatedItems = [...currentState.items, { ...product, cantidad: 1 }];
      }

      this.updateCartState({
        items: updatedItems,
        totalItems: updatedItems.reduce((sum, item) => sum + item.cantidad, 0),
        lastUpdated: new Date(),
      });

      this.saveToLocalStorage();
    } catch (error) {
      this.setError("Error al agregar producto al carrito");
      console.error("Error adding item:", error);
    } finally {
      this.setLoading(false);
    }
  }

  removeItem(productId: number): void {
    this.setLoading(true);
    try {
      const currentState = this.cartStateSubject.value;
      const updatedItems = currentState.items.filter(
        (item) => item.id !== productId
      );

      this.updateCartState({
        items: updatedItems,
        totalItems: updatedItems.reduce((sum, item) => sum + item.cantidad, 0),
        lastUpdated: new Date(),
      });

      this.saveToLocalStorage();
    } catch (error) {
      this.setError("Error al eliminar producto del carrito");
      console.error("Error removing item:", error);
    } finally {
      this.setLoading(false);
    }
  }

  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(productId);
      return;
    }

    this.setLoading(true);
    try {
      const currentState = this.cartStateSubject.value;
      const updatedItems = currentState.items.map((item) =>
        item.id === productId ? { ...item, cantidad: quantity } : item
      );

      this.updateCartState({
        items: updatedItems,
        totalItems: updatedItems.reduce((sum, item) => sum + item.cantidad, 0),
        lastUpdated: new Date(),
      });

      this.saveToLocalStorage();
    } catch (error) {
      this.setError("Error al actualizar cantidad");
      console.error("Error updating quantity:", error);
    } finally {
      this.setLoading(false);
    }
  }

  increaseQuantity(productId: number): void {
    const item = this.cartStateSubject.value.items.find(
      (i) => i.id === productId
    );
    if (item) {
      this.updateQuantity(productId, item.cantidad + 1);
    }
  }

  decreaseQuantity(productId: number): void {
    const item = this.cartStateSubject.value.items.find(
      (i) => i.id === productId
    );
    if (item) {
      this.updateQuantity(productId, item.cantidad - 1);
    }
  }

  clearCart(): void {
    this.setLoading(true);
    try {
      this.updateCartState(this.getInitialCartState());
      localStorage.removeItem("carrito");
    } catch (error) {
      this.setError("Error al limpiar el carrito");
      console.error("Error clearing cart:", error);
    } finally {
      this.setLoading(false);
    }
  }

  private updateCartState(newState: Partial<CartState>): void {
    const currentState = this.cartStateSubject.value;
    const updatedState = { ...currentState, ...newState };
    console.log(
      "🔄 [CartStateService] updateCartState() → Emitiendo nuevo CartState"
    );
    this.cartStateSubject.next(updatedState);
    console.log(
      "🔄 [CartStateService] ✅ CartState emitido → Todos los componentes suscritos recibirán el cambio"
    );
  }

  // ========== Métodos para CartUIState ==========
  setLoading(isLoading: boolean): void {
    const currentState = this.cartUIStateSubject.value;
    const updatedState = { ...currentState, isLoading };
    console.log(
      `⏳ [CartStateService] setLoading(${isLoading}) → Actualizando CartUIState`
    );
    this.cartUIStateSubject.next(updatedState);
  }

  setOpen(isOpen: boolean): void {
    const currentState = this.cartUIStateSubject.value;
    const updatedState = { ...currentState, isOpen };
    console.log(
      `👁️ [CartStateService] setOpen(${isOpen}) → Actualizando CartUIState`
    );
    this.cartUIStateSubject.next(updatedState);
  }

  setError(error: string | null): void {
    const currentState = this.cartUIStateSubject.value;
    const updatedState = { ...currentState, error };
    if (error) {
      console.log(
        `❌ [CartStateService] setError("${error}") → Actualizando CartUIState`
      );
    } else {
      console.log("✅ [CartStateService] setError(null) → Limpiando error");
    }
    this.cartUIStateSubject.next(updatedState);
    // Auto-limpiar error después de 5 segundos
    if (error) {
      setTimeout(() => {
        this.setError(null);
      }, 5000);
    }
  }

  setProcessing(isProcessing: boolean): void {
    const currentState = this.cartUIStateSubject.value;
    const updatedState = { ...currentState, isProcessing };
    console.log(
      `⚙️ [CartStateService] setProcessing(${isProcessing}) → Actualizando CartUIState`
    );
    this.cartUIStateSubject.next(updatedState);
  }

  // ========== Métodos para CartSummaryState ==========
  private updateSummary(items: Datos[]): void {
    console.log(
      "💰 [CartStateService] updateSummary() → Calculando resumen..."
    );
    const subtotal = items.reduce(
      (sum, item) => sum + item.precio * item.cantidad,
      0
    );
    const tax = subtotal * 0.16; // 16% de impuesto (ajustable)
    const shipping = subtotal > 1000 ? 0 : 50; // Envío gratis sobre $1000
    const discount = 0; // Puedes implementar lógica de descuentos aquí
    const total = subtotal + tax + shipping - discount;

    const summary = {
      subtotal,
      tax,
      shipping,
      discount,
      total,
      currency: "MXN",
    };

    console.log("💰 [CartStateService] Resumen calculado:", summary);
    this.cartSummaryStateSubject.next(summary);
    console.log(
      "💰 [CartStateService] ✅ CartSummaryState emitido → Todos los componentes suscritos recibirán el cambio"
    );
  }

  // ========== LocalStorage ==========
  private saveToLocalStorage(): void {
    try {
      const items = this.cartStateSubject.value.items;
      const json = JSON.stringify(items);
      localStorage.setItem("carrito", json);
      console.log("💾 [CartStateService] saveToLocalStorage() → Guardado:", {
        itemsCount: items.length,
      });
    } catch (error) {
      console.error(
        "❌ [CartStateService] Error saving to localStorage:",
        error
      );
      this.setError("Error al guardar el carrito");
    }
  }

  private loadFromLocalStorage(): void {
    try {
      console.log("📂 [CartStateService] loadFromLocalStorage() → Cargando...");
      const saved = localStorage.getItem("carrito");
      if (saved) {
        const items: Datos[] = JSON.parse(saved);
        console.log(
          "📂 [CartStateService] Datos encontrados en localStorage:",
          { itemsCount: items.length }
        );
        this.updateCartState({
          items,
          totalItems: items.reduce((sum, item) => sum + item.cantidad, 0),
          lastUpdated: new Date(),
        });
        console.log(
          "📂 [CartStateService] ✅ Carrito cargado desde localStorage"
        );
      } else {
        console.log(
          "📂 [CartStateService] No hay datos en localStorage → Carrito vacío"
        );
      }
    } catch (error) {
      console.error(
        "❌ [CartStateService] Error loading from localStorage:",
        error
      );
      this.setError("Error al cargar el carrito");
    }
  }

  // ========== Estados iniciales ==========
  private getInitialCartState(): CartState {
    return {
      items: [],
      totalItems: 0,
      lastUpdated: null,
    };
  }

  private getInitialUIState(): CartUIState {
    return {
      isLoading: false,
      isOpen: false,
      error: null,
      isProcessing: false,
    };
  }

  private getInitialSummaryState(): CartSummaryState {
    return {
      subtotal: 0,
      tax: 0,
      shipping: 0,
      discount: 0,
      total: 0,
      currency: "MXN",
    };
  }
}
