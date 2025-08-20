import { Component } from '@angular/core';
import { initFlowbite } from 'flowbite'
import {RouterLink, RouterOutlet} from '@angular/router';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterOutlet],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  ngOnInit(): void {
    initFlowbite();
  }

}
