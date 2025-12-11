# Cómo Subir Cambios a GitHub desde Cursor

## 📋 Pasos para Subir tu Código

### Paso 1: Verificar el Estado

```bash
git status
```

Esto te muestra qué archivos han cambiado.

---

### Paso 2: Agregar Archivos al Staging

Tienes dos opciones:

#### Opción A: Agregar archivos específicos (Recomendado)

```bash
# Agregar archivos importantes del frontend
git add ecommerce-app/src/app/
git add ecommerce-app/package.json
git add ecommerce-app/*.md

# Agregar archivos importantes del backend
git add ecommerce-api/src/
git add ecommerce-api/package.json
git add ecommerce-api/scripts/
git add ecommerce-api/*.md

# Agregar archivos de configuración
git add .gitignore
```

#### Opción B: Agregar todos los cambios (excepto los ignorados)

```bash
git add .
```

**⚠️ IMPORTANTE:** Esto agregará TODOS los archivos, incluyendo `node_modules` si no están en `.gitignore`.

---

### Paso 3: Hacer Commit

```bash
git commit -m "feat: Implementación de módulo de administración con CRUD completo

- Agregado AdminGuard para proteger rutas de administración
- Implementado CRUD completo para Productos y Categorías
- Agregado sistema de gestión de estado con BehaviorSubject + RxJS
- Creados scripts para gestión de usuarios
- Agregada documentación completa"
```

O un mensaje más simple:

```bash
git commit -m "feat: Módulo de administración y gestión de estado implementados"
```

---

### Paso 4: Subir a GitHub

```bash
git push origin 2025-11-08-p9nx-6d7cb
```

O si quieres subir a la rama principal:

```bash
git push origin main
```

---

## 🚫 Archivos que NO Debes Subir

Asegúrate de que estos archivos estén en `.gitignore`:

- `node_modules/` - Dependencias (se instalan con `npm install`)
- `.angular/cache/` - Cache de Angular
- `dist/` - Archivos compilados
- `.DS_Store` - Archivos del sistema macOS
- `.env` - Variables de entorno (contiene secretos)
- `.idea/`, `.vscode/`, `.cursor/` - Configuraciones del IDE

---

## 📝 Comandos Completos (Copia y Pega)

### Para subir cambios importantes:

```bash
# 1. Ver qué cambió
git status

# 2. Agregar archivos importantes
git add ecommerce-app/src/app/
git add ecommerce-app/package.json
git add ecommerce-app/*.md
git add ecommerce-api/src/
git add ecommerce-api/package.json
git add ecommerce-api/scripts/
git add ecommerce-api/*.md
git add .gitignore

# 3. Hacer commit
git commit -m "feat: Módulo de administración y gestión de estado implementados"

# 4. Subir a GitHub
git push origin 2025-11-08-p9nx-6d7cb
```

---

## 🔍 Verificar Antes de Subir

Antes de hacer push, verifica qué vas a subir:

```bash
# Ver qué archivos están en staging
git status

# Ver los cambios que se van a commitear
git diff --cached
```

---

## ⚠️ Si Algo Sale Mal

### Deshacer cambios en staging:

```bash
git reset
```

### Deshacer el último commit (mantener cambios):

```bash
git reset --soft HEAD~1
```

### Ver el historial de commits:

```bash
git log --oneline
```

---

## ✅ Checklist Antes de Subir

- [ ] Verificar que `.gitignore` esté actualizado
- [ ] No incluir `node_modules/` ni `.env`
- [ ] Revisar qué archivos se van a subir con `git status`
- [ ] Hacer commit con mensaje descriptivo
- [ ] Verificar que el push sea a la rama correcta

---

## 🎯 Resumen Rápido

```bash
git add .
git commit -m "Tu mensaje descriptivo"
git push origin nombre-de-tu-rama
```

¡Listo! 🚀
