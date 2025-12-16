// form-deactivate.guard.ts
import { Injectable } from "@angular/core";
import { CanDeactivate } from "@angular/router";
import { Observable } from "rxjs";

/**
 * Interfaz que deben implementar los componentes con formularios sensibles
 * para permitir que el guard verifique si se puede salir de la ruta
 */
export interface CanComponentDeactivate {
  canDeactivate(): boolean | Observable<boolean>;
}

@Injectable({
  providedIn: "root",
})
export class FormDeactivateGuard
  implements CanDeactivate<CanComponentDeactivate>
{
  canDeactivate(
    component: CanComponentDeactivate
  ): boolean | Observable<boolean> {
    console.log("=== FORM DEACTIVATE GUARD ===");
    console.log("Verificando si se puede salir del formulario...");

    // Si el componente implementa canDeactivate, lo llamamos
    if (component && typeof component.canDeactivate === "function") {
      const result = component.canDeactivate();
      console.log("Resultado de canDeactivate:", result);
      return result;
    }

    // Si no implementa la interfaz, permitimos salir
    console.log("Componente no implementa canDeactivate - permitiendo salir");
    return true;
  }
}

