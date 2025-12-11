import { Component, Input, Output, EventEmitter, ElementRef, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CarritoService } from '../../services/cart.service';
import { CartStateService } from '../../services/cart-state.service';
import { Datos } from '../../../datos';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { CartSummaryState, CartUIState } from '../../models/cart-state.models';

@Component({
  selector: 'app-cart',
  standalone: true,
  templateUrl: './cart.component.html',
  imports: [
    CurrencyPipe, CommonModule
  ],
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit, OnDestroy {
  @Input() mostrar: boolean = true;
  @Output() cerrar = new EventEmitter<void>();

  @Input() cantidad: number = 0;

  productos: Datos[] = [];
  summaryState: CartSummaryState | null = null;
  uiState: CartUIState | null = null;
  private subscripcion: Subscription = new Subscription();

  constructor(
    public carritoService: CarritoService,
    private cartStateService: CartStateService,
    private elRef: ElementRef,
    private router: Router
  ) {}

  ngOnInit() {
    // Suscribirse al estado del carrito (método legacy)
    this.subscripcion.add(
      this.carritoService.cartUpdated$.subscribe(items => {
        this.productos = items;
      })
    );

    // Suscribirse a los nuevos estados
    this.subscripcion.add(
      this.cartStateService.cartSummaryState$.subscribe(summary => {
        this.summaryState = summary;
      })
    );

    this.subscripcion.add(
      this.cartStateService.cartUIState$.subscribe(ui => {
        this.uiState = ui;
        // Sincronizar el estado de apertura del carrito
        if (this.mostrar !== ui.isOpen) {
          this.cartStateService.setOpen(this.mostrar);
        }
      })
    );

    // Sincronizar el estado inicial
    this.cartStateService.setOpen(this.mostrar);
  }

  ngOnDestroy() {
    this.subscripcion.unsubscribe();
  }

  @HostListener('document:click', ['$event'])
  onClickFuera(event: MouseEvent) {
    if (this.mostrar && !this.elRef.nativeElement.contains(event.target)) {
      this.cerrar.emit();
      this.cartStateService.setOpen(false);
    }
  }

  get total() {
    // Usar el resumen del estado si está disponible
    return this.summaryState?.total ?? this.carritoService.getTotalPrice();
  }

  eliminarDelCarrito(producto: Datos) {
    this.carritoService.removeFromCart(producto);
    this.cantidad = this.carritoService.cantidad;
  }

  onOverlayClick() {
    this.cerrar.emit();
    this.cartStateService.setOpen(false);
  }

  // Método para finalizar compra
  finalizarCompra() {
    if (this.productos.length === 0) {
      alert('Por favor agrega productos al carrito antes de finalizar la compra');
      return;
    }

    // Cierra el carrito
    this.cerrar.emit();
    this.cartStateService.setOpen(false);

    // Navega al checkout
    this.router.navigate(['/checkout']);
  }

  // Métodos adicionales usando los nuevos estados
  get isLoading(): boolean {
    return this.uiState?.isLoading ?? false;
  }

  get hasError(): boolean {
    return !!this.uiState?.error;
  }

  get errorMessage(): string | null {
    return this.uiState?.error ?? null;
  }
}
