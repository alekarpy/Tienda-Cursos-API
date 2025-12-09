import { Component, OnInit } from "@angular/core";
import { Router, NavigationEnd} from "@angular/router";
import { RouterOutlet } from "@angular/router";
import { HeaderComponent } from "./components/header/header.component";
import { initFlowbite } from "flowbite";
import "flowbite";
import { FooterComponent } from "./components/footer/footer.component";
import { filter } from "rxjs/operators";

@Component({
  selector: "app-root",
  standalone: true, // ¡Importante!
  imports: [RouterOutlet, HeaderComponent, FooterComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.css",
})
export class AppComponent implements OnInit {
    title = "Angular App";

    // 👉 Controla si mostramos o no header y footer
    showLayout = true;

    constructor(private router: Router) {
    }

    ngOnInit(): void {
        initFlowbite();

        // Detecta cambio de ruta
        this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe((event: any) => {

                // Rutas donde NO quieres header/footer
                const noLayoutRoutes = ['/login', '/register'];

                this.showLayout = !noLayoutRoutes.includes(event.urlAfterRedirects);
            });
    }
}


