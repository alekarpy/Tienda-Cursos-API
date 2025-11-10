// javascript
import express from 'express';
import { authenticateToken, verifyRole } from '../middleware/auth.js';
import { logger } from '../middleware/logger.js';
import {
    registerUser,
    loginUser,
    getUserProfile,
    updateUser,
    toggleUserActive,
    deleteUser
} from '../controllers/userController.js';

const router = express.Router();

// Ruta pública: obtener usuarios
router.get('/users', logger, getUserProfile);

// Ruta pública: login
router.post('/login', logger, loginUser);

// Ruta protegida: registrar usuario (solo admin)
router.post('/users', logger, authenticateToken, verifyRole(['admin']), registerUser);

// Ruta protegida: actualizar usuario (admin y editor)
router.put('/users/:id', logger, authenticateToken, verifyRole(['admin']), updateUser);

// Ruta protegida: activar/desactivar usuario (solo admin)
router.patch('/users/:id/toggle', logger, authenticateToken, verifyRole(['admin']), toggleUserActive);

// Ruta protegida: eliminar usuario (solo admin)
router.delete('/users/:id', logger, authenticateToken, verifyRole(['admin']), deleteUser);

export default router;