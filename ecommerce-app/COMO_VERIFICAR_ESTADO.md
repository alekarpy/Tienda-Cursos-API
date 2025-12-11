# Cómo Verificar que BehaviorSubject + RxJS Está Funcionando

## ✅ Verificación 1: Confirmar que NO estás usando NgRx

### En el código:

1. **Revisa `package.json`** - NO debe tener `@ngrx`:

```json
// ✅ CORRECTO: Solo tiene rxjs
"rxjs": "7.8.0"

// ❌ Si tuvieras NgRx, verías:
// "@ngrx/store": "...",
// "@ngrx/effects": "..."
```

2. **Revisa los imports** - NO debe haber imports de NgRx:

```typescript
// ✅ CORRECTO: Usa BehaviorSubject de rxjs
import { BehaviorSubject } from "rxjs";

// ❌ Si tuvieras NgRx, verías:
// import { Store } from '@ngrx/store';
// import { createAction } from '@ngrx/store';
```

3. **Revisa `app.config.ts`** - NO debe tener `provideStore`:

```typescript
// ✅ CORRECTO: No hay configuración de NgRx
export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideHttpClient()],
};

// ❌ Si tuvieras NgRx, verías:
// provideStore({ cart: cartReducer })
```

---

## ✅ Verificación 2: Confirmar que SÍ estás usando BehaviorSubject + RxJS

### En el código:

1. **Revisa `cart-state.service.ts`** - Debe tener BehaviorSubject:

```typescript
// ✅ DEBE ESTAR ASÍ:
import { BehaviorSubject, Observable } from 'rxjs';

export class CartStateService {
    private cartStateSubject = new BehaviorSubject<CartState>(...);
    public cartState$: Observable<CartState> = this.cartStateSubject.asObservable();
}
```

2. **Revisa `cart.service.ts`** - Debe usar CartStateService:

```typescript
// ✅ DEBE ESTAR ASÍ:
import { CartStateService } from "./cart-state.service";

export class CarritoService {
  constructor(private cartStateService: CartStateService) {
    // Usa CartStateService internamente
  }
}
```

---

## 🔍 Verificación 3: Verificar en la Consola del Navegador

### Paso 1: Abre la Consola del Navegador

1. Abre tu aplicación en el navegador
2. Presiona `F12` o `Ctrl+Shift+I` (Windows/Linux) o `Cmd+Option+I` (Mac)
3. Ve a la pestaña **Console**

### Paso 2: Verifica los Logs de Inicialización

Cuando la aplicación se carga, deberías ver:

```
🛒 CartStateService inicializado
🛒 CarritoService inicializado (usando CartStateService)
```

### Paso 3: Verifica que los Estados Están Activos

En la consola, escribe:

```javascript
// Obtener el servicio desde Angular
// (Esto requiere acceso al injector, pero puedes verificar en el código)
```

**Mejor forma:** Agrega un producto al carrito y observa los logs:

```
🛒 === AGREGANDO AL CARRITO ===
🛒 Producto recibido: {...}
🔄 === ACTUALIZANDO CARRITO ===
💰 Resumen actualizado: {...}
```

---

## 🧪 Verificación 4: Prueba Práctica

### Test 1: Agregar Producto

1. Abre la aplicación
2. Agrega un producto al carrito
3. **Verifica en consola:**

   - Debe aparecer: `🛒 === AGREGANDO AL CARRITO ===`
   - Debe aparecer: `🔄 === ACTUALIZANDO CARRITO ===`
   - Debe aparecer: `💰 Resumen actualizado`

4. **Verifica en la UI:**
   - El producto aparece en el carrito
   - El contador de items se actualiza
   - El total se actualiza

### Test 2: Múltiples Componentes

1. Abre el carrito (modal o página completa)
2. Agrega un producto
3. **Verifica:**
   - El producto aparece en el carrito
   - El contador en el header se actualiza
   - El total se actualiza en ambos lugares

**Esto confirma que los estados están comunicados entre componentes.**

### Test 3: Persistencia

1. Agrega productos al carrito
2. Recarga la página (F5)
3. **Verifica:**
   - Los productos siguen en el carrito
   - Debe aparecer en consola: `📂 === CARGANDO DESDE LOCALSTORAGE ===`

---

## 🔬 Verificación 5: Inspeccionar en DevTools

### Chrome DevTools

1. Abre DevTools (F12)
2. Ve a la pestaña **Application** (o **Aplicación**)
3. En el menú izquierdo, expande **Local Storage**
4. Selecciona tu dominio
5. **Busca la clave `carrito`**
6. **Verifica que tiene datos:**

```json
[
  {
    "id": 1,
    "nombre": "...",
    "precio": 100,
    "cantidad": 2
  }
]
```

**Esto confirma que la persistencia funciona.**

---

## 📊 Verificación 6: Verificar los 3 Estados

### En la Consola del Navegador

Abre la consola y ejecuta (si tienes acceso al servicio):

```javascript
// Nota: Esto requiere acceso al servicio desde la consola
// La mejor forma es agregar logs temporales en el código
```

**Mejor forma:** Revisa los logs cuando interactúas con el carrito:

1. **CartState** - Se actualiza cuando agregas/eliminas productos
2. **CartUIState** - Se actualiza cuando hay loading/errores
3. **CartSummaryState** - Se actualiza automáticamente cuando cambia el carrito

---

## 🎯 Checklist de Verificación

Marca cada uno cuando lo verifiques:

- [ ] ✅ `package.json` NO tiene `@ngrx`
- [ ] ✅ `package.json` SÍ tiene `rxjs`
- [ ] ✅ `cart-state.service.ts` usa `BehaviorSubject`
- [ ] ✅ `cart.service.ts` usa `CartStateService`
- [ ] ✅ Consola muestra logs de inicialización
- [ ] ✅ Al agregar producto, aparecen logs en consola
- [ ] ✅ Los componentes se actualizan automáticamente
- [ ] ✅ localStorage guarda el carrito
- [ ] ✅ Al recargar, el carrito se mantiene
- [ ] ✅ Múltiples componentes muestran el mismo estado

---

## 🐛 Si Algo No Funciona

### Problema: No veo logs en consola

**Solución:**

1. Verifica que la consola no tenga filtros activos
2. Limpia la consola (botón de limpiar)
3. Recarga la página
4. Verifica que los `console.log` estén en el código

### Problema: Los componentes no se actualizan

**Solución:**

1. Verifica que los componentes estén suscritos a los observables
2. Verifica que no haya errores en la consola
3. Verifica que `CartStateService` esté inyectado correctamente

### Problema: localStorage no guarda

**Solución:**

1. Verifica que no estés en modo incógnito
2. Verifica permisos del navegador
3. Revisa la consola por errores de localStorage

---

## 📝 Logs que Deberías Ver

### Al Iniciar la Aplicación:

```
🛒 CartStateService inicializado
📂 === CARGANDO DESDE LOCALSTORAGE ===
🛒 CarritoService inicializado (usando CartStateService)
```

### Al Agregar un Producto:

```
🛒 === AGREGANDO AL CARRITO ===
🛒 Producto recibido: {...}
🔄 === ACTUALIZANDO CARRITO ===
💾 Guardando en localStorage
💰 Resumen actualizado: { subtotal: 100, tax: 16, total: 116 }
```

### Al Eliminar un Producto:

```
🛒 Eliminando producto: {...}
🔄 === ACTUALIZANDO CARRITO ===
💾 Guardando en localStorage
💰 Resumen actualizado: { subtotal: 0, tax: 0, total: 0 }
```

---

## ✅ Conclusión

Si todos los checks pasan, **¡tu implementación con BehaviorSubject + RxJS está funcionando correctamente!**

Los estados están:

- ✅ Comunicados entre componentes
- ✅ Persistiendo en localStorage
- ✅ Actualizándose automáticamente
- ✅ Funcionando reactivamente
