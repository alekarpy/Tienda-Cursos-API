import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';

// Get user's wishlist
const getWishlist = async (req, res, next) => {
  try {
    // Usar req.user._id o req.user.id (Mongoose expone ambos)
    const userId = req.user._id || req.user.id;
    
    let wishlist = await Wishlist.findOne({ user: userId })
      .populate({
        path: 'products',
        populate: {
          path: 'category',
          select: 'name'
        }
      });

    if (!wishlist) {
      // Create empty wishlist if it doesn't exist
      wishlist = await Wishlist.create({ user: userId, products: [] });
      console.log('📋 [WishlistController] Wishlist vacía creada para usuario:', userId);
    } else {
      // Debug: verificar que los productos estén populados
      if (wishlist.products && wishlist.products.length > 0) {
        console.log('📋 [WishlistController] Primer producto en wishlist:', JSON.stringify(wishlist.products[0], null, 2));
        console.log('📋 [WishlistController] Categoría del primer producto:', wishlist.products[0].category);
        console.log('📋 [WishlistController] Tipo de categoría:', typeof wishlist.products[0].category);
      } else {
        console.log('📋 [WishlistController] Wishlist encontrada pero vacía');
      }
    }
    
    console.log('📋 [WishlistController] Wishlist a enviar:', {
      _id: wishlist._id,
      user: wishlist.user,
      productsCount: wishlist.products?.length || 0
    });

    res.status(200).json({
      success: true,
      data: wishlist
    });
  } catch (error) {
    console.error('Error en getWishlist:', error);
    next(error);
  }
};

// Add product to wishlist
const addToWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;

    console.log('💝 [WishlistController] addToWishlist - productId:', productId);
    console.log('💝 [WishlistController] addToWishlist - req.user:', req.user ? 'exists' : 'null');
    console.log('💝 [WishlistController] addToWishlist - req.user.id:', req.user?.id);
    console.log('💝 [WishlistController] addToWishlist - req.user._id:', req.user?._id);

    if (!productId) {
      return res.status(400).json({
        success: false,
        message: 'ID de producto requerido'
      });
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    // Usar req.user._id o req.user.id (Mongoose expone ambos)
    const userId = req.user._id || req.user.id;
    
    if (!userId) {
      console.error('💝 [WishlistController] Error: userId no disponible');
      return res.status(401).json({
        success: false,
        message: 'ID de usuario no disponible'
      });
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      console.error('💝 [WishlistController] Producto no encontrado:', productId);
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado'
      });
    }

    let wishlist = await Wishlist.findOne({ user: userId });

    // If wishlist doesn't exist, create one
    if (!wishlist) {
      wishlist = new Wishlist({
        user: userId,
        products: []
      });
    }

    // Check if product is already in wishlist
    const productExists = wishlist.products.some(
      p => p.toString() === productId
    );

    if (productExists) {
      return res.status(400).json({
        success: false,
        message: 'El producto ya está en la lista de deseos'
      });
    }

    // Add product to wishlist
    wishlist.products.push(productId);
    await wishlist.save();

    // Populate products and category before sending response
    await wishlist.populate({
      path: 'products',
      populate: {
        path: 'category',
        select: 'name'
      }
    });

    console.log('💝 [WishlistController] Producto agregado exitosamente a wishlist');
    res.status(200).json({
      success: true,
      message: 'Producto agregado a la lista de deseos',
      data: wishlist
    });
  } catch (error) {
    console.error('💝 [WishlistController] Error en addToWishlist:', error);
    console.error('💝 [WishlistController] Error stack:', error.stack);
    next(error);
  }
};

// Remove product from wishlist
const removeFromWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    // Usar req.user._id o req.user.id (Mongoose expone ambos)
    const userId = req.user._id || req.user.id;
    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Lista de deseos no encontrada'
      });
    }

    // Check if product exists in wishlist
    const productIndex = wishlist.products.findIndex(
      p => p.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Producto no encontrado en la lista de deseos'
      });
    }

    // Remove product from wishlist
    wishlist.products.splice(productIndex, 1);
    await wishlist.save();

    // Populate products and category before sending response
    await wishlist.populate({
      path: 'products',
      populate: {
        path: 'category',
        select: 'name'
      }
    });

    res.status(200).json({
      success: true,
      message: 'Producto eliminado de la lista de deseos',
      data: wishlist
    });
  } catch (error) {
    next(error);
  }
};

// Clear wishlist
const clearWishlist = async (req, res, next) => {
  try {
    // Usar req.user._id o req.user.id (Mongoose expone ambos)
    const userId = req.user._id || req.user.id;
    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: 'Lista de deseos no encontrada'
      });
    }

    // Clear all products
    wishlist.products = [];
    await wishlist.save();

    res.status(200).json({
      success: true,
      message: 'Lista de deseos vaciada',
      data: wishlist
    });
  } catch (error) {
    next(error);
  }
};

// Check if product is in wishlist
const checkProductInWishlist = async (req, res, next) => {
  try {
    const { productId } = req.params;

    // Usar req.user._id o req.user.id (Mongoose expone ambos)
    const userId = req.user._id || req.user.id;
    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        data: {
          isInWishlist: false
        }
      });
    }

    const isInWishlist = wishlist.products.some(
      p => p.toString() === productId
    );

    res.status(200).json({
      success: true,
      data: {
        isInWishlist
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get wishlist count
const getWishlistCount = async (req, res, next) => {
  try {
    // Usar req.user._id o req.user.id (Mongoose expone ambos)
    const userId = req.user._id || req.user.id;
    let wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.status(200).json({
        success: true,
        data: {
          count: 0
        }
      });
    }

    res.status(200).json({
      success: true,
      data: {
        count: wishlist.products.length
      }
    });
  } catch (error) {
    next(error);
  }
};

export {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  checkProductInWishlist,
  getWishlistCount
};

