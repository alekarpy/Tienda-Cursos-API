import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        products: [
            {
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: {
                    type: Number,
                    required: true,
                    min: 1,
                },
                price: {
                    type: Number,
                    required: true,
                },
            },
        ],
        shippingAddress: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "ShippingAddress",
            required: true,
        },
        paymentMethod: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "PaymentMethod",
            required: true,
        },
        shippingCost: {
            type: Number,
            required: true,
            default: 0,
        },
        totalPrice: {
            type: Number,
            required: true,
        },
        status: {
            type: String,
            enum: ["pendiente", "completado", "cancelado"],
            default: "pendiente",
        },
        paymentStatus: {
            type: String,
            enum: ["pendiente", "pagado", "fallido", "reembolsado"],
            default: "pendiente",
        },
    });

const Order = mongoose.model("Order", orderSchema);


export default Order
