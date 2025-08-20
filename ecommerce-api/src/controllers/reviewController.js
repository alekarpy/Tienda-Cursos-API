// javascript
import Review from '../models/review.js';

// Crear una reseña
export async function createReview(req, res) {
    try {
        const { course, rating, comment } = req.body;
        const review = new Review({
            user: req.user._id,
            course,
            rating,
            comment,
        });
        await review.save();
        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ error });
    }
}

// Obtener todas las reseñas de un curso
export async function getCourseReviews(req, res) {
    try {
        const reviews = await Review.find({ course: req.params.courseId })
            .populate('user', 'name')
            .populate('course', 'name');
        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ error });
    }
}

// Actualizar una reseña (solo el autor)
export async function updateReview(req, res) {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ message: 'Reseña no encontrada' });
        if (review.user.toString() !== req.user._id) {
            return res.status(403).json({ message: 'No autorizado' });
        }
        const { rating, comment } = req.body;
        if (rating) review.rating = rating;
        if (comment) review.comment = comment;
        await review.save();
        res.status(200).json(review);
    } catch (error) {
        res.status(500).json({ error });
    }
}

// Eliminar una reseña (autor o admin)
export async function deleteReview(req, res) {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) return res.status(404).json({ message: 'Reseña no encontrada' });
        if (review.user.toString() !== req.user._id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'No autorizado' });
        }
        await review.deleteOne();
        res.status(200).json({ message: 'Reseña eliminada' });
    } catch (error) {
        res.status(500).json({ error });
    }
}