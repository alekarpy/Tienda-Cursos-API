import Order from '../models/order.js';

// Crear una orden
export async function createOrder(req, res) {
    try {
        const { Courses, shippingAddress, paymentMethod, shippingCost, totalPrice } = req.body;
        const order = new Order({
            user: req.user._id,
            Courses,
            shippingAddress,
            paymentMethod,
            shippingCost,
            totalPrice,
        });
        await order.save();
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ error });
    }
}

// Obtener todas las órdenes del usuario autenticado
export async function getUserOrders(req, res) {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('Courses.courseId')
            .populate('shippingAddress')
            .populate('paymentMethod');
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ error });
    }
}

// Obtener una orden por ID
export async function getOrderById(req, res) {
    try {
        const order = await Order.findById(req.params.id)
            .populate('Courses.courseId')
            .populate('shippingAddress')
            .populate('paymentMethod');
        if (!order) return res.status(404).json({ message: 'Orden no encontrada' });
        // Solo el dueño o admin puede ver la orden
        if (order.user.toString() !== req.user._id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Acceso denegado' });
        }
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error });
    }
}

// Actualizar estado de la orden (solo admin)
export async function updateOrderStatus(req, res) {
    try {
        const { status, paymentStatus } = req.body;
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Orden no encontrada' });
        // Verificación de rol admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Solo admin puede actualizar el estado' });
        }
        if (status) order.status = status;
        if (paymentStatus) order.paymentStatus = paymentStatus;
        await order.save();
        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ error });
    }
}

// Eliminar una orden (solo admin)
export async function deleteOrder(req, res) {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: 'Orden no encontrada' });
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Solo admin puede eliminar la orden' });
        }
        await order.deleteOne();
        res.status(200).json({ message: 'Orden eliminada' });
    } catch (error) {
        res.status(500).json({ error });
    }
}