import {Injectable, Input} from '@angular/core';
import { Datos } from '../../datos';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CarritoService {
    public items: Datos[] = [];
    public cartUpdated = new BehaviorSubject<Datos[]>(this.items);
    cartUpdated$ = this.cartUpdated.asObservable();

    public cantidad: number = 0;
    public productoExistente: boolean = false;

    constructor() {
        console.log('🛒 CarritoService inicializado');
        this.cargarDesdeLocalStorage();
    }

    // Metodo modificado para evitar duplicados
    addToCart(product: Datos): void {
        console.log('🛒 === AGREGANDO AL CARRITO ===');
        console.log('🛒 Producto recibido:', product);
        console.log('🛒 Items antes de agregar:', this.items);

        const existingProduct = this.items.find(item => item.id === product.id);

        if (existingProduct) {
            existingProduct.cantidad += 1;
            console.log('🛒 Producto existente, cantidad aumentada:', existingProduct);
        } else {
            this.items.push({...product, cantidad: 1});
            console.log('🛒 Nuevo producto agregado:', product);
        }

        console.log('🛒 Items después de agregar:', this.items);
        this.actualizarCarrito();
    }

    removeFromCart(product: Datos): void {
        console.log('🛒 Eliminando producto:', product);
        const index = this.items.findIndex(p => p.id === product.id);
        if (index > -1) {
            this.items.splice(index, 1);
            this.actualizarCarrito();
        }
    }

    // Métodos para manejar cantidades
    increaseQuantity(product: Datos): void {
        console.log('🛒 Aumentando cantidad:', product);
        const item = this.items.find(p => p.id === product.id);
        if (item) {
            item.cantidad++;
            this.actualizarCarrito();
        }
    }

    decreaseQuantity(product: Datos): void {
        console.log('🛒 Disminuyendo cantidad:', product);
        const item = this.items.find(p => p.id === product.id);
        if (item) {
            if (item.cantidad > 1) {
                item.cantidad--;
            } else {
                this.removeFromCart(product);
                return;
            }
            this.actualizarCarrito();
        }
    }

    clearCart(): void {
        console.log('🛒 Limpiando carrito');
        this.items = [];
        this.actualizarCarrito();
    }

    getTotalPrice(): number {
        const total = this.items.reduce((total, item) => total + (item.precio * item.cantidad), 0);
        console.log('🛒 Calculando total:', total);
        return total;
    }

    get cartItems(): Datos[] {
        console.log('🛒 Obteniendo cartItems:', this.items);
        return [...this.items];
    }

    public actualizarCarrito() {
        console.log('🔄 === ACTUALIZANDO CARRITO ===');
        console.log('🔄 Items a enviar:', this.items);
        this.cartUpdated.next([...this.items]);
        this.guardarEnLocalStorage();
    }

    public guardarEnLocalStorage() {
        console.log('💾 Guardando en localStorage:', this.items);
        localStorage.setItem('carrito', JSON.stringify(this.items));

        // Verificar que se guardó correctamente
        const verificar = localStorage.getItem('carrito');
        console.log('💾 Verificación localStorage:', verificar);
    }

    public cargarDesdeLocalStorage() {
        console.log('📂 === CARGANDO DESDE LOCALSTORAGE ===');
        const datosGuardados = localStorage.getItem('carrito');
        console.log('📂 Datos en localStorage:', datosGuardados);

        if (datosGuardados) {
            this.items = JSON.parse(datosGuardados);
            console.log('📂 Carrito cargado exitosamente:', this.items);
            this.cartUpdated.next([...this.items]);
        } else {
            console.log('📂 No hay datos en localStorage, carrito vacío');
        }
    }
}