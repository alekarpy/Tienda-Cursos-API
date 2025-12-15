# Comandos Git para Subir a GitHub

## 🚀 Comandos Rápidos (Copia y Pega)

### 1. Ver qué archivos están listos para commit:

```bash
git status
```

### 2. Hacer commit de todos los cambios:

```bash
git commit -m "feat: Implementación completa de módulo de administración

- Agregado AdminGuard para proteger rutas de administración
- Implementado CRUD completo para Productos y Categorías  
- Agregado sistema de gestión de estado con BehaviorSubject + RxJS
- Creados scripts para gestión de usuarios en BD
- Agregada documentación completa del proyecto"
```

### 3. Subir a GitHub:

```bash
git push origin 2025-11-08-p9nx-6d7cb
```

---

## 📋 Comandos Completos en Orden

```bash
# 1. Ver estado actual
git status

# 2. Ver qué se va a commitear
git diff --cached

# 3. Hacer commit
git commit -m "feat: Módulo de administración y gestión de estado"

# 4. Subir a GitHub
git push origin 2025-11-08-p9nx-6d7cb
```

---

## ✅ Verificación

Después del push, puedes verificar en GitHub:
- Ve a: https://github.com/alekarpy/Tienda-Cursos-API
- Verifica que los cambios estén en la rama `2025-11-08-p9nx-6d7cb`

---

## 🔄 Si Necesitas Actualizar

Si ya hiciste push y quieres agregar más cambios:

```bash
# Agregar nuevos cambios
git add .

# Commit
git commit -m "feat: Nuevos cambios"

# Push
git push origin 2025-11-08-p9nx-6d7cb
```




