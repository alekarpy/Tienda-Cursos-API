import Cart from '../models/cart.js';

// Obtener el carrito del usuario
export async function getCart(req, res) {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('courses.course');
        if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error });
    }
}

// Agregar courseo al carrito
export async function addToCart(req, res) {
    try {
        const { course, quantity } = req.body;
        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = new Cart({ user: req.user._id, courses: [] });
        }

        const itemIndex = cart.courses.findIndex(item => item.course.toString() === course);

        if (itemIndex > -1) {
            cart.courses[itemIndex].quantity += quantity;
        } else {
            cart.courses.push({ course, quantity });
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error });
    }
}

// Actualizar cantidad de un curso
export async function updateCartItem(req, res) {
    try {
        const { course, quantity } = req.body;
        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

        const item = cart.courses.find(item => item.course.toString() === course);
        if (!item) return res.status(404).json({ message: 'Curso no encontrado en el carrito' });

        item.quantity = quantity;
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error });
    }
}

// Eliminar curso del carrito
export async function removeFromCart(req, res) {
    try {
        const { course } = req.body;
        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

        cart.courses = cart.courses.filter(item => item.course.toString() !== course);
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error });
    }
}

// Vaciar el carrito
export async function clearCart(req, res) {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) return res.status(404).json({ message: 'Carrito no encontrado' });

        cart.courses = [];
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ error });
    }
}