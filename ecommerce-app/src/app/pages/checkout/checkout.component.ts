import { Component, OnInit } from '@angular/core';
import { CarritoService } from '../../services/cart.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import {FormsModule, FormControl, Validators, ReactiveFormsModule} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';


@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css'],
  standalone: true,
  imports: [CommonModule, CurrencyPipe, FormsModule, RouterLink, ReactiveFormsModule]
})
export class CheckoutComponent implements OnInit {


  constructor(
    public cartService: CarritoService,
    private router: Router
  ) {
  }

  ngOnInit() {
    // Redirigir si el carrito está vacío
    if (this.cartService.cartItems.length === 0) {
      this.router.navigate(['/']);
    }
  }


  // Método para enviar el formulario
  onSubmit() {
    if (this.cartService.cartItems.length === 0) {
      alert('El carrito está vacío');
      return;
    }
  }

  get total() {
    return this.cartService.getTotalPrice();
  }


  // Metodo para validar el formulario
phoneControl = new FormControl('', {
  validators: [
    Validators.required,
    Validators.pattern(/^[0-9]+$/),
    Validators.minLength(10),
    Validators.maxLength(15)
  ],
  nonNullable: true // Opcional
});
};
