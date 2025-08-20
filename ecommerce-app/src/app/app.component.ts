import { Component, AfterViewInit, OnInit } from '@angular/core';
import {RouterOutlet, RouterLink} from '@angular/router';
import {HeaderComponent} from './components/header/header.component';
import {HeroComponent} from './components/hero/hero.component';
import { CursesComponent } from "./components/curses/curses.component";
import { initFlowbite } from 'flowbite';
import 'flowbite';
import {CategoriesComponent} from './components/categories/categories.component';
import { FooterComponent } from "./components/footer/footer.component";






@Component({
  selector: 'app-root',
  standalone: true, // ¡Importante!
  imports: [RouterOutlet, RouterLink, HeaderComponent, HeroComponent, CursesComponent, CategoriesComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  title= 'Angular App';

  ngOnInit(): void {
    initFlowbite();
  }


}
