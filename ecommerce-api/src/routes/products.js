import express from 'express';
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { protect, authorize } from '../middleware/auth.js';
import { validateProduct } from '../middleware/validation.js';

const router = express.Router();
// Rutas públicas
router.get('/', getProducts); // GET /api/products
router.get('/:id', getProduct); // GET /api/products/:id

// Rutas protegidas (solo admin)
router.post('/', protect, authorize('admin'), validateProduct, createProduct); // POST /api/products
router.put('/:id', protect, authorize('admin'), validateProduct, updateProduct); // PUT /api/products/:id
router.delete('/:id', protect, authorize('admin'), deleteProduct); // DELETE /api/products/:id

export default router;