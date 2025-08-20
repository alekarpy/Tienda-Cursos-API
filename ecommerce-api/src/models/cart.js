import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    courses: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Course',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
        }
    ],
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;