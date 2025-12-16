import express from 'express';
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  checkProductInWishlist,
  getWishlistCount
} from '../controllers/wishlistController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Todas las rutas requieren autenticación
router.use(protect);

// GET /api/wishlist - Obtener wishlist del usuario
router.get('/', getWishlist);

// GET /api/wishlist/count - Obtener cantidad de productos en wishlist
router.get('/count', getWishlistCount);

// POST /api/wishlist - Agregar producto a wishlist
router.post('/', addToWishlist);

// GET /api/wishlist/check/:productId - Verificar si un producto está en wishlist
router.get('/check/:productId', checkProductInWishlist);

// DELETE /api/wishlist/:productId - Eliminar producto de wishlist
router.delete('/:productId', removeFromWishlist);

// DELETE /api/wishlist - Limpiar wishlist completa
router.delete('/', clearWishlist);

export default router;

