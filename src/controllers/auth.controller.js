import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer'; // Asegúrate de tenerlo instalado: npm install nodemailer
import User from '../models/User.js';

// 1. REGISTRO
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'El correo ya está registrado' });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            role: 'user'
        });

        await newUser.save();
        res.status(201).json({ message: 'Usuario creado con éxito' });
    } catch (error) {
        console.error('[REGISTER ERROR]', error);
        res.status(500).json({ message: 'Error al registrar el usuario' });
    }
};

// 2. LOGIN
export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Credenciales inválidas' });

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return res.status(401).json({ message: 'Credenciales inválidas' });

        const token = jwt.sign(
            { uid: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '1h' }
        );

        res.json({
            token,
            user: { email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
};

// 3. OBTENER USUARIOS (GET)
export const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener usuarios" });
    }
};

// 4. ACTUALIZAR USUARIO (PUT)
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, role } = req.body;
        const updatedUser = await User.findByIdAndUpdate(
            id, 
            { username, role }, 
            { new: true }
        ).select('-password');

        if (!updatedUser) return res.status(404).json({ message: "Usuario no encontrado" });
        res.status(200).json({ message: "Actualizado con éxito", user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar" });
    }
};

// 5. ELIMINAR USUARIO (DELETE)
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedUser = await User.findByIdAndDelete(id);
        if (!deletedUser) return res.status(404).json({ message: "El usuario no existe" });
        res.status(200).json({ message: "Usuario eliminado" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar" });
    }
};

// 6. RECUPERAR CONTRASEÑA (POST)
export const recoverPassword = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "Correo no encontrado" });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Recuperación de Contraseña',
            text: `Hola ${user.username}, usa este enlace para recuperar tu cuenta: http://localhost:5173/reset-password/${user._id}`
        };

        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: "Correo enviado con éxito" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al enviar el correo" });
    }
};