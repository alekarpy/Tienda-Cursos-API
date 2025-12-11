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
router.get('/products/', getProducts);
router.get('product/:id', getProduct);
router.post('product/', protect, authorize('admin'), validateProduct, createProduct);
router.put('product/:id', protect, authorize('admin'), validateProduct, updateProduct);
router.delete('product/:id', protect, authorize('admin'), deleteProduct);

export default router;