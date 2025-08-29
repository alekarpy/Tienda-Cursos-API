# Backend para Plataforma de Cursos en Línea

API RESTful para una tienda de cursos en línea construida con **Node.js, Express y MongoDB**.

## Funcionalidades

* Autenticación de usuarios con **JWT**
* Autorización basada en roles (**administrador / cliente**)
* Operaciones **CRUD** para productos (cursos)
* Funcionalidad de carrito de compras
* Gestión de órdenes
* Validación de datos con **express-validator**
* Encriptación de contraseñas con **bcryptjs**
* Paginación para productos y usuarios
* Middleware de manejo de errores

## Endpoints de la API

### Autenticación

* `POST /api/auth/register` - Registrar un nuevo usuario
* `POST /api/auth/login` - Iniciar sesión
* `GET /api/auth/me` - Obtener el usuario actual

### Productos

* `GET /api/products` - Obtener todos los productos (público)
* `GET /api/products/:id` - Obtener un producto por ID (público)
* `POST /api/products` - Crear producto (**solo administrador**)
* `PUT /api/products/:id` - Actualizar producto (**solo administrador**)
* `DELETE /api/products/:id` - Eliminar producto (**solo administrador**)

### Carrito

* `GET /api/cart` - Obtener el carrito del usuario
* `POST /api/cart/add` - Agregar un ítem al carrito
* `PUT /api/cart/:itemId` - Actualizar un ítem del carrito
* `DELETE /api/cart/:itemId` - Eliminar un ítem del carrito
* `DELETE /api/cart` - Vaciar el carrito

### Usuarios

* `GET /api/users` - Obtener todos los usuarios (**solo administrador**)
* `GET /api/users/:id` - Obtener un usuario por ID (**solo administrador**)
* `PUT /api/users/:id` - Actualizar usuario (**solo administrador**)
* `DELETE /api/users/:id` - Eliminar usuario (**solo administrador**)

### Órdenes

* `POST /api/orders` - Crear una nueva orden
* `GET /api/orders` - Obtener las órdenes del usuario
* `GET /api/orders/:id` - Obtener una orden por ID

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:

   ```bash
   npm install
   ```
3. Crear un archivo `.env` con tus variables de entorno
4. Iniciar MongoDB localmente o usar una cadena de conexión en la nube
5. Probar la base de datos con datos iniciales:

   ```bash
   npm run seed
   ```
6. Iniciar el servidor:

   ```bash
   npm run dev
   ```

## Variables de Entorno

* `PORT` - Puerto del servidor (default: 5000)
* `MONGODB_URI` - Cadena de conexión de MongoDB
* `JWT_SECRET` - Clave secreta para JWT
* `JWT_EXPIRE` - Tiempo de expiración de los tokens JWT

## Datos de Prueba

Después de correr `npm run seed`, la base de datos se completará con **categorías, cursos y usuarios de prueba**.

### Usuarios de prueba

| Nombre        | Email                                           | Contraseña  | Rol     |
| ------------- | ----------------------------------------------- | ----------- |---------|
| Admin User    | [admin@example.com](mailto:admin@example.com)   | password123 | admin   |
| Karla Medina  | [karla@example.com](mailto:karla@example.com)   | password123 | cliente |
| Selene Juárez | [selene@example.com](mailto:selene@example.com) | password123 | cliente |

### Cursos de prueba

Algunos ejemplos de cursos disponibles tras ejecutar `npm run seed`:

| Título                                          | Categoría        | Instructor       | Nivel        | Precio |
| ----------------------------------------------- | ---------------- | ---------------- |--------------| ------ |
| Javascript Avanzado: Domínalo Como Un Master    | Desarrollo Web   | Luis Cruz        | avanzado     | 1899   |
| React: Crea Aplicaciones Web de Alto Nivel      | Desarrollo Web   | María Martínez   | principiante | 899    |
| Python Total: Analiza Datos En Tiempo Real      | Ciencia de Datos | Miguel González  | principiante       | 299    |
| Diseño de Interfaces: Aprende con Figma         | Diseño Gráfico   | Emily Carvalho   | principiante       | 1100   |
| Marketing Digital: Aprende con Google Analytics | Marketing        | Roberto Palacios | intermedio   | 299    |

### Ejemplo de uso de token JWT

Después de iniciar sesión, recibirás un token. Úsalo en el encabezado de tus requests protegidos:

```
Authorization: Bearer <TU_TOKEN_AQUI>
```

## Ejemplos de Requests con curl

### 1. Iniciar sesión

```bash
curl -X POST http://localhost:5000/api/auth/login \
-H "Content-Type: application/json" \
-d '{"email": "admin@example.com", "password": "password123"}'
```

### 2. Obtener todos los productos (público)

```bash
curl http://localhost:5000/api/products
```

### 3. Crear un producto (solo admin)

```bash
curl -X POST http://localhost:5000/api/products \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <TU_TOKEN_ADMIN>" \
-d '{
  "title": "Nuevo Curso de Node.js",
  "description": "Aprende Node.js desde cero",
  "price": 1200,
  "instructor": "Carlos Pérez",
  "duration": 20,
  "level": "principiante",
  "category": "Desarrollo Web"
}'
```

### 4. Agregar un producto al carrito (usuario)

```bash
curl -X POST http://localhost:5000/api/cart/add \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <TU_TOKEN_CLIENTE>" \
-d '{"productId": "<ID_DEL_PRODUCTO>", "quantity": 1}'
```

### 5. Crear una orden (usuario)

```bash
curl -X POST http://localhost:5000/api/orders \
-H "Content-Type: application/json" \
-H "Authorization: Bearer <TU_TOKEN_CLIENTE>" \
-d '{"items": [{"productId": "<ID_DEL_PRODUCTO>", "quantity": 1}]}'
```

## Pruebas con Postman

1. Importar la colección de Postman incluida
2. Configurar la URL base: `http://localhost:5000/api`
3. Registrar o iniciar sesión con un usuario de prueba para obtener un **token JWT**
4. Usar el token en el encabezado **Authorization** para acceder a rutas protegidas

## Tecnologías Utilizadas

* **Node.js**
* **Express.js**
* **MongoDB** con **Mongoose**
* **JWT** para autenticación
* **bcryptjs** para hash de contraseñas
* **express-validator** para validación de datos
