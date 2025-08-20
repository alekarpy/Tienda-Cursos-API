// tema-selector.component.ts
import { Component, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-tema-selector',
  templateUrl: './selectordetemas.component.html'
})
export class TemaSelectorComponent {
  constructor(private renderer: Renderer2) {}

  cambiarTema(event: Event) :void {
    const tema = (event.target as HTMLSelectElement).value;
    // Remueve clases anteriores
    document.documentElement.classList.remove(
      'tema-morado',
      'tema-rosa',
      'tema-esmeralda',
      'tema-ambar'
    );
    // Añade nueva clase
    this.renderer.addClass(document.documentElement, `tema-${tema}`);
    // Guarda en localStorage (opcional)
    localStorage.setItem('tema', tema);
  }

  ngOnInit() {
    // Carga tema guardado (opcional)
    const temaGuardado = localStorage.getItem('tema') || 'morado';
    this.renderer.addClass(document.documentElement, `tema-${temaGuardado}`);
  }





  }
