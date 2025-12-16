import Order from '../models/Order.js';
import Cart from '../models/Cart.js';

// Create new order
const createOrder = async (req, res, next) => {
  try {
    const { paymentMethod } = req.body;
    
    // Get user's cart
    const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
    
    console.log('📦 [OrderController] Carrito obtenido:', {
      userId: req.user.id,
      itemsCount: cart?.items?.length || 0,
      items: cart?.items?.map(item => ({
        productId: item.product?._id || item.product,
        productName: item.product?.title || item.product?.nombre || 'N/A',
        quantity: item.quantity,
        price: item.price
      })) || [],
      total: cart?.total || 0
    });
    
    if (!cart || cart.items.length === 0) {
      console.error('❌ [OrderController] Carrito vacío o no encontrado');
      return res.status(400).json({
        success: false,
        message: 'No hay artículos en el carrito'
      });
    }
    
    // Mapear items del carrito a items de la orden
    const orderItems = cart.items.map(item => {
      const orderItem = {
        product: item.product._id || item.product,
        quantity: item.quantity,
        price: item.price
      };
      console.log('📦 [OrderController] Item mapeado:', {
        productId: orderItem.product,
        productName: item.product?.title || item.product?.nombre || 'N/A',
        quantity: orderItem.quantity,
        price: orderItem.price
      });
      return orderItem;
    });
    
    // Calcular el total desde los items (más confiable que cart.total)
    const calculatedTotal = orderItems.reduce((sum, item) => {
      return sum + (item.price * item.quantity);
    }, 0);
    
    console.log('📦 [OrderController] Creando orden con:', {
      userId: req.user.id,
      itemsCount: orderItems.length,
      cartTotal: cart.total,
      calculatedTotal: calculatedTotal,
      paymentMethod
    });
    
    // Usar el total calculado desde los items (más confiable)
    // Si hay diferencia, usar el calculado
    const orderTotal = calculatedTotal > 0 ? calculatedTotal : cart.total;
    
    // Create order (productos digitales, sin dirección de envío)
    // El estado inicial es "Pendiente" hasta que se confirme el pago
    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      total: orderTotal,
      paymentMethod
      // status: 'Pendiente' por defecto según el modelo
    });
    
    // Populate para ver los datos completos
    const populatedOrder = await Order.findById(order._id)
      .populate('items.product', 'title instructor image price');
    
    console.log('✅ [OrderController] Orden creada exitosamente:', {
      orderId: order._id,
      itemsCount: populatedOrder.items.length,
      items: populatedOrder.items.map(item => ({
        productId: item.product?._id || item.product,
        productName: item.product?.title || item.product?.nombre || 'N/A',
        quantity: item.quantity,
        price: item.price
      })),
      total: populatedOrder.total
    });
    
    // Clear cart
    cart.items = [];
    cart.total = 0;
    await cart.save();
    
    res.status(201).json({
      success: true,
      data: populatedOrder
    });
  } catch (error) {
    console.error('❌ [OrderController] Error al crear orden:', error);
    next(error);
  }
};

// Get user's orders
const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate({
        path: 'items.product',
        select: 'title instructor image price description level students rating',
        populate: {
          path: 'category',
          select: 'name'
        }
      })
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
};

// Get single order
const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('items.product', 'title instructor price');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado'
      });
    }
    
    // Make sure user owns the order or is admin
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No estás autorizado para acceder a esta orden'
      });
    }
    
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
};

// Update order status (solo admin)
const updateOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    
    // Validar que el usuario sea admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Solo los administradores pueden actualizar el estado de las órdenes'
      });
    }
    
    // Validar que el estado sea válido
    const validStatuses = ['Pendiente', 'En Proceso', 'Completado', 'Cancelado'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Estado inválido. Estados válidos: ${validStatuses.join(', ')}`
      });
    }
    
    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    ).populate('items.product', 'title instructor price');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado'
      });
    }
    
    console.log(`✅ [OrderController] Estado de orden ${id} actualizado a: ${status}`);
    
    res.status(200).json({
      success: true,
      message: `Estado de la orden actualizado a: ${status}`,
      data: order
    });
  } catch (error) {
    console.error('❌ [OrderController] Error al actualizar estado de orden:', error);
    next(error);
  }
};

// Confirm payment and update order status to "Completado"
const confirmPayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Buscar la orden
    const order = await Order.findById(id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado'
      });
    }
    
    // Verificar que el usuario sea el dueño de la orden o admin
    if (order.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No estás autorizado para confirmar el pago de esta orden'
      });
    }
    
    // Verificar que la orden esté en estado "Pendiente"
    if (order.status !== 'Pendiente') {
      return res.status(400).json({
        success: false,
        message: `No se puede confirmar el pago. El estado actual de la orden es: ${order.status}`
      });
    }
    
    // Actualizar el estado a "Completado"
    order.status = 'Completado';
    await order.save();
    
    // Populate para devolver datos completos
    const populatedOrder = await Order.findById(order._id)
      .populate('items.product', 'title instructor image price');
    
    console.log(`✅ [OrderController] Pago confirmado para orden ${id}, estado actualizado a: Completado`);
    
    res.status(200).json({
      success: true,
      message: 'Pago confirmado exitosamente. Orden completada.',
      data: populatedOrder
    });
  } catch (error) {
    console.error('❌ [OrderController] Error al confirmar pago:', error);
    next(error);
  }
};

// Delete order (solo admin)
const deleteOrder = async (req, res, next) => {
  try {
    // Validar que el usuario sea admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Solo los administradores pueden eliminar órdenes'
      });
    }
    
    const order = await Order.findByIdAndDelete(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Pedido no encontrado'
      });
    }
    
    console.log(`✅ [OrderController] Orden ${req.params.id} eliminada`);
    
    res.status(200).json({
      success: true,
      message: 'Orden eliminada exitosamente'
    });
  } catch (error) {
    console.error('❌ [OrderController] Error al eliminar orden:', error);
    next(error);
  }
};

export {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  confirmPayment,
  deleteOrder
};