import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

// --- NUEVA FUNCIÓN: REGISTRO ---
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // 1. Verificar si el usuario ya existe
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'El correo ya está registrado' });
        }

        // 2. Encriptar la contraseña (importante para que el login funcione)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Crear el nuevo usuario (incluyendo el username que pide el front)
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: 'user' // Por defecto
        });

        // 4. Guardar en MongoDB Atlas
        await newUser.save();

        res.status(201).json({ message: 'Usuario creado con éxito' });
    } catch (error) {
        console.error('[REGISTER ERROR]', error);
        res.status(500).json({ message: 'Error al registrar el usuario' });
    }
};

// --- FUNCIÓN EXISTENTE: LOGIN ---
export const login = async (req, res) => {
    const { email, password } = req.body;

    console.log('[LOGIN] email:', email);
    
    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        // bcrypt.compare compara la clave escrita con la encriptada en la BD
        const ok = await bcrypt.compare(password, user.password);
        if (!ok) {
            return res.status(401).json({ message: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { uid: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        );

        res.json({
            token,
            user: {
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
};