# Ejemplo de Implementación con NgRx (Alternativa)

Este documento muestra cómo sería la implementación usando **NgRx** en lugar de BehaviorSubject + RxJS. Esta es una referencia para el futuro si decides migrar.

## Instalación de NgRx

```bash
npm install @ngrx/store @ngrx/effects @ngrx/store-devtools
```

## Estructura de Archivos

```
src/app/
├── store/
│   ├── cart/
│   │   ├── cart.actions.ts
│   │   ├── cart.reducer.ts
│   │   ├── cart.effects.ts
│   │   ├── cart.selectors.ts
│   │   └── cart.state.ts
│   ├── ui/
│   │   ├── ui.actions.ts
│   │   ├── ui.reducer.ts
│   │   └── ui.selectors.ts
│   ├── summary/
│   │   ├── summary.actions.ts
│   │   ├── summary.reducer.ts
│   │   └── summary.selectors.ts
│   └── index.ts
```

## Estado 1: Cart State

### `cart.state.ts`
```typescript
import { Datos } from '../../datos';

export interface CartState {
  items: Datos[];
  totalItems: number;
  lastUpdated: Date | null;
  loading: boolean;
  error: string | null;
}

export const initialState: CartState = {
  items: [],
  totalItems: 0,
  lastUpdated: null,
  loading: false,
  error: null
};
```

### `cart.actions.ts`
```typescript
import { createAction, props } from '@ngrx/store';
import { Datos } from '../../datos';

export const loadCart = createAction('[Cart] Load Cart');
export const loadCartSuccess = createAction(
  '[Cart] Load Cart Success',
  props<{ items: Datos[] }>()
);
export const loadCartFailure = createAction(
  '[Cart] Load Cart Failure',
  props<{ error: string }>()
);

export const addItem = createAction(
  '[Cart] Add Item',
  props<{ product: Datos }>()
);

export const removeItem = createAction(
  '[Cart] Remove Item',
  props<{ productId: number }>()
);

export const updateQuantity = createAction(
  '[Cart] Update Quantity',
  props<{ productId: number; quantity: number }>()
);

export const clearCart = createAction('[Cart] Clear Cart');
```

### `cart.reducer.ts`
```typescript
import { createReducer, on } from '@ngrx/store';
import { CartState, initialState } from './cart.state';
import * as CartActions from './cart.actions';

export const cartReducer = createReducer(
  initialState,
  
  on(CartActions.loadCart, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  
  on(CartActions.loadCartSuccess, (state, { items }) => ({
    ...state,
    items,
    totalItems: items.reduce((sum, item) => sum + item.cantidad, 0),
    lastUpdated: new Date(),
    loading: false
  })),
  
  on(CartActions.addItem, (state, { product }) => {
    const existingItem = state.items.find(item => item.id === product.id);
    let updatedItems: Datos[];
    
    if (existingItem) {
      updatedItems = state.items.map(item =>
        item.id === product.id
          ? { ...item, cantidad: item.cantidad + 1 }
          : item
      );
    } else {
      updatedItems = [...state.items, { ...product, cantidad: 1 }];
    }
    
    return {
      ...state,
      items: updatedItems,
      totalItems: updatedItems.reduce((sum, item) => sum + item.cantidad, 0),
      lastUpdated: new Date()
    };
  }),
  
  on(CartActions.removeItem, (state, { productId }) => {
    const updatedItems = state.items.filter(item => item.id !== productId);
    return {
      ...state,
      items: updatedItems,
      totalItems: updatedItems.reduce((sum, item) => sum + item.cantidad, 0),
      lastUpdated: new Date()
    };
  }),
  
  on(CartActions.updateQuantity, (state, { productId, quantity }) => {
    if (quantity <= 0) {
      return cartReducer(state, CartActions.removeItem({ productId }));
    }
    
    const updatedItems = state.items.map(item =>
      item.id === productId
        ? { ...item, cantidad: quantity }
        : item
    );
    
    return {
      ...state,
      items: updatedItems,
      totalItems: updatedItems.reduce((sum, item) => sum + item.cantidad, 0),
      lastUpdated: new Date()
    };
  }),
  
  on(CartActions.clearCart, () => initialState)
);
```

### `cart.selectors.ts`
```typescript
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CartState } from './cart.state';

export const selectCartState = createFeatureSelector<CartState>('cart');

export const selectCartItems = createSelector(
  selectCartState,
  (state) => state.items
);

export const selectTotalItems = createSelector(
  selectCartState,
  (state) => state.totalItems
);

export const selectCartLoading = createSelector(
  selectCartState,
  (state) => state.loading
);

export const selectCartError = createSelector(
  selectCartState,
  (state) => state.error
);
```

### `cart.effects.ts`
```typescript
import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import * as CartActions from './cart.actions';

@Injectable()
export class CartEffects {
  loadCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(CartActions.loadCart),
      switchMap(() => {
        try {
          const saved = localStorage.getItem('carrito');
          const items = saved ? JSON.parse(saved) : [];
          return of(CartActions.loadCartSuccess({ items }));
        } catch (error) {
          return of(CartActions.loadCartFailure({ 
            error: 'Error al cargar el carrito' 
          }));
        }
      })
    )
  );

  saveCart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        CartActions.addItem,
        CartActions.removeItem,
        CartActions.updateQuantity,
        CartActions.clearCart
      ),
      switchMap((action) => {
        // Aquí podrías hacer una llamada HTTP para guardar en el servidor
        // Por ahora solo guardamos en localStorage
        return of({ type: '[Cart] Save to Storage' });
      })
    ),
    { dispatch: false }
  );

  constructor(private actions$: Actions) {}
}
```

## Estado 2: UI State

### `ui.state.ts`
```typescript
export interface UIState {
  isCartOpen: boolean;
  isProcessing: boolean;
}

export const initialUIState: UIState = {
  isCartOpen: false,
  isProcessing: false
};
```

### `ui.actions.ts`
```typescript
import { createAction, props } from '@ngrx/store';

export const openCart = createAction('[UI] Open Cart');
export const closeCart = createAction('[UI] Close Cart');
export const setProcessing = createAction(
  '[UI] Set Processing',
  props<{ isProcessing: boolean }>()
);
```

### `ui.reducer.ts`
```typescript
import { createReducer, on } from '@ngrx/store';
import { UIState, initialUIState } from './ui.state';
import * as UIActions from './ui.actions';

export const uiReducer = createReducer(
  initialUIState,
  on(UIActions.openCart, (state) => ({ ...state, isCartOpen: true })),
  on(UIActions.closeCart, (state) => ({ ...state, isCartOpen: false })),
  on(UIActions.setProcessing, (state, { isProcessing }) => ({
    ...state,
    isProcessing
  }))
);
```

## Estado 3: Summary State

### `summary.state.ts`
```typescript
export interface SummaryState {
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  currency: string;
}

export const initialSummaryState: SummaryState = {
  subtotal: 0,
  tax: 0,
  shipping: 0,
  discount: 0,
  total: 0,
  currency: 'MXN'
};
```

### `summary.actions.ts`
```typescript
import { createAction, props } from '@ngrx/store';
import { SummaryState } from './summary.state';

export const updateSummary = createAction(
  '[Summary] Update Summary',
  props<{ summary: Partial<SummaryState> }>()
);

export const calculateSummary = createAction(
  '[Summary] Calculate Summary',
  props<{ subtotal: number }>()
);
```

### `summary.reducer.ts`
```typescript
import { createReducer, on } from '@ngrx/store';
import { SummaryState, initialSummaryState } from './summary.state';
import * as SummaryActions from './summary.actions';

export const summaryReducer = createReducer(
  initialSummaryState,
  on(SummaryActions.calculateSummary, (state, { subtotal }) => {
    const tax = subtotal * 0.16;
    const shipping = subtotal > 1000 ? 0 : 50;
    const discount = 0;
    const total = subtotal + tax + shipping - discount;
    
    return {
      ...state,
      subtotal,
      tax,
      shipping,
      discount,
      total
    };
  }),
  on(SummaryActions.updateSummary, (state, { summary }) => ({
    ...state,
    ...summary
  }))
);
```

## Configuración del Store

### `app.config.ts`
```typescript
import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { cartReducer } from './store/cart/cart.reducer';
import { uiReducer } from './store/ui/ui.reducer';
import { summaryReducer } from './store/summary/summary.reducer';
import { CartEffects } from './store/cart/cart.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideStore({
      cart: cartReducer,
      ui: uiReducer,
      summary: summaryReducer
    }),
    provideEffects([CartEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode()
    })
  ]
};
```

## Uso en Componentes

```typescript
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Datos } from '../../datos';
import * as CartActions from '../../store/cart/cart.actions';
import * as CartSelectors from '../../store/cart/cart.selectors';
import * as SummarySelectors from '../../store/summary/summary.selectors';

@Component({
  selector: 'app-cart',
  template: `
    <div *ngIf="loading$ | async">Cargando...</div>
    <div *ngFor="let item of items$ | async">
      {{ item.nombre }} - {{ item.cantidad }}
    </div>
    <div>Total: {{ total$ | async | currency }}</div>
  `
})
export class CartComponent implements OnInit {
  items$: Observable<Datos[]>;
  total$: Observable<number>;
  loading$: Observable<boolean>;

  constructor(private store: Store) {
    this.items$ = this.store.select(CartSelectors.selectCartItems);
    this.total$ = this.store.select(SummarySelectors.selectTotal);
    this.loading$ = this.store.select(CartSelectors.selectCartLoading);
  }

  ngOnInit() {
    this.store.dispatch(CartActions.loadCart());
  }

  addItem(product: Datos) {
    this.store.dispatch(CartActions.addItem({ product }));
  }

  removeItem(productId: number) {
    this.store.dispatch(CartActions.removeItem({ productId }));
  }
}
```

## Comparación

| Característica | BehaviorSubject + RxJS | NgRx |
|---------------|------------------------|------|
| Complejidad | Baja | Media-Alta |
| Boilerplate | Mínimo | Considerable |
| DevTools | No | Sí (Redux DevTools) |
| Time-travel | No | Sí |
| Curva de aprendizaje | Baja | Media |
| Tamaño del bundle | Menor | Mayor |
| Ideal para | Apps medianas | Apps grandes |

## Conclusión

Para esta aplicación, **BehaviorSubject + RxJS** es la mejor opción porque:
- Es más simple
- Tiene menos dependencias
- Es más fácil de mantener
- Es suficiente para las necesidades actuales

NgRx sería útil si:
- La aplicación crece mucho
- Necesitas DevTools avanzadas
- Tienes un equipo grande que necesita estructura estricta
- Necesitas time-travel debugging

