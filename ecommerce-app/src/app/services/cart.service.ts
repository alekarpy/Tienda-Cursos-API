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
    this.cargarDesdeLocalStorage();
  }

  // Metodo modificado para evitar duplicados
  addToCart(product: Datos): void {
    const existingProduct = this.items.find(item => item.id === product.id);

    if (existingProduct) {
      existingProduct.cantidad += 1;
    } else {
      this.items.push({...product, cantidad: 1});
    }

    this.actualizarCarrito();
  }

  removeFromCart(product: Datos): void {
    const index = this.items.findIndex(p => p.id === product.id);
    if (index > -1) {
      this.items.splice(index, 1);
      this.actualizarCarrito();
    }
  }

  // Métodos para manejar cantidades
  increaseQuantity(product: Datos): void {
    const item = this.items.find(p => p.id === product.id);
    if (item) {
      item.cantidad++;
      this.actualizarCarrito();
    }
  }

  decreaseQuantity(product: Datos): void {
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
    this.items = [];
    this.actualizarCarrito();
  }

    getTotalPrice(): number {
    return this.items.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  }


  get cartItems(): Datos[] {
    return [...this.items];
  }

  public actualizarCarrito() {
    this.cartUpdated.next([...this.items]);
    this.guardarEnLocalStorage();
  }

  public guardarEnLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(this.items));
  }

  public cargarDesdeLocalStorage() {
    const datosGuardados = localStorage.getItem('carrito');
    if (datosGuardados) {
      this.items = JSON.parse(datosGuardados);
      this.cartUpdated.next([...this.items]);
    }
  }



}
