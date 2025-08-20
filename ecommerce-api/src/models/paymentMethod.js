import mongoose from 'mongoose';

const paymentMethodSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        required: true,
        enum: ['tarjeta_de_credito', 'tarjeta_de_debito', 'paypal', 'transferencia_bancaria'],
    },
    // Para tarjetas de crédito/débito
    cardNumber: {
        type: String,
        required: function () { return ['tarjeta_de_credito', 'tarjeta_de_debito'].includes(this.type); },
        match: [/^\d{13,19}$/, 'El número de tarjeta debe tener entre 13 y 19 dígitos'],
        trim: true,
    },
    cardHolderName: {
        type: String,
        required: function () { return ['tarjeta_de_credito', 'tarjeta_de_debito'].includes(this.type); },
        trim: true,
    },
    expiryDate: {
        type: String,
        required: function () { return ['tarjeta_de_credito', 'tarjeta_de_debito'].includes(this.type); },
        match: [/^(0[1-9]|1[0-2])\/\d{2}$/, 'La fecha de expiración debe tener el formato MM/AA'],
        trim: true,
    },
    // Para PayPal
    paypalEmail: {
        type: String,
        required: function () { return this.type === 'paypal'; },
        match: [/^\S+@\S+\.\S+$/, 'Correo de PayPal inválido'],
        lowercase: true,
        trim: true,
    },
    // Para transferencia bancaria
    bankName: {
        type: String,
        required: function () { return this.type === 'transferencia_bancaria'; },
        trim: true,
    },
    accountNumber: {
        type: String,
        required: function () { return this.type === 'transferencia_bancaria'; },
        match: [/^\d{6,20}$/, 'El número de cuenta debe ser numérico de 6 a 20 dígitos'],
        trim: true,
    },
    isDefault: {
        type: Boolean,
        default: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, { timestamps: true });

// Asegurar que solo haya un método predeterminado por usuario cuando se guarde uno con isDefault=true
paymentMethodSchema.pre('save', async function (next) {
    try {
        if (this.isModified('isDefault') && this.isDefault) {
            await this.constructor.updateMany(
                { user: this.user, _id: { $ne: this._id } },
                { $set: { isDefault: false } }
            );
        }
        next();
    } catch (err) {
        next(err);
    }
});

const PaymentMethod = mongoose.model('PaymentMethod', paymentMethodSchema);

export default PaymentMethod

