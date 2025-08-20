import { Component } from '@angular/core';
import {CommonModule} from '@angular/common';
import { RouterLink } from '@angular/router';
import { HeaderComponent} from '../../components/header/header.component';
import { FooterComponent} from '../../components/footer/footer.component';

@Component({
  selector: 'app-sobre-nosotros',
  imports: [CommonModule, RouterLink, HeaderComponent, FooterComponent],
  standalone: true, // ¡Debe ser standalone!
  templateUrl: './sobre-nosotros.component.html',
  styleUrl: './sobre-nosotros.component.css'
})
export class SobreNosotrosComponent {

}
