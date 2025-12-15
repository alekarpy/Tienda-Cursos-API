import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware para verificar el token JWT y cargar el usuario completo (versión completa)
const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado para acceder a esta ruta'
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Verificar que el usuario existe
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'El usuario no existe'
        });
      }
      
      req.user = user;
      next();
    } catch (error) {
      console.error('JWT Error:', error.message);
      return res.status(401).json({
        success: false,
        message: 'No autorizado para acceder a esta ruta'
      });
    }
  } catch (error) {
    next(error);
  }
};

// Middleware para verificar roles (acepta múltiples roles como argumentos)
const authorize = (...roles) => {
  return (req, res, next) => {
    // Verificar que el usuario está autenticado
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }
    
    // Verificar el rol
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `El Rol de usuario ${req.user.role} no está autorizado a acceder a esta ruta`
      });
    }
    next();
  };
};

// Middleware para verificar roles (acepta un array de roles)
export const verifyRole = (roles) => {
  return (req, res, next) => {
    // Verificar que el usuario está autenticado
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }
    
    // Verificar el rol
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `El Rol de usuario ${req.user.role} no está autorizado a acceder a esta ruta`
      });
    }
    next();
  };
};

// Middleware opcional para verificar rol de admin
export const isAdmin = (req, res, next) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Acceso denegado' });
  }
  next();
};

export { protect, authorize };