import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^\S+@\S+\.\S+$/, "Por favor, utilice una dirección de correo electrónico válida"],
    },
    hashPassword: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['admin', 'cliente', 'invitado'],
        default: 'guest',
    },
    avatar: {
        type: String,
        required: true,
        default: 'https://avatar.iran.liara.run/public/37',
    },
    phone: {
        type: String,
        match: [/^\d{10}$/, "El número de teléfono debe tener 10 dígitos"],
    },
    isActive: {
        type: Boolean,
        default: true,
    },
});

const User = mongoose.model('User', userSchema);

export default User;