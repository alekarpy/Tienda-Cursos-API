import express from 'express';
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  getCategoryProducts,
  validateCategory
} from '../controllers/categoryController.js';
import { protect, authorize  } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getCategories);
router.get('/:id', getCategory);
router.get('/:id/products', getCategoryProducts);
router.post('/', protect, authorize('admin'), validateCategory, createCategory);
router.put('/:id', protect, authorize('admin'), validateCategory, updateCategory);
router.delete('/:id', protect, authorize('admin'), deleteCategory);

export default router;