# Ejemplos Prácticos: RxJS, BehaviorSubject y la Implementación

## 🎯 Ejemplo 1: BehaviorSubject Básico

### Código Simple

```typescript
import { BehaviorSubject } from 'rxjs';

// Crear un BehaviorSubject con valor inicial
const contador$ = new BehaviorSubject<number>(0);

// Suscribirse y recibir el valor inicial inmediatamente
contador$.subscribe(valor => {
  console.log('Valor actual:', valor);
});
// Salida: "Valor actual: 0" (recibe el valor inicial)

// Cambiar el valor
contador$.next(1);
// Salida: "Valor actual: 1"

contador$.next(2);
// Salida: "Valor actual: 2"

// Nuevo suscriptor (recibe el último valor)
contador$.subscribe(valor => {
  console.log('Nuevo suscriptor:', valor);
});
// Salida: "Nuevo suscriptor: 2" (recibe el último valor)
```

### Comparación Visual

```
BehaviorSubject(0)
    │
    ├─ Suscriptor 1 → Recibe: 0 (inicial)
    │
    └─ next(1)
        │
        ├─ Suscriptor 1 → Recibe: 1
        │
        └─ next(2)
            │
            ├─ Suscriptor 1 → Recibe: 2
            │
            └─ Suscriptor 2 (nuevo) → Recibe: 2 (último valor)
```

---

## 🛒 Ejemplo 2: Carrito Simple (Sin Servicios)

### Implementación Básica

```typescript
import { BehaviorSubject } from 'rxjs';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
  cantidad: number;
}

// Estado del carrito
const carrito$ = new BehaviorSubject<Producto[]>([]);

// Función para agregar producto
function agregarProducto(producto: Producto) {
  const carritoActual = carrito$.value; // Obtener valor actual
  const nuevoCarrito = [...carritoActual, producto]; // Crear nuevo array
  carrito$.next(nuevoCarrito); // Emitir nuevo valor
}

// Función para eliminar producto
function eliminarProducto(id: number) {
  const carritoActual = carrito$.value;
  const nuevoCarrito = carritoActual.filter(p => p.id !== id);
  carrito$.next(nuevoCarrito);
}

// Suscribirse a cambios
carrito$.subscribe(carrito => {
  console.log('Carrito actualizado:', carrito);
  console.log('Total items:', carrito.length);
});

// Usar
agregarProducto({ id: 1, nombre: 'Curso Angular', precio: 100, cantidad: 1 });
// Salida: "Carrito actualizado: [{ id: 1, ... }]"
// Salida: "Total items: 1"

agregarProducto({ id: 2, nombre: 'Curso React', precio: 150, cantidad: 1 });
// Salida: "Carrito actualizado: [{ id: 1, ... }, { id: 2, ... }]"
// Salida: "Total items: 2"

eliminarProducto(1);
// Salida: "Carrito actualizado: [{ id: 2, ... }]"
// Salida: "Total items: 1"
```

---

## 🔄 Ejemplo 3: Múltiples Suscriptores

### Escenario: 3 Componentes Observando el Mismo Estado

```typescript
import { BehaviorSubject } from 'rxjs';

const carrito$ = new BehaviorSubject<Producto[]>([]);

// ===== COMPONENTE 1: Lista de Productos =====
carrito$.subscribe(items => {
  console.log('📋 Lista actualizada:', items);
  // Actualizar vista de lista
});

// ===== COMPONENTE 2: Contador de Items =====
carrito$.subscribe(items => {
  const total = items.reduce((sum, item) => sum + item.cantidad, 0);
  console.log('🔢 Total items:', total);
  // Actualizar contador en header
});

// ===== COMPONENTE 3: Total del Carrito =====
carrito$.subscribe(items => {
  const total = items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
  console.log('💰 Total precio:', total);
  // Actualizar total en checkout
});

// Cuando cambias el carrito, TODOS los componentes se actualizan
carrito$.next([{ id: 1, nombre: 'Curso', precio: 100, cantidad: 2 }]);

// Salida:
// 📋 Lista actualizada: [{ id: 1, ... }]
// 🔢 Total items: 2
// 💰 Total precio: 200
```

**Ventaja:** Un solo cambio actualiza automáticamente todos los componentes.

---

## 🎨 Ejemplo 4: Estado de UI Separado

### Por qué Separar Estado de UI

```typescript
import { BehaviorSubject } from 'rxjs';

// ❌ MAL: Todo mezclado
interface EstadoMezclado {
  items: Producto[];
  isLoading: boolean;
  error: string | null;
}

// ✅ BIEN: Estados separados
interface CartState {
  items: Producto[];
}

interface UIState {
  isLoading: boolean;
  error: string | null;
}

// Implementación
const cartState$ = new BehaviorSubject<CartState>({ items: [] });
const uiState$ = new BehaviorSubject<UIState>({ isLoading: false, error: null });

// Suscribirse solo a lo que necesitas
cartState$.subscribe(cart => {
  // Solo me interesa el carrito, no el loading
  console.log('Items:', cart.items);
});

uiState$.subscribe(ui => {
  // Solo me interesa el loading, no los items
  if (ui.isLoading) {
    console.log('Mostrar spinner');
  }
  if (ui.error) {
    console.log('Mostrar error:', ui.error);
  }
});
```

**Ventaja:** Puedes suscribirte solo a lo que necesitas, mejor rendimiento.

---

## 🔀 Ejemplo 5: combineLatest (Combinar Estados)

### Combinar Múltiples Observables

```typescript
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

const cartState$ = new BehaviorSubject({ items: [] });
const uiState$ = new BehaviorSubject({ isLoading: false });
const summaryState$ = new BehaviorSubject({ total: 0 });

// Combinar los 3 estados
const combinedState$ = combineLatest([
  cartState$,
  uiState$,
  summaryState$
]).pipe(
  map(([cart, ui, summary]) => ({
    cart,
    ui,
    summary
  }))
);

// Suscribirse al estado combinado
combinedState$.subscribe(state => {
  console.log('Estado completo:', state);
  // {
  //   cart: { items: [...] },
  //   ui: { isLoading: false },
  //   summary: { total: 100 }
  // }
});

// Cuando CUALQUIERA de los 3 cambia, se emite el estado combinado
cartState$.next({ items: [producto1] });
// Emite: { cart: {...}, ui: {...}, summary: {...} }

uiState$.next({ isLoading: true });
// Emite: { cart: {...}, ui: { isLoading: true }, summary: {...} }
```

**Uso en la implementación:**
```typescript
// En CartStateService
public combinedState$ = combineLatest([
  this.cartState$,
  this.cartUIState$,
  this.cartSummaryState$
]).pipe(
  map(([cart, ui, summary]) => ({ cart, ui, summary }))
);
```

---

## 🎯 Ejemplo 6: Flujo Completo de Agregar Producto

### Paso a Paso con Logs

```typescript
import { BehaviorSubject } from 'rxjs';

// Estados
const cartState$ = new BehaviorSubject({ items: [], totalItems: 0 });
const uiState$ = new BehaviorSubject({ isLoading: false, error: null });

// Suscriptores (simulando componentes)
cartState$.subscribe(state => {
  console.log('🛒 Carrito:', state.items);
  console.log('📊 Total items:', state.totalItems);
});

uiState$.subscribe(ui => {
  if (ui.isLoading) console.log('⏳ Cargando...');
  if (ui.error) console.log('❌ Error:', ui.error);
});

// Función para agregar producto
function agregarProducto(producto: Producto) {
  console.log('\n=== AGREGANDO PRODUCTO ===');
  
  // 1. Mostrar loading
  console.log('1. Mostrando loading...');
  uiState$.next({ isLoading: true, error: null });
  
  // 2. Obtener estado actual
  const estadoActual = cartState$.value;
  console.log('2. Estado actual:', estadoActual);
  
  // 3. Crear nuevo estado (inmutable)
  const nuevoEstado = {
    items: [...estadoActual.items, producto],
    totalItems: estadoActual.totalItems + producto.cantidad
  };
  console.log('3. Nuevo estado:', nuevoEstado);
  
  // 4. Actualizar estado
  cartState$.next(nuevoEstado);
  console.log('4. Estado actualizado');
  
  // 5. Ocultar loading
  console.log('5. Ocultando loading...');
  uiState$.next({ isLoading: false, error: null });
  
  console.log('=== COMPLETADO ===\n');
}

// Ejecutar
agregarProducto({ id: 1, nombre: 'Curso Angular', precio: 100, cantidad: 1 });

// Salida:
// === AGREGANDO PRODUCTO ===
// 1. Mostrando loading...
// ⏳ Cargando...
// 2. Estado actual: { items: [], totalItems: 0 }
// 3. Nuevo estado: { items: [{ id: 1, ... }], totalItems: 1 }
// 4. Estado actualizado
// 🛒 Carrito: [{ id: 1, ... }]
// 📊 Total items: 1
// 5. Ocultando loading...
// === COMPLETADO ===
```

---

## 🔧 Ejemplo 7: Operadores RxJS Comunes

### map - Transformar Valores

```typescript
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';

const items$ = new BehaviorSubject([{ precio: 100, cantidad: 2 }]);

// Transformar items a total
const total$ = items$.pipe(
  map(items => items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0))
);

total$.subscribe(total => console.log('Total:', total));
// Salida: "Total: 200"
```

### filter - Filtrar Valores

```typescript
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

const items$ = new BehaviorSubject([
  { id: 1, precio: 100 },
  { id: 2, precio: 200 },
  { id: 3, precio: 50 }
]);

// Solo items caros (> 150)
const itemsCaros$ = items$.pipe(
  map(items => items.filter(item => item.precio > 150))
);

itemsCaros$.subscribe(items => console.log('Items caros:', items));
// Salida: "Items caros: [{ id: 2, precio: 200 }]"
```

### distinctUntilChanged - Evitar Valores Duplicados

```typescript
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

const total$ = new BehaviorSubject(100);

total$.pipe(
  distinctUntilChanged() // Solo emite si el valor cambió
).subscribe(total => {
  console.log('Total cambió:', total);
});

total$.next(100); // No emite (mismo valor)
total$.next(200); // Emite: "Total cambió: 200"
total$.next(200); // No emite (mismo valor)
total$.next(300); // Emite: "Total cambió: 300"
```

---

## 🎭 Ejemplo 8: Patrón Facade (CarritoService)

### Sin Facade (Complejo)

```typescript
// Componente necesita conocer CartStateService
constructor(private cartStateService: CartStateService) {}

ngOnInit() {
  // Tiene que suscribirse a múltiples estados
  this.cartStateService.cartState$.subscribe(...);
  this.cartStateService.cartUIState$.subscribe(...);
  this.cartStateService.cartSummaryState$.subscribe(...);
}

addProduct(product: Datos) {
  this.cartStateService.addItem(product);
}
```

### Con Facade (Simple)

```typescript
// Componente solo conoce CarritoService (más simple)
constructor(private cartService: CarritoService) {}

ngOnInit() {
  // Una sola suscripción
  this.cartService.cartUpdated$.subscribe(items => {
    this.items = items;
  });
}

addProduct(product: Datos) {
  this.cartService.addToCart(product); // Mismo nombre que antes
}
```

**El Facade (CarritoService) hace esto:**
```typescript
export class CarritoService {
  constructor(private cartStateService: CartStateService) {
    // Sincroniza el legacy con el nuevo estado
    this.cartStateService.cartState$.subscribe(state => {
      this.cartUpdated.next(state.items); // Mantiene compatibilidad
    });
  }
  
  addToCart(product: Datos) {
    // Delega al servicio real
    this.cartStateService.addItem(product);
  }
}
```

**Ventaja:** El código existente no necesita cambiar.

---

## 🔄 Ejemplo 9: Persistencia con localStorage

### Guardar Automáticamente

```typescript
import { BehaviorSubject } from 'rxjs';

const cartState$ = new BehaviorSubject({ items: [] });

// Guardar cada vez que cambia
cartState$.subscribe(state => {
  localStorage.setItem('carrito', JSON.stringify(state.items));
  console.log('💾 Guardado en localStorage');
});

// Cargar al iniciar
function cargarDesdeLocalStorage() {
  const guardado = localStorage.getItem('carrito');
  if (guardado) {
    const items = JSON.parse(guardado);
    cartState$.next({ items });
    console.log('📂 Cargado desde localStorage:', items);
  }
}

// Usar
cargarDesdeLocalStorage(); // Carga al iniciar

cartState$.next({ items: [{ id: 1, nombre: 'Curso' }] });
// Automáticamente guarda en localStorage
```

**En la implementación:**
```typescript
// En CartStateService
constructor() {
  this.loadFromLocalStorage(); // Carga al iniciar
  
  // Guarda automáticamente cuando cambia
  this.cartState$.subscribe(() => {
    this.saveToLocalStorage();
  });
}
```

---

## 🎯 Ejemplo 10: Cálculo Automático del Resumen

### Resumen que se Actualiza Automáticamente

```typescript
import { BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

const cartState$ = new BehaviorSubject({ items: [] });
const summaryState$ = new BehaviorSubject({ 
  subtotal: 0, 
  tax: 0, 
  total: 0 
});

// Cuando cambia el carrito, recalcular resumen
cartState$.subscribe(cart => {
  const subtotal = cart.items.reduce((sum, item) => 
    sum + (item.precio * item.cantidad), 0
  );
  const tax = subtotal * 0.16;
  const total = subtotal + tax;
  
  summaryState$.next({ subtotal, tax, total });
  console.log('💰 Resumen actualizado:', { subtotal, tax, total });
});

// Suscribirse al resumen
summaryState$.subscribe(summary => {
  console.log('📊 Resumen:', summary);
});

// Agregar producto
cartState$.next({ 
  items: [{ id: 1, precio: 100, cantidad: 2 }] 
});

// Salida:
// 💰 Resumen actualizado: { subtotal: 200, tax: 32, total: 232 }
// 📊 Resumen: { subtotal: 200, tax: 32, total: 232 }
```

**En la implementación:**
```typescript
// En CartStateService constructor
this.cartState$.subscribe(cart => {
  this.updateSummary(cart.items); // Automático
});
```

---

## 🎓 Ejemplo 11: Manejo de Errores

### Con Try-Catch y Estado de Error

```typescript
import { BehaviorSubject } from 'rxjs';

const cartState$ = new BehaviorSubject({ items: [] });
const uiState$ = new BehaviorSubject({ 
  isLoading: false, 
  error: null 
});

function agregarProducto(producto: Producto) {
  uiState$.next({ isLoading: true, error: null });
  
  try {
    // Simular operación que puede fallar
    if (producto.precio < 0) {
      throw new Error('Precio inválido');
    }
    
    const estadoActual = cartState$.value;
    cartState$.next({
      items: [...estadoActual.items, producto]
    });
    
    uiState$.next({ isLoading: false, error: null });
  } catch (error) {
    uiState$.next({ 
      isLoading: false, 
      error: error.message 
    });
    
    // Auto-limpiar error después de 5 segundos
    setTimeout(() => {
      uiState$.next({ isLoading: false, error: null });
    }, 5000);
  }
}

// Suscribirse a errores
uiState$.subscribe(ui => {
  if (ui.error) {
    console.log('❌ Error:', ui.error);
    // Mostrar mensaje de error en UI
  }
});

// Usar
agregarProducto({ id: 1, nombre: 'Curso', precio: -10 });
// Salida: "❌ Error: Precio inválido"
```

---

## 🎨 Ejemplo 12: En un Componente Angular Real

### Componente Completo

```typescript
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { CartStateService } from './services/cart-state.service';
import { CartState, CartUIState, CartSummaryState } from './models/cart-state.models';

@Component({
  selector: 'app-cart',
  template: `
    <div *ngIf="uiState?.isLoading">Cargando...</div>
    <div *ngIf="uiState?.error" class="error">{{ uiState.error }}</div>
    
    <div *ngFor="let item of cartState?.items">
      <h3>{{ item.nombre }}</h3>
      <p>Precio: {{ item.precio | currency }}</p>
      <p>Cantidad: {{ item.cantidad }}</p>
      <button (click)="aumentarCantidad(item.id)">+</button>
      <button (click)="disminuirCantidad(item.id)">-</button>
      <button (click)="eliminar(item.id)">Eliminar</button>
    </div>
    
    <div class="resumen">
      <p>Subtotal: {{ summaryState?.subtotal | currency }}</p>
      <p>Impuestos: {{ summaryState?.tax | currency }}</p>
      <p>Total: {{ summaryState?.total | currency }}</p>
    </div>
  `
})
export class CartComponent implements OnInit, OnDestroy {
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

  aumentarCantidad(productId: number) {
    this.cartStateService.increaseQuantity(productId);
  }

  disminuirCantidad(productId: number) {
    this.cartStateService.decreaseQuantity(productId);
  }

  eliminar(productId: number) {
    this.cartStateService.removeItem(productId);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe(); // IMPORTANTE: Limpiar suscripciones
  }
}
```

---

## 🎯 Resumen de Conceptos Clave

### 1. BehaviorSubject
- Guarda el último valor
- Nuevos suscriptores reciben el último valor
- Perfecto para estado

### 2. Observables
- Emiten valores en el tiempo
- Te suscribes para recibir valores
- Siempre desuscribirse

### 3. Inmutabilidad
- Crear nuevos objetos, no modificar
- Angular detecta cambios mejor
- Más fácil de debuggear

### 4. Separación de Estados
- Cada estado tiene un propósito
- Más fácil de mantener
- Mejor rendimiento

### 5. Patrón Facade
- Simplifica interfaces complejas
- Mantiene compatibilidad
- Facilita migración

---

¡Con estos ejemplos deberías entender perfectamente cómo funciona todo! 🎉

