import Notification from '../models/notification.js';

// Crear una notificación
export async function createNotification(req, res) {
    try {
        const { userId, message } = req.body;
        const notification = new Notification({ userId, message });
        await notification.save();
        res.status(201).json(notification);
    } catch (error) {
        res.status(500).json({ error });
    }
}

// Obtener todas las notificaciones del usuario autenticado
export async function getUserNotifications(req, res) {
    try {
        const notifications = await Notification.find({ userId: req.user._id });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error });
    }
}

// Marcar una notificación como leída
export async function markAsRead(req, res) {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) return res.status(404).json({ message: 'Notificación no encontrada' });
        if (notification.userId.toString() !== req.user._id) {
            return res.status(403).json({ message: 'No autorizado' });
        }
        notification.isRead = true;
        await notification.save();
        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({ error });
    }
}

// Eliminar una notificación
export async function deleteNotification(req, res) {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) return res.status(404).json({ message: 'Notificación no encontrada' });
        if (notification.userId.toString() !== req.user._id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'No autorizado' });
        }
        await notification.deleteOne();
        res.status(200).json({ message: 'Notificación eliminada' });
    } catch (error) {
        res.status(500).json({ error });
    }
}