import { Component, Input } from "@angular/core";
import { CommonModule } from "@angular/common";

@Component({
  selector: "app-table-skeleton",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./table-skeleton.component.html",
  styleUrls: ["./table-skeleton.component.css"],
})
export class TableSkeletonComponent {
  @Input() rows: number = 5;
  @Input() columns: number = 6;

  // Helpers para crear arrays de números
  get rowsArray(): number[] {
    return Array.from({ length: this.rows }, (_, i) => i);
  }

  get columnsArray(): number[] {
    return Array.from({ length: this.columns }, (_, i) => i);
  }
}

