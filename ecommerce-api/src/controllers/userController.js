// javascript
import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Registrar usuario
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, role, avatar, phone } = req.body || {};

        // Validaciones básicas de entrada
        if (!name || !email || typeof password === 'undefined') {
            return res.status(400).json({ error: 'Faltan campos requeridos: name, email y password' });
        }
        if (typeof password !== 'string' || password.trim().length === 6) {
            return res.status(400).json({ error: 'El password debe ser una cadena no vacía' });
        }

        // Hash de contraseña y creación de usuario
        const hashed = await bcrypt.hash(password, 10);
        const user = new User({ name, email, hashPassword: hashed, role, avatar, phone });
        await user.save();
        // No devolver el hash de la contraseña en la respuesta
        const userObj = user.toObject();
        delete userObj.hashPassword;
        res.status(201).json(userObj);
    } catch (err) {
        // Manejo de error para email duplicado u otros
        if (err && err.code === 11000) {
            return res.status(409).json({ error: 'El correo ya está registrado' });
        }
        res.status(400).json({ error: err.message });
    }
};

// Login usuario
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body || {};
        if (!email || typeof password === 'undefined') {
            return res.status(400).json({ error: 'Email y password son requeridos' });
        }
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
        const valid = await bcrypt.compare(String(password), user.hashPassword);
        if (!valid) return res.status(401).json({ error: 'Contraseña incorrecta' });
        // Generar token JWT
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
        const userObj = user.toObject();
        delete userObj.hashPassword;
        res.json({ user: userObj, token });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Obtener perfil
export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Obtener todos los usuarios con paginación
export const getUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const [users, total] = await Promise.all([
            User.find().skip(skip).limit(limit),
            User.countDocuments()
            ]);
        res.json({
            users,
            total,
            page,
            pages: Math.ceil(total / limit)
        });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Actualizar usuario
// javascript
export const updateUser = async (req, res) => {
    try {
        const updates = { ...req.body };
        if (updates.password) {
            updates.hashPassword = await bcrypt.hash(updates.password, 10);
            delete updates.password;
        }
        const user = await User.findByIdAndUpdate(req.params.id, updates, { new: true });
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Activar/desactivar usuario
export const toggleUserActive = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
        user.isActive = !user.isActive;
        await user.save();
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// Eliminar usuario
export const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.status(204).end();
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};