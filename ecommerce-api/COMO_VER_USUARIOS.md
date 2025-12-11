# Cómo Ver Usuarios en la Base de Datos

## 📋 Métodos Disponibles

### Método 1: Script Node.js (Recomendado) ⭐

He creado un script que puedes ejecutar directamente desde la terminal.

#### Ver todos los usuarios:

```bash
cd ecommerce-api
npm run view-users
```

O directamente:

```bash
node scripts/view-users.js
```

**Salida esperada:**

```
🔌 Conectando a MongoDB...
✅ Conectado a MongoDB

📊 ===== USUARIOS REGISTRADOS =====

Total de usuarios: 3

--- Usuario 1 ---
ID: 507f1f77bcf86cd799439011
Username: juan123
Email: juan@ejemplo.com
Rol: cliente
Creado: 15/1/2025, 10:30:00

--- Usuario 2 ---
ID: 507f1f77bcf86cd799439012
Username: admin
Email: admin@ejemplo.com
Rol: admin
Creado: 15/1/2025, 10:35:00

📈 ===== RESUMEN POR ROLES =====
cliente: 2 usuario(s)
admin: 1 usuario(s)

✅ Conexión cerrada
```

---

### Método 2: Actualizar Rol de Usuario a Administrador

Si necesitas convertir un usuario a administrador:

```bash
npm run update-role <email|username> [role]
```

**Ejemplos:**

```bash
# Convertir usuario a admin por email
npm run update-role admin@ejemplo.com admin

# Convertir usuario a admin por username
npm run update-role juan123 admin

# Cambiar rol a cliente
npm run update-role admin@ejemplo.com cliente
```

O directamente:

```bash
node scripts/update-user-role.js admin@ejemplo.com admin
```

**Salida esperada:**

```
🔌 Conectando a MongoDB...
✅ Conectado a MongoDB

👤 Usuario encontrado:
   ID: 507f1f77bcf86cd799439011
   Username: juan123
   Email: juan@ejemplo.com
   Rol actual: cliente
   Nuevo rol: admin

✅ Rol actualizado exitosamente a: admin
✅ Conexión cerrada
```

---

### Método 3: Usar el Endpoint de la API (Requiere ser Admin)

Si ya tienes un usuario administrador, puedes usar el endpoint:

```bash
# Obtener todos los usuarios (requiere token de admin)
curl -X GET http://localhost:3001/api/users \
  -H "Authorization: Bearer TU_TOKEN_AQUI"
```

O desde el frontend (si estás logueado como admin):

```typescript
// En el navegador (consola)
fetch("http://localhost:3001/api/users", {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
})
  .then((res) => res.json())
  .then((data) => console.log(data));
```

---

### Método 4: MongoDB Compass (GUI)

Si tienes MongoDB Compass instalado:

1. **Abre MongoDB Compass**
2. **Conecta a tu base de datos** usando la URI de `.env`:
   ```
   mongodb+srv://usuario:password@cursosenlinea.vzbb9eg.mongodb.net/
   ```
3. **Navega a la colección `users`**
4. **Verás todos los usuarios** en formato JSON

---

### Método 5: MongoDB Shell (mongosh)

Si tienes acceso a MongoDB Shell:

```javascript
// Conectar
mongosh "mongodb+srv://usuario:password@cursosenlinea.vzbb9eg.mongodb.net/"

// Ver usuarios
db.users.find().pretty()

// Ver solo emails y roles
db.users.find({}, {email: 1, username: 1, role: 1, _id: 0})

// Contar usuarios por rol
db.users.aggregate([
  { $group: { _id: "$role", count: { $sum: 1 } } }
])

// Actualizar rol de un usuario
db.users.updateOne(
  { email: "admin@ejemplo.com" },
  { $set: { role: "admin" } }
)
```

---

## 🚀 Uso Rápido

### Ver usuarios ahora:

```bash
cd ecommerce-api
npm run view-users
```

### Convertir usuario a admin:

```bash
npm run update-role tu-email@ejemplo.com admin
```

---

## 📝 Notas Importantes

1. **Variables de entorno**: Asegúrate de que tu archivo `.env` tenga `MONGODB_URI` configurado correctamente.

2. **Roles disponibles**:

   - `admin` - Administrador (acceso completo)
   - `cliente` - Cliente (usuario normal)

3. **Seguridad**: Los scripts NO muestran contraseñas por seguridad.

4. **Primer administrador**: Si no tienes ningún admin, puedes:
   - Usar el script `update-user-role.js` para convertir un usuario existente
   - O crear un usuario nuevo y luego actualizar su rol

---

## 🔧 Solución de Problemas

### Error: "Cannot find module"

```bash
# Asegúrate de estar en el directorio correcto
cd ecommerce-api

# Instala dependencias si es necesario
npm install
```

### Error: "MongoDB connection failed"

- Verifica que tu archivo `.env` tenga `MONGODB_URI` correcto
- Verifica que MongoDB esté accesible
- Verifica que las credenciales sean correctas

### No veo usuarios

- Verifica que hayas registrado usuarios en la aplicación
- Verifica que estés conectado a la base de datos correcta
- Ejecuta el script de seed si es necesario: `npm run seed`

---

## ✅ Checklist

- [ ] Script `view-users.js` creado
- [ ] Script `update-user-role.js` creado
- [ ] Scripts agregados a `package.json`
- [ ] Variables de entorno configuradas
- [ ] Puedes ejecutar `npm run view-users`
- [ ] Puedes ejecutar `npm run update-role`

---

¡Listo! Ahora puedes ver y gestionar usuarios fácilmente desde Cursor. 🎉
