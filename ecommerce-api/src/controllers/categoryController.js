import Category from '../models/Category.js';
import { body, validationResult } from 'express-validator';

// Validaciones
export const validateCategory = [
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('El nombre debe tener al menos 2 caracteres'),
  body('description')
    .trim()
    .isLength({ min: 10 })
    .withMessage('La descripción debe tener al menos 10 caracteres'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }
    next();
  }
];

// @desc    Obtener todas las categorías
// @route   GET /api/categories
// @access  Público
export const getCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const categories = await Category.find()
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit);
    
    const total = await Category.countDocuments();
    
    res.status(200).json({
      success: true,
      count: categories.length,
      total,
      pagination: {
        page,
        pages: Math.ceil(total / limit),
        limit
      },
      data: categories
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al obtener categorías',
      error: error.message
    });
  }
};

// @desc    Obtener una categoría por ID
// @route   GET /api/categories/:id
// @access  Público
export const getCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }
    
    res.status(200).json({
      success: true,
      data: category
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de categoría inválido'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error al obtener la categoría',
      error: error.message
    });
  }
};

// @desc    Crear una nueva categoría
// @route   POST /api/categories
// @access  Privado/Admin
export const createCategory = async (req, res) => {
  try {
    const { name, description, imageURL } = req.body;
    
    // Verificar si la categoría ya existe
    const categoryExists = await Category.findOne({ 
      name: { $regex: new RegExp(`^${name}$`, 'i') } 
    });
    
    if (categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe una categoría con ese nombre'
      });
    }
    
    const category = await Category.create({
      name,
      description,
      ...(imageURL && { imageURL })
    });
    
    res.status(201).json({
      success: true,
      message: 'Categoría creada exitosamente',
      data: category
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error al crear categoría',
      error: error.message
    });
  }
};

// @desc    Actualizar una categoría
// @route   PUT /api/categories/:id
// @access  Privado/Admin
export const updateCategory = async (req, res) => {
  try {
    const { name, description, imageURL } = req.body;
    
    // Verificar si el nombre ya existe en otra categoría
    if (name) {
      const categoryExists = await Category.findOne({
        _id: { $ne: req.params.id },
        name: { $regex: new RegExp(`^${name}$`, 'i') }
      });
      
      if (categoryExists) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe otra categoría con ese nombre'
        });
      }
    }
    
    const updateFields = { name, description };
    if (typeof imageURL === 'string' && imageURL.trim() !== '') {
      updateFields.imageURL = imageURL;
    }
    
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      updateFields,
      { new: true, runValidators: true }
    );
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Categoría actualizada exitosamente',
      data: category
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de categoría inválido'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error al actualizar categoría',
      error: error.message
    });
  }
};

// @desc    Eliminar una categoría
// @route   DELETE /api/categories/:id
// @access  Privado/Admin
export const deleteCategory = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }
    
    // Verificar si la categoría tiene productos asociados
    const Product = (await import('../models/Product.js')).default;
    const productsCount = await Product.countDocuments({ category: req.params.id });
    
    if (productsCount > 0) {
      return res.status(400).json({
        success: false,
        message: 'No se puede eliminar la categoría porque tiene productos asociados'
      });
    }
    
    await Category.findByIdAndDelete(req.params.id);
    
    res.status(200).json({
      success: true,
      message: 'Categoría eliminada exitosamente'
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de categoría inválido'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error al eliminar categoría',
      error: error.message
    });
  }
};

// @desc    Obtener productos de una categoría
// @route   GET /api/categories/:id/products
// @access  Público
export const getCategoryProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const category = await Category.findById(req.params.id);
    
    if (!category) {
      return res.status(404).json({
        success: false,
        message: 'Categoría no encontrada'
      });
    }
    
    const Product = (await import('../models/Product.js')).default;
    const products = await Product.find({ category: req.params.id, isActive: true })
      .populate('category', 'name')
      .skip(skip)
      .limit(limit);
    
    const total = await Product.countDocuments({ category: req.params.id, isActive: true });
    
    res.status(200).json({
      success: true,
      data: {
        category: {
          _id: category._id,
          name: category.name,
          description: category.description
        },
        products: {
          count: products.length,
          total,
          pagination: {
            page,
            pages: Math.ceil(total / limit),
            limit
          },
          data: products
        }
      }
    });
  } catch (error) {
    if (error.name === 'CastError') {
      return res.status(400).json({
        success: false,
        message: 'ID de categoría inválido'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error al obtener productos de la categoría',
      error: error.message
    });
  }
};