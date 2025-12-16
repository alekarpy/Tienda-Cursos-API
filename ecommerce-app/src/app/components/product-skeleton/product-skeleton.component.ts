import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-product-skeleton",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./product-skeleton.component.html",
  styleUrls: ["./product-skeleton.component.css"],
})
export class ProductSkeletonComponent {
  // Este componente ahora renderiza un solo skeleton card
  // Para múltiples skeletons, usa @for en el template padre
}

