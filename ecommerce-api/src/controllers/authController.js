// controllers/authController.js
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// 🔥 FUNCIÓN - AGREGAR
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE || '7d'
    });
};

// Registro
const register = async (req, res, next) => {
    try {
        console.log('🔍 Body recibido en registro:', req.body); // ← Agrega para debug

        const { username, email, password, role } = req.body;

        // Validar campos requeridos
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email y contraseña son requeridos"
            });
        }

        // Verificar si el email ya existe
        const emailExists = await User.findOne({ email });
        if (emailExists) {
            return res.status(400).json({
                success: false,
                message: "El email ya está registrado"
            });
        }

        // Verificar si el username ya existe
        const usernameExists = await User.findOne({ username });
        if (usernameExists) {
            return res.status(400).json({
                success: false,
                message: "El nombre de usuario ya está en uso"
            });
        }


        // Crear usuario
        const user = new User({
            username,
            email,
            password,
            role: role || "cliente"
        });

        await user.save();

        const token = generateToken(user._id);

        res.status(201).json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('❌ Error en registro:', error);
        next(error);
    }
};

// Login
const login = async (req, res, next) => {
    try {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/6a71a13e-6f5d-4bf5-a51d-55bfedcbd571',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'login-issue',hypothesisId:'A',location:'authController.js:login',message:'Login iniciado',data:{body:req.body},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
        
        const { username, email, password } = req.body;
        console.log('🔐 [Login] Intentando iniciar sesión:', { username, email: email ? 'proporcionado' : 'no proporcionado' });

        if (!password) {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/6a71a13e-6f5d-4bf5-a51d-55bfedcbd571',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'login-issue',hypothesisId:'B',location:'authController.js:login',message:'Password faltante',data:{},timestamp:Date.now()})}).catch(()=>{});
            // #endregion
            return res.status(400).json({
                success: false,
                message: "Password es requerido"
            });
        }

        // Validar que se proporcionen username y email (ambos son requeridos)
        if (!username || !email) {
            return res.status(400).json({
                success: false,
                message: "Username y email son requeridos"
            });
        }

        // Buscar usuario que tenga AMBOS username y email (deben coincidir exactamente)
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/6a71a13e-6f5d-4bf5-a51d-55bfedcbd571',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'login-issue',hypothesisId:'C',location:'authController.js:login',message:'Buscando usuario en BD',data:{username,email},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
        
        const user = await User.findOne({ username, email }).select('+password');

        if (!user) {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/6a71a13e-6f5d-4bf5-a51d-55bfedcbd571',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'login-issue',hypothesisId:'D',location:'authController.js:login',message:'Usuario no encontrado - username o email incorrectos',data:{username,email},timestamp:Date.now()})}).catch(()=>{});
            // #endregion
            console.log('❌ [Login] Usuario no encontrado con username y email proporcionados');
            return res.status(401).json({
                success: false,
                message: "Credenciales incorrectas"
            });
        }

        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/6a71a13e-6f5d-4bf5-a51d-55bfedcbd571',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'login-issue',hypothesisId:'E',location:'authController.js:login',message:'Usuario encontrado, verificando password',data:{userId:user._id.toString(),hasPassword:!!user.password},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
        console.log('✅ [Login] Usuario encontrado:', user.username || user.email);
        
        const isMatch = await user.correctPassword(password);
        if (!isMatch) {
            // #region agent log
            fetch('http://127.0.0.1:7242/ingest/6a71a13e-6f5d-4bf5-a51d-55bfedcbd571',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'login-issue',hypothesisId:'F',location:'authController.js:login',message:'Password incorrecto',data:{},timestamp:Date.now()})}).catch(()=>{});
            // #endregion
            console.log('❌ [Login] Password incorrecto');
            return res.status(401).json({
                success: false,
                message: "Credenciales incorrectas"
            });
        }

        const token = generateToken(user._id);
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/6a71a13e-6f5d-4bf5-a51d-55bfedcbd571',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'login-issue',hypothesisId:'G',location:'authController.js:login',message:'Login exitoso',data:{userId:user._id.toString(),username:user.username,role:user.role},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
        console.log('✅ [Login] Login exitoso para:', user.username || user.email);

        res.status(200).json({
            success: true,
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/6a71a13e-6f5d-4bf5-a51d-55bfedcbd571',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({sessionId:'debug-session',runId:'login-issue',hypothesisId:'H',location:'authController.js:login:catch',message:'Error en login',data:{error:error.message,stack:error.stack},timestamp:Date.now()})}).catch(()=>{});
        // #endregion
        console.error('❌ [Login] Error:', error);
        next(error);
    }
};


// Endpoint para verificar si un usuario existe
const checkUser = async (req, res, next) => {
    try {
        const { username } = req.body;

        if (!username) {
            return res.status(400).json({
                success: false,
                message: "Username es requerido"
            });
        }

        const userExists = await User.findOne({ username });

        res.status(200).json({
            exists: !!userExists
        });
    } catch (error) {
        next(error);
    }
};

// Obtener usuario logueado
const getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
};

export { register, login, getMe, checkUser };
