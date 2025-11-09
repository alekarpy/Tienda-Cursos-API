// javascript
import express from "express";
import { Router } from "express";
import { authenticateToken } from '../middleware/auth.js';
import { logger } from "../middleware/logger.js";
import { getUserProfile, registerUser } from "../controllers/userController.js";

import categoryRoutes from './categoryRoutes.js';
import courseRoutes from './courseRoutes.js';
import orderRoutes from './orderRoutes.js';
import reviewRoutes from './reviewRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import paymentMethodRoutes from './paymentMethodRoutes.js';
import course from "../models/course.js";

const router = express.Router();

// Rutas públicas
router.post('/users/register', logger, registerUser);

// Rutas protegidas
router.get('/users/profile', logger, authenticateToken, getUserProfile);

// Rutas de módulos
router.use('/categories', categoryRoutes);
router.use('/courses', courseRoutes);
router.use('/orders', orderRoutes);
router.use('/reviews', reviewRoutes);
router.use('/notifications', notificationRoutes);
router.use('/payment-methods', paymentMethodRoutes);

export default router;