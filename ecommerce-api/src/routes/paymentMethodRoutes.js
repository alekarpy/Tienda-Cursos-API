// javascript
import express from "express";
import { authenticateToken } from '../middlewares/auth.js';
import {
    createPaymentMethod,
    getUserPaymentMethods,
    updatePaymentMethod,
    deletePaymentMethod,
    setDefaultPaymentMethod
} from "../controllers/paymentMethodController.js";

const router = express.Router();

// Crear un método de pago
router.post("/", authenticateToken, createPaymentMethod);

// Obtener todos los métodos de pago del usuario autenticado
router.get("/", authenticateToken, getUserPaymentMethods);

// Actualizar un método de pago
router.patch("/:id", authenticateToken, updatePaymentMethod);

// Eliminar un método de pago
router.delete("/:id", authenticateToken, deletePaymentMethod);

// Marcar un método como predeterminado
router.patch("/:id/default", authenticateToken, setDefaultPaymentMethod);

export default router;