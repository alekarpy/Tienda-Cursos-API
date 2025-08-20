// javascript
import express from "express";
import { authenticateToken } from '../middlewares/auth.js';
import {
    createNotification,
    getUserNotifications,
    markAsRead,
    deleteNotification
} from "../controllers/notificationController.js";

const router = express.Router();

// Crear una notificación
router.post("/", authenticateToken, createNotification);

// Obtener todas las notificaciones del usuario autenticado
router.get("/", authenticateToken, getUserNotifications);

// Marcar una notificación como leída
router.patch("/:id/read", authenticateToken, markAsRead);

// Eliminar una notificación
router.delete("/:id", authenticateToken, deleteNotification);

export default router;