import PaymentMethod from '../models/paymentMethod.js';

// Crear método de pago
export async function createPaymentMethod(req, res) {
    try {
        const data = { ...req.body, user: req.user.id };
        const paymentMethod = new PaymentMethod(data);
        await paymentMethod.save();
        res.status(201).json(paymentMethod);
    } catch (error) {
        res.status(500).json({ error });
    }
}

// Obtener todos los métodos de pago del usuario
export async function getUserPaymentMethods(req, res) {
    try {
        const methods = await PaymentMethod.find({ user: req.user.id });
        res.status(200).json(methods);
    } catch (error) {
        res.status(500).json({ error });
    }
}

// Actualizar método de pago
export async function updatePaymentMethod(req, res) {
    try {
        const method = await PaymentMethod.findById(req.params.id);
        if (!method) return res.status(404).json({ message: 'Método no encontrado' });
        if (method.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'No autorizado' });
        }
        Object.assign(method, req.body);
        await method.save();
        res.status(200).json(method);
    } catch (error) {
        res.status(500).json({ error });
    }
}

// Eliminar método de pago
export async function deletePaymentMethod(req, res) {
    try {
        const method = await PaymentMethod.findById(req.params.id);
        if (!method) return res.status(404).json({ message: 'Método no encontrado' });
        if (method.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'No autorizado' });
        }
        await method.deleteOne();
        res.status(200).json({ message: 'Método eliminado' });
    } catch (error) {
        res.status(500).json({ error });
    }
}

// Marcar método como predeterminado
export async function setDefaultPaymentMethod(req, res) {
    try {
        // Desmarcar todos los métodos del usuario
        await PaymentMethod.updateMany(
            { user: req.user.id },
            { $set: { isDefault: false } }
        );
        // Marcar el seleccionado como predeterminado
        const method = await PaymentMethod.findById(req.params.id);
        if (!method) return res.status(404).json({ message: 'Método no encontrado' });
        if (method.user.toString() !== req.user.id) {
            return res.status(403).json({ message: 'No autorizado' });
        }
        method.isDefault = true;
        await method.save();
        res.status(200).json(method);
    } catch (error) {
        res.status(500).json({ error });
    }
}