import { Component } from "@angular/core";
import { Router } from "@angular/router";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-checkout-cancel",
  templateUrl: "./checkout-cancel.component.html",
  styleUrls: ["./checkout-cancel.component.css"],
  standalone: true,
  imports: [CommonModule],
})
export class CheckoutCancelComponent {
  constructor(private router: Router) {}

  goToCheckout() {
    this.router.navigate(["/checkout"]);
  }

  goToCart() {
    this.router.navigate(["/cart-full"]);
  }
}
