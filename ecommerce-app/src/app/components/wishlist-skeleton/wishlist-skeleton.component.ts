import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-wishlist-skeleton",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./wishlist-skeleton.component.html",
  styleUrls: ["./wishlist-skeleton.component.css"],
})
export class WishlistSkeletonComponent {
  @Input() count: number = 3;

  // Helper para crear array de números
  get skeletonArray(): number[] {
    return Array.from({ length: this.count }, (_, i) => i);
  }
}

