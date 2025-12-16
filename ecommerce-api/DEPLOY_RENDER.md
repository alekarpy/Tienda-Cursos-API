# 🚀 Guía para Desplegar el Backend en Render

Esta guía te ayudará a desplegar tu API backend en Render paso a paso.

## 📋 Requisitos Previos

- ✅ Cuenta en Render (gratis o de pago)
- ✅ Tu código del backend en GitHub
- ✅ MongoDB Atlas (o base de datos MongoDB en la nube)
- ✅ URL de tu frontend desplegado en Render (ej: `https://tu-app.onrender.com`)

---

## 🔧 Paso 1: Preparar el Código

### 1.1 Verificar que el código esté en GitHub

Asegúrate de que tu código está subido a GitHub:

```bash
git add .
git commit -m "Preparar backend para despliegue en Render"
git push origin main
```

---

## 🌐 Paso 2: Crear un Nuevo Web Service en Render

1. **Inicia sesión** en [Render](https://render.com)

2. **Ve al Dashboard** y haz clic en **"New +"** → **"Web Service"**

3. **Conecta tu repositorio**:

   - Selecciona tu repositorio de GitHub
   - Autoriza a Render si es necesario
   - Selecciona la rama (generalmente `main` o `master`)

4. **Configura el servicio**:
   - **Name**: `tienda-cursos-api` (o el nombre que prefieras)
   - **Environment**: `Node`
   - **Region**: Elige la región más cercana a tus usuarios
   - **Branch**: `main` (o la rama que uses)

---

## ⚙️ Paso 3: Configurar el Build y Start

En la sección de configuración, establece:

### Build Command:

```bash
cd ecommerce-api && npm install
```

### Start Command:

```bash
cd ecommerce-api && npm start
```

> **Nota**: Si tu backend está en la raíz del repositorio (no en una subcarpeta), usa simplemente:
>
> - Build: `npm install`
> - Start: `npm start`

---

## 🔐 Paso 4: Configurar Variables de Entorno

En la sección **"Environment Variables"**, agrega las siguientes variables:

### Variables Requeridas:

| Variable          | Descripción                                                                        | Ejemplo                                                                                     |
| ----------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| `PORT`            | Puerto del servidor (Render lo proporciona automáticamente, pero puedes definirlo) | `10000`                                                                                     |
| `MONGODB_URI`     | URL de conexión a MongoDB Atlas                                                    | `mongodb+srv://user:password@cluster.mongodb.net/tienda-cursos?retryWrites=true&w=majority` |
| `JWT_SECRET`      | Clave secreta para JWT (debe ser una cadena larga y aleatoria)                     | `tu_clave_secreta_super_segura_aqui_123456789`                                              |
| `JWT_EXPIRE`      | Tiempo de expiración del token JWT                                                 | `7d`                                                                                        |
| `NODE_ENV`        | Entorno de ejecución                                                               | `production`                                                                                |
| `ALLOWED_ORIGINS` | Orígenes permitidos para CORS (separados por comas)                                | `https://tu-app.onrender.com,http://localhost:4200`                                         |

### ⚠️ Importante sobre ALLOWED_ORIGINS:

Agrega **tanto** la URL de producción de tu frontend **como** `http://localhost:4200` para desarrollo:

```
https://tu-app-frontend.onrender.com,http://localhost:4200
```

> **Ejemplo completo**:
>
> ```
> ALLOWED_ORIGINS=https://mi-tienda-cursos.onrender.com,http://localhost:4200
> ```

---

## 📦 Paso 5: Configurar MongoDB Atlas

Si aún no tienes MongoDB Atlas configurado:

1. Ve a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Crea una cuenta o inicia sesión
3. Crea un nuevo cluster (usa el tier gratuito para empezar)
4. Crea un usuario de base de datos
5. En "Network Access", agrega `0.0.0.0/0` para permitir conexiones desde cualquier IP (o la IP de Render)
6. Obtén tu connection string: `mongodb+srv://usuario:password@cluster.mongodb.net/tienda-cursos?retryWrites=true&w=majority`
7. Úsalo como valor de `MONGODB_URI` en Render

---

## 🚀 Paso 6: Desplegar

1. Haz clic en **"Create Web Service"**
2. Render comenzará a construir y desplegar tu aplicación
3. Observa los logs en tiempo real para ver el progreso

### ⏱️ Primera vez

El primer despliegue puede tomar 5-10 minutos. Render está:

- Instalando dependencias
- Construyendo la aplicación
- Iniciando el servidor

---

## ✅ Paso 7: Verificar el Despliegue

Una vez que el despliegue esté completo:

1. **Obtén la URL** de tu API (algo como: `https://tienda-cursos-api.onrender.com`)

2. **Prueba el endpoint de salud** (si tienes uno):

   ```bash
   curl https://tienda-cursos-api.onrender.com/api/products
   ```

3. **Verifica los logs** en Render Dashboard para asegurarte de que no hay errores

---

## 🔄 Sincronización con GitHub

### ✅ Sí, Render se actualiza automáticamente

**Render está conectado a tu repositorio de GitHub** y se actualiza automáticamente cuando haces push:

1. **Haces cambios** en tu código local
2. **Haces commit y push** a GitHub:
   ```bash
   git add .
   git commit -m "Descripción de los cambios"
   git push origin main
   ```
3. **Render detecta automáticamente** el nuevo commit
4. **Render despliega automáticamente** la nueva versión

### ⏱️ Tiempo de despliegue

- **Builds manuales**: Puedes activar despliegues manuales desde el Dashboard
- **Auto-deploy**: Está activado por defecto, se despliega en cada push a la rama principal

---

## 🔧 Actualizar Variables de Entorno

Si necesitas cambiar las variables de entorno:

1. Ve al Dashboard de Render
2. Selecciona tu servicio
3. Ve a **"Environment"**
4. Edita las variables
5. Guarda los cambios
6. Render **reiniciará automáticamente** el servicio con las nuevas variables

---

## 📝 Actualizar el Frontend para Usar el Backend en Producción

Después de desplegar el backend, necesitas actualizar la configuración de tu frontend Angular para que apunte a la URL de producción del backend.

En tu proyecto Angular, actualiza `src/environments/environment.ts`:

```typescript
export const environment = {
  production: true,
  apiUrl: "https://tienda-cursos-api.onrender.com/api",
};
```

Y en `src/environments/environment.ts` (desarrollo):

```typescript
export const environment = {
  production: false,
  apiUrl: "http://localhost:3001/api",
};
```

---

## 🐛 Solución de Problemas Comunes

### ❌ Error: "Cannot connect to MongoDB"

- Verifica que `MONGODB_URI` esté correctamente configurada
- Asegúrate de que la IP `0.0.0.0/0` esté permitida en MongoDB Atlas
- Verifica que el usuario y contraseña sean correctos

### ❌ Error: "CORS error"

- Verifica que `ALLOWED_ORIGINS` incluya la URL exacta de tu frontend
- Asegúrate de que no haya espacios extras en `ALLOWED_ORIGINS`
- La URL debe incluir el protocolo (`https://`)

### ❌ Error: "Port already in use"

- Render proporciona automáticamente el puerto en `process.env.PORT`
- Asegúrate de que tu código use `process.env.PORT || 3001`

### ❌ El servicio se queda "sleeping"

- Render pone los servicios gratuitos en "sleep" después de 15 minutos de inactividad
- El primer request después del sleep puede tardar ~30 segundos
- Considera usar un servicio de "ping" para mantener el servicio activo

---

## 💡 Tips Adicionales

1. **Logs en tiempo real**: Usa el Dashboard de Render para ver logs en tiempo real
2. **Métricas**: Render proporciona métricas básicas de uso
3. **Dominio personalizado**: Puedes configurar un dominio personalizado en Render
4. **Variables de entorno sensibles**: Nunca commitees `.env` a GitHub, usa las variables de Render

---

## 📚 Recursos Útiles

- [Documentación de Render](https://render.com/docs)
- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [Render Status Page](https://status.render.com/)

---

¡Listo! Tu backend debería estar funcionando en Render. 🎉
