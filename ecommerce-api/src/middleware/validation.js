import { body, validationResult } from 'express-validator';

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

// Validation rules for user registration
const validateRegistration = [
  body('name')
    .trim()
    .isLength({ min: 2 })
    .withMessage('El nombre debe tener al menos 2 caracteres'),
  body('email')
    .isEmail()
    .withMessage('Proporcione un correo electrónico válido'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres'),
  handleValidationErrors
];

// Validation rules for user login
const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Proporcione un correo electrónico válido'),
  body('password')
    .exists()
    .withMessage('La contraseña es requerida'),
  handleValidationErrors
];

// Validation rules for product creation
const validateProduct = [
  body('title')
    .trim()
    .isLength({ min: 3 })
    .withMessage('El título debe tener al menos 3 caracteres'),
  body('description')
    .trim()
    .isLength({ min: 10 })
    .withMessage('La descripción debe tener al menos 10 caracteres'),
  body('price')
    .isFloat({ min: 0 })
    .withMessage('El precio debe ser un número positivo'),
  body('category')
    .isMongoId()
    .withMessage('Proporcione una identificación de categoría válida'),
  body('instructor')
    .trim()
    .isLength({ min: 2 })
    .withMessage('El nombre del instructor debe tener al menos 2 caracteres'),
  body('duration')
    .isInt({ min: 1 })
    .withMessage('La duración debe ser de al menos 1 hora'),
  body('level')
    .isIn(['principiante', 'intermedio', 'avanzado'])
    .withMessage('El nivel debe ser principiante, intermedio o avanzado'),
  handleValidationErrors
];

export {
  validateRegistration,
  validateLogin,
  validateProduct,
  handleValidationErrors
};