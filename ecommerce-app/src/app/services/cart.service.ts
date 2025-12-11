import { Injectable } from '@angular/core';
import { Datos } from '../../datos';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartStateService } from './cart-state.service';

/**
 * CarritoService - Facade/Adapter que mantiene compatibilidad con código existente
 * Internamente usa CartStateService para manejar el estado con 3 entidades separadas
 */
@Injectable({
    providedIn: 'root'
})
export class CarritoService {
    // Mantener compatibilidad con código existente
    public cartUpdated = new BehaviorSubject<Datos[]>([]);
    public cartUpdated$!: Observable<Datos[]>;

    public cantidad: number = 0;
    public productoExistente: boolean = false;

    constructor(private cartStateService: CartStateService) {
        console.log('🛒 [CarritoService] Inicializando servicio (Facade/Adapter)...');
        console.log('🛒 [CarritoService] ✅ Usando BehaviorSubject + RxJS (NO NgRx)');
        
        // Inicializar cartUpdated$ después de que cartStateService esté disponible
        this.cartUpdated$ = this.cartStateService.cartState$.pipe(
            map(state => {
                console.log('🔄 [CarritoService] CartState cambió → Transformando a items para compatibilidad legacy');
                return state.items;
            })
        );
        
        // Sincronizar el BehaviorSubject legacy con el nuevo estado
        this.cartStateService.cartState$.subscribe(state => {
            console.log('🔄 [CarritoService] Sincronizando estado legacy con nuevo estado');
            this.items = state.items;
            this.cantidad = state.totalItems;
            this.cartUpdated.next([...state.items]);
            console.log('🔄 [CarritoService] ✅ Estado legacy actualizado → Todos los componentes legacy recibirán el cambio');
        });
        
        console.log('🛒 [CarritoService] ✅ Servicio inicializado correctamente');
    }

    // Propiedad items para compatibilidad (sincronizada desde CartStateService)
    public get items(): Datos[] {
        return this.cartStateService.currentCartState.items;
    }

    public set items(value: Datos[]) {
        // Esta propiedad es de solo lectura desde el estado, pero mantenemos el setter para compatibilidad
        console.warn('⚠️ items es de solo lectura. Use los métodos del servicio para modificar el carrito.');
    }

    // Método modificado para evitar duplicados - ahora usa CartStateService
    addToCart(product: Datos): void {
        console.log('🛒 === AGREGANDO AL CARRITO ===');
        console.log('🛒 Producto recibido:', product);
        this.cartStateService.addItem(product);
    }

    removeFromCart(product: Datos): void {
        console.log('🛒 Eliminando producto:', product);
        this.cartStateService.removeItem(product.id);
    }

    // Métodos para manejar cantidades - ahora usan CartStateService
    increaseQuantity(product: Datos): void {
        console.log('🛒 Aumentando cantidad:', product);
        this.cartStateService.increaseQuantity(product.id);
    }

    decreaseQuantity(product: Datos): void {
        console.log('🛒 Disminuyendo cantidad:', product);
        this.cartStateService.decreaseQuantity(product.id);
    }

    clearCart(): void {
        console.log('🛒 Limpiando carrito');
        this.cartStateService.clearCart();
    }

    getTotalPrice(): number {
        const total = this.cartStateService.currentSummaryState.total;
        console.log('🛒 Calculando total:', total);
        return total;
    }

    get cartItems(): Datos[] {
        const items = this.cartStateService.currentCartState.items;
        console.log('🛒 Obteniendo cartItems:', items);
        return [...items];
    }

    // Métodos legacy mantenidos para compatibilidad
    public actualizarCarrito() {
        console.log('🔄 === ACTUALIZANDO CARRITO ===');
        // Ya no es necesario, el estado se actualiza automáticamente
        // Mantenemos el método para no romper código existente
    }

    public guardarEnLocalStorage() {
        console.log('💾 Guardando en localStorage (manejado por CartStateService)');
        // Ya no es necesario, CartStateService maneja esto automáticamente
    }

    public cargarDesdeLocalStorage() {
        console.log('📂 === CARGANDO DESDE LOCALSTORAGE ===');
        // Ya no es necesario, CartStateService maneja esto en el constructor
    }

    // ========== Nuevos métodos para acceder a los estados avanzados ==========
    
    /**
     * Obtiene el estado completo del carrito (CartState)
     */
    getCartState$(): Observable<import('../models/cart-state.models').CartState> {
        return this.cartStateService.cartState$;
    }

    /**
     * Obtiene el estado de la UI (CartUIState)
     */
    getUIState$(): Observable<import('../models/cart-state.models').CartUIState> {
        return this.cartStateService.cartUIState$;
    }

    /**
     * Obtiene el resumen del carrito (CartSummaryState)
     */
    getSummaryState$(): Observable<import('../models/cart-state.models').CartSummaryState> {
        return this.cartStateService.cartSummaryState$;
    }

    /**
     * Obtiene el estado combinado (todos los estados juntos)
     */
    getCombinedState$(): Observable<import('../models/cart-state.models').CombinedCartState> {
        return this.cartStateService.combinedState$;
    }

    /**
     * Controla si el carrito está abierto/cerrado
     */
    setCartOpen(isOpen: boolean): void {
        this.cartStateService.setOpen(isOpen);
    }
}