import express from 'express';
import { register, login, getMe, checkUser } from '../controllers/authController.js'; // ← Agregar checkUser
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/check-user', checkUser); // ← Agregar esta nueva ruta

export default router;