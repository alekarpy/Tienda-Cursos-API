// javascript
import express from "express";
import { authenticateToken } from '../middleware/auth.js';
import {
    createReview,
    getCourseReviews,
    updateReview,
    deleteReview
} from "../controllers/reviewController.js";

const router = express.Router();

// Crear una reseña
router.post("/", authenticateToken, createReview);

// Obtener todas las reseñas de un curso
router.get("/course/:courseId", authenticateToken, getCourseReviews);

// Actualizar una reseña (solo el autor)
router.patch("/:id", authenticateToken, updateReview);

// Eliminar una reseña (autor o admin)
router.delete("/:id", authenticateToken, deleteReview);

export default router;