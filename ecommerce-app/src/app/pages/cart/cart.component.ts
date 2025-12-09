import { Component, Input, Output, EventEmitter, ElementRef, HostListener, OnInit, OnDestroy } from '@angular/core';
import { CarritoService } from '../../services/cart.service';
import { Datos } from '../../../datos';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router'; // Importa Router

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
  private subscripcion: Subscription = new Subscription();

  constructor(
    public carritoService: CarritoService,
    private elRef: ElementRef,
    private router: Router // Inyecta Router
  ) {}

  ngOnInit() {
    this.subscripcion = this.carritoService.cartUpdated$.subscribe(items => {
      this.productos = items;
    });
  }

  ngOnDestroy() {
    this.subscripcion.unsubscribe();
  }

  @HostListener('document:click', ['$event'])
  onClickFuera(event: MouseEvent) {
    if (this.mostrar && !this.elRef.nativeElement.contains(event.target)) {
      this.cerrar.emit();
    }
  }

  get total() {
    return this.carritoService.getTotalPrice();
  }

  eliminarDelCarrito(producto: Datos) {
    this.carritoService.removeFromCart(producto);
    this.cantidad = this.carritoService.cantidad;
  }

  onOverlayClick() {
    this.cerrar.emit();
  }

  // Método para finalizar compra
  finalizarCompra() {
    if (this.productos.length === 0) {
      alert('Por favor agrega productos al carrito antes de finalizar la compra');
      return;
    }

    // Cierra el carrito
    this.cerrar.emit();

    // Navega al checkout
    this.router.navigate(['/checkout']);

    //  limpiar el carrito  si es necesario
    // this.carritoService.clearCart();
  }

  }
