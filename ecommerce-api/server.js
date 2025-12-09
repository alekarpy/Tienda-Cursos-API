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

// Import middleware
import errorHandler from './src/middleware/errorHandler.js';

dotenv.config();

const server = express();
const PORT = process.env.PORT || 3001;

// 🟢 MIDDLEWARES GLOBALES (ANTES de las rutas)
server.use(cors({
    origin: 'http://localhost:4200',  // tu app de Angular
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
