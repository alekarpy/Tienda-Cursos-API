import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
} from '../controllers/cartController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/:itemId', updateCartItem);
// IMPORTANTE: La ruta DELETE '/' debe ir ANTES de DELETE '/:itemId' 
// para que Express haga match correctamente con DELETE /api/cart
router.delete('/', clearCart);
router.delete('/:itemId', removeFromCart);

export default router;