# Gestión de Estado del Carrito con BehaviorSubject + RxJS

## Resumen

Se ha implementado un sistema de gestión de estado robusto para el carrito de compras usando **BehaviorSubject + RxJS** con **3 estados/entidades separadas**:

1. **CartState** - Estado principal del carrito (items, totalItems, lastUpdated)
2. **CartUIState** - Estado de la interfaz de usuario (loading, isOpen, error, isProcessing)
3. **CartSummaryState** - Resumen financiero (subtotal, tax, shipping, discount, total, currency)

## Arquitectura

### Servicios

#### `CartStateService` (Nuevo)
Servicio principal que maneja los 3 estados con BehaviorSubjects independientes.

**Ubicación:** `src/app/services/cart-state.service.ts`

**Características:**
- 3 BehaviorSubjects independientes para cada estado
- Observables públicos para suscripciones reactivas
- Estado combinado derivado usando `combineLatest`
- Persistencia automática en localStorage
- Cálculo automático del resumen cuando cambia el carrito

#### `CarritoService` (Refactorizado)
Servicio facade que mantiene compatibilidad con código existente mientras usa internamente `CartStateService`.

**Ubicación:** `src/app/services/cart.service.ts`

**Características:**
- API pública compatible con código existente
- Internamente delega a `CartStateService`
- Métodos adicionales para acceder a los estados avanzados

## Uso Básico (Compatibilidad Legacy)

El código existente sigue funcionando sin cambios:

```typescript
// En cualquier componente
constructor(private cartService: CarritoService) {}

ngOnInit() {
  // Suscripción legacy - sigue funcionando
  this.cartService.cartUpdated$.subscribe(items => {
    this.items = items;
  });
}

addToCart(product: Datos) {
  this.cartService.addToCart(product);
}

getTotal() {
  return this.cartService.getTotalPrice();
}
```

## Uso Avanzado (Nuevos Estados)

### Acceder a los Estados Individuales

```typescript
import { CartStateService } from './services/cart-state.service';
import { CartState, CartUIState, CartSummaryState } from './models/cart-state.models';

constructor(private cartStateService: CartStateService) {}

ngOnInit() {
  // Estado del carrito
  this.cartStateService.cartState$.subscribe(state => {
    console.log('Items:', state.items);
    console.log('Total items:', state.totalItems);
    console.log('Última actualización:', state.lastUpdated);
  });

  // Estado de UI
  this.cartStateService.cartUIState$.subscribe(ui => {
    if (ui.isLoading) {
      // Mostrar spinner
    }
    if (ui.error) {
      // Mostrar error
    }
    if (ui.isOpen) {
      // Carrito abierto
    }
  });

  // Resumen del carrito
  this.cartStateService.cartSummaryState$.subscribe(summary => {
    console.log('Subtotal:', summary.subtotal);
    console.log('Impuestos:', summary.tax);
    console.log('Envío:', summary.shipping);
    console.log('Descuento:', summary.discount);
    console.log('Total:', summary.total);
  });
}
```

### Acceder al Estado Combinado

```typescript
this.cartStateService.combinedState$.subscribe(combined => {
  const { cart, ui, summary } = combined;
  // Acceso a todos los estados en un solo observable
});
```

### Obtener Valores Actuales (Síncrono)

```typescript
// Obtener estado actual sin suscripción
const currentCart = this.cartStateService.currentCartState;
const currentUI = this.cartStateService.currentUIState;
const currentSummary = this.cartStateService.currentSummaryState;
```

### Controlar el Estado de UI

```typescript
// Abrir/cerrar carrito
this.cartStateService.setOpen(true);

// Mostrar/ocultar loading
this.cartStateService.setLoading(true);

// Establecer error
this.cartStateService.setError('Error al procesar');

// Limpiar error
this.cartStateService.setError(null);

// Indicar procesamiento
this.cartStateService.setProcessing(true);
```

## Ejemplo Completo en un Componente

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartStateService } from './services/cart-state.service';
import { CartState, CartUIState, CartSummaryState } from './models/cart-state.models';

@Component({
  selector: 'app-cart-example',
  template: `
    <div *ngIf="uiState?.isLoading">Cargando...</div>
    <div *ngIf="uiState?.error" class="error">{{ uiState.error }}</div>
    
    <div *ngFor="let item of cartState?.items">
      {{ item.nombre }} - Cantidad: {{ item.cantidad }}
    </div>
    
    <div>
      <p>Subtotal: {{ summaryState?.subtotal | currency }}</p>
      <p>Impuestos: {{ summaryState?.tax | currency }}</p>
      <p>Total: {{ summaryState?.total | currency }}</p>
    </div>
  `
})
export class CartExampleComponent implements OnInit, OnDestroy {
  cartState: CartState | null = null;
  uiState: CartUIState | null = null;
  summaryState: CartSummaryState | null = null;
  private subscriptions = new Subscription();

  constructor(private cartStateService: CartStateService) {}

  ngOnInit() {
    // Suscribirse a los 3 estados
    this.subscriptions.add(
      this.cartStateService.cartState$.subscribe(state => {
        this.cartState = state;
      })
    );

    this.subscriptions.add(
      this.cartStateService.cartUIState$.subscribe(ui => {
        this.uiState = ui;
      })
    );

    this.subscriptions.add(
      this.cartStateService.cartSummaryState$.subscribe(summary => {
        this.summaryState = summary;
      })
    );
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }
}
```

## Ventajas de esta Implementación

1. **Separación de Responsabilidades**: Cada estado tiene un propósito claro
2. **Reactividad**: Cambios automáticos en toda la aplicación
3. **Escalabilidad**: Fácil agregar nuevos estados
4. **Compatibilidad**: El código existente sigue funcionando
5. **Type Safety**: TypeScript garantiza tipos correctos
6. **Persistencia**: Automática en localStorage
7. **Cálculos Automáticos**: El resumen se actualiza automáticamente

## Migración desde Código Legacy

Si tienes código que usa directamente `CarritoService`, no necesitas cambiar nada. El servicio mantiene la misma API pública.

Si quieres aprovechar los nuevos estados, puedes:

1. Inyectar `CartStateService` además de `CarritoService`
2. Suscribirte a los observables de estado que necesites
3. Usar los métodos de control de UI cuando sea necesario

## Comparación con NgRx

### BehaviorSubject + RxJS (Implementación Actual)
✅ **Ventajas:**
- Más simple y directo
- Menos boilerplate
- Fácil de entender
- No requiere dependencias adicionales
- Perfecto para aplicaciones medianas

❌ **Desventajas:**
- No tiene DevTools integradas
- Menos estructura para aplicaciones muy grandes
- No tiene time-travel debugging

### NgRx (Alternativa)
✅ **Ventajas:**
- DevTools poderosas
- Time-travel debugging
- Estructura muy clara para apps grandes
- Patrón estándar de la industria

❌ **Desventajas:**
- Más complejo
- Más boilerplate
- Curva de aprendizaje más alta
- Requiere instalar dependencias

**Recomendación:** Para esta aplicación, BehaviorSubject + RxJS es suficiente. Si la aplicación crece mucho, se puede migrar a NgRx más adelante.

## Próximos Pasos

1. ✅ Implementación de 3 estados separados
2. ✅ Refactorización de CarritoService
3. ✅ Actualización de componentes
4. 🔄 (Opcional) Agregar más estados si es necesario
5. 🔄 (Opcional) Implementar efectos para operaciones asíncronas
6. 🔄 (Opcional) Agregar selectores para cálculos complejos

## Archivos Creados/Modificados

### Nuevos Archivos
- `src/app/models/cart-state.models.ts` - Interfaces de los estados
- `src/app/services/cart-state.service.ts` - Servicio de estado principal

### Archivos Modificados
- `src/app/services/cart.service.ts` - Refactorizado para usar CartStateService
- `src/app/pages/cart/cart.component.ts` - Actualizado para usar nuevos estados
- `src/app/pages/cart-full/cart-full.component.ts` - Actualizado para usar nuevos estados
- `src/app/pages/cart-full/cart-full.component.html` - Actualizado para mostrar resumen completo

