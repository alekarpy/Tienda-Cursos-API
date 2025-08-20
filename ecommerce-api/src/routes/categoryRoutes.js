import express from "express";
import  {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategory,
    deleteCategory,
    getProductsByCategory,
} from '../controllers/categoryController.js';

const router = express.Router();

router.get('/categories', getCategories);
router.get('/categories/:id', getCategoryById);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);
router.get('/products/category/:category', getProductsByCategory);


export default router;





