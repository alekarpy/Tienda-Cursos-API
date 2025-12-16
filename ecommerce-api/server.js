import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './src/routes/auth.js';
import productRoutes from './src/routes/products.js';
import categoryRoutes from './src/routes/categories.js';
import cartRoutes from './src/routes/cart.js';
import userRoutes from './src/routes/userRoutes.js';
import orderRoutes from './src/routes/orders.js';
import wishlistRoutes from './src/routes/wishlistRoutes.js';

// Import middleware
import errorHandler from './src/middleware/errorHandler.js';

dotenv.config();

const server = express();
const PORT = process.env.PORT || 3001;

// 🟢 MIDDLEWARES GLOBALES (ANTES de las rutas)
// Configuración de CORS para desarrollo y producción
const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
    : ['http://localhost:4200'];

server.use(cors({
    origin: function (origin, callback) {
        // Permitir requests sin origin (mobile apps, Postman, etc.) solo en desarrollo
        if (!origin) {
            return callback(null, process.env.NODE_ENV !== 'production');
        }
        
        // En producción, solo permitir orígenes específicos
        if (process.env.NODE_ENV === 'production') {
            if (allowedOrigins.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error('Not allowed by CORS'));
            }
        } else {
            // En desarrollo, permitir localhost
            callback(null, true);
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true
}));

server.use(express.json());

// 🟢 RUTAS
server.use('/api/auth', authRoutes);
server.use('/api/products', productRoutes);
server.use('/api/categories', categoryRoutes);
server.use('/api/cart', cartRoutes);
server.use('/api/users', userRoutes);
server.use('/api/orders', orderRoutes);
server.use('/api/wishlist', wishlistRoutes);

// 🟢 MIDDLEWARE DE ERRORES (AL FINAL)
server.use(errorHandler);

// Conexión a Mongo + levantar servidor
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Conectado a MongoDB');
        server.listen(PORT, () => {
            console.log(`El servidor se está ejecutando en el puerto ${PORT}`);
        });
    })
    .catch((error) => {
        console.error('Error de conexión de MongoDB:', error);
    });
