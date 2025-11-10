// javascript
import express from "express";
import { authenticateToken } from '../middleware/auth.js';
import {
    createOrder,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder
} from "../controllers/orderController.js";

const router = express.Router();

// Crear una orden
router.post("/", authenticateToken, createOrder);

// Obtener todas las órdenes del usuario autenticado
router.get("/", authenticateToken, getUserOrders);

// Obtener una orden por ID
router.get("/:id", authenticateToken, getOrderById);

// Actualizar estado de la orden (solo admin)
router.patch("/:id/status", authenticateToken, updateOrderStatus);

// Eliminar una orden (solo admin)
router.delete("/:id", authenticateToken, deleteOrder);

export default router;