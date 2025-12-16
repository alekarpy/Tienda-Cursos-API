import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

// Get user's cart
const getCart = async (req, res, next) => {
    try {
        let cart = await Cart.findOne({user: req.user.id}).populate('items.product');

        if (!cart) {
            // Create empty cart if it doesn't exist
            cart = await Cart.create({user: req.user.id, items: [], total: 0});
        }

        res.status(200).json({
            success: true,
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

// Add item to cart
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    
    console.log('🛒 [CartController] Agregando item al carrito:', {
      userId: req.user.id,
      productId: productId,
      quantity: quantity
    });
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      console.error('❌ [CartController] Producto no encontrado:', productId);
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado'
      });
    }
    
    let cart = await Cart.findOne({ user: req.user.id });
    
    console.log('🛒 [CartController] Carrito antes de agregar:', {
      cartExists: !!cart,
      itemsCount: cart?.items?.length || 0,
      items: cart?.items?.map(item => ({
        productId: item.product?.toString(),
        quantity: item.quantity,
        price: item.price
      })) || []
    });
    
    // If cart doesn't exist, create one
    if (!cart) {
      cart = new Cart({
        user: req.user.id,
        items: [],
        total: 0
      });
      console.log('🛒 [CartController] Carrito nuevo creado');
    }
    
    // Check if product is already in cart
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    
    if (itemIndex > -1) {
      // Product exists in cart, update quantity
      console.log('🛒 [CartController] Producto ya existe, actualizando cantidad:', {
        oldQuantity: cart.items[itemIndex].quantity,
        newQuantity: cart.items[itemIndex].quantity + quantity
      });
      cart.items[itemIndex].quantity += quantity;
    } else {
      // Product does not exist in cart, add new item
      console.log('🛒 [CartController] Agregando nuevo producto al carrito:', {
        productName: product.title || product.nombre,
        price: product.price,
        quantity: quantity
      });
      cart.items.push({
        product: productId,
        quantity,
        price: product.price
      });
    }
    
    // Calculate total
    cart.total = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    console.log('🛒 [CartController] Carrito después de agregar:', {
      itemsCount: cart.items.length,
      items: cart.items.map(item => ({
        productId: item.product?.toString(),
        productName: 'N/A', // No populado aquí
        quantity: item.quantity,
        price: item.price,
        itemTotal: item.price * item.quantity
      })),
      total: cart.total
    });
    
    await cart.save();
    
    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('❌ [CartController] Error al agregar item:', error);
    next(error);
  }
};

// Update cart item quantity
const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    
    let cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Carrito no encontrado'
      });
    }
    
    // Find the item in cart
    const itemIndex = cart.items.findIndex(item => item._id.toString() === req.params.itemId);
    
    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Curso no encontrado en el carrito'
      });
    }
    
    // Update quantity
    cart.items[itemIndex].quantity = quantity;
    
    // Recalculate total
    cart.total = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    await cart.save();
    
    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

// Remove item from cart
const removeFromCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Carrito no encontrado'
      });
    }
    
    // Remove item from cart
    cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);
    
    // Recalculate total
    cart.total = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    
    await cart.save();
    
    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

// Clear cart
const clearCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Carrito no encontrado'
      });
    }
    
    // Clear all items
    cart.items = [];
    cart.total = 0;
    
    await cart.save();
    
    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    next(error);
  }
};

export {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart
};