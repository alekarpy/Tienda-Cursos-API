// models/user.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true,
            match: [/^[a-zA-Z0-9]+$/, "El nombre de usuario debe contener solo letras y números"],
            lowercase: true,
            trim: true,
            minlength: 6,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            match: [/^\S+@\S+\.\S+$/, "Por favor use un email válido"],
            lowercase: true,
            trim: true,
        },

        password: {
            type: String,
            required: true,
            minlength: 6,
            select: false,
        },

        role: {
            type: String,
            enum: ['admin', 'cliente'],
            default: 'cliente',
        }
    },
    { timestamps: true }
);

// Hash automático antes de guardar
userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 12); // ← Aumentar salt rounds a 12
    next();
});

// 🔥 CORREGIR: método correctPassword - solo un parámetro
userSchema.methods.correctPassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;