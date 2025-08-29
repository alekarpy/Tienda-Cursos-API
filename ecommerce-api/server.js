import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';


// Import routes
import authRoutes from './src/routes/auth.js';
import productRoutes from './src/routes/products.js';
import categoryRoutes from './src/routes/categories.js';
import cartRoutes from './src/routes/cart.js';
import userRoutes from './src/routes/users.js';
import orderRoutes from './src/routes/orders.js';

// Import middleware
import errorHandler from './src/middleware/errorHandler.js';

dotenv.config();

const server = express();
const PORT = process.env.PORT || 5000;

// Middleware
server.use(cors({
    origin: '*', // permite todos los orígenes
    methods: ['GET','POST','PUT','DELETE']
}));

server.use(express.json());

// Routes
server.use('/api/auth', authRoutes);
server.use('/api/products', productRoutes);
server.use('/api/categories', categoryRoutes);
server.use('/api/cart', cartRoutes);
server.use('/api/users', userRoutes);
server.use('/api/orders', orderRoutes);

// Error handling middleware
server.use(errorHandler);

// Connect to MongoDB
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