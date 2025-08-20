import { Component } from '@angular/core';
import {CategoriesComponent} from "../../components/categories/categories.component";
import {CursesComponent} from "../../components/curses/curses.component";
import {HeroComponent} from "../../components/hero/hero.component";

@Component({
  selector: 'app-inicio',
    imports: [
        CategoriesComponent,
        CursesComponent,
        HeroComponent
    ],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css'
})
export class InicioComponent {

}
