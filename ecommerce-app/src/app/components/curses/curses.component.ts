import { Component } from '@angular/core';
import {ProductService} from '../../services/product.service';
import {CurrencyPipe} from '@angular/common';
import { CarritoService } from '../../services/cart.service';
import {Datos} from '../../../datos';
import {CartComponent} from '../../pages/cart/cart.component';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-curses',
  templateUrl: './curses.component.html',
  styleUrls: ['./curses.component.css'],

  standalone: true,
  imports: [CurrencyPipe, CommonModule, CartComponent],

})


export class CursesComponent {
  mostrarCarrito: boolean = false;

  notificacionVisible = false;

  cursos: Datos[] = [];

  categoriaSeleccionada: string = 'Todos';


  //Aceso al servicio de ProductService y de CarritoService (cartService)

  constructor(public productService: ProductService,
              public cartService: CarritoService) {
    this.cursos = this.cartService.items;
  }


  agregarAlCarrito(product: Datos): void {
    this.cartService.addToCart(product);
    this.mostrarCarrito = true; // Esto activará el modal
    this.mostrarNotificacion();
  }

  mostrarNotificacion() {
    this.notificacionVisible = true;
    setTimeout(() => {
      this.notificacionVisible = false;
    }, 3000); // 3 segundos
  }


  // Obtener categorías únicas de los cursos
  get categoriasUnicas(): string[] {
    const categorias = this.productService.datos.map(curso => curso.categoria);
    return [...new Set(categorias)]; // Elimina duplicados
  }





cerrarCarrito() {
  this.mostrarCarrito = false;
}


}

  /*  this.cursos = this.productService.datos; // O usar un observable si es async */











