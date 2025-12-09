import { Component } from '@angular/core';
import { initFlowbite } from 'flowbite'
import {RouterLink} from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProfileMenuComponent } from '../profile-menu/profile-menu.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink,
      CommonModule,
      RouterModule,
      ProfileMenuComponent // ← Importar el componente
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  ngOnInit(): void {
    initFlowbite();
  }


    constructor(private router: Router) {}

    onLogout(): void {
        // Limpiar localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        // Redirigir al login
        this.router.navigate(['/login']);
    }
}