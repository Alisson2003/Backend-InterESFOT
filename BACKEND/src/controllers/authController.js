/*export const loginSuccess = (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Login con Google exitoso',
        user: req.user
    });
    };

    export const loginFailed = (req, res) => {
    res.status(401).json({
        success: false,
        message: 'Fallo el login con Google'
    });
};*/

import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/Usuario.js'; // Importa con .js al final en ESM

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const generateJWT = (user) => {
  // Genera un token JWT con la info mínima necesaria
    return jwt.sign(
        { id: user._id, rol: user.rol },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
    );
    };

    // Login normal usuario general
    export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Usuario no encontrado' });

    const isMatch = (password === user.password); // En producción, usa bcrypt
    if (!isMatch) return res.status(400).json({ msg: 'Contraseña incorrecta' });

    const token = generateJWT(user);
    res.json({ token, rol: user.rol });
    };

    // Login para estudiante
    export const loginEstudiante = async (req, res) => {
    const { email, password } = req.body;

    const estudiante = await User.findOne({ email, rol: 'estudiante' });
    if (!estudiante) return res.status(400).json({ msg: 'Estudiante no encontrado' });

    const isMatch = (password === estudiante.password);
    if (!isMatch) return res.status(400).json({ msg: 'Contraseña incorrecta' });

    const token = generateJWT(estudiante);
    res.json({ token, rol: estudiante.rol });
    };

    // Login con Google
    export const googleLogin = async (req, res) => {
    const { idToken } = req.body;
    try {
        const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        let user = await User.findOne({ email: payload.email });
        if (!user) {
        user = new User({
            email: payload.email,
            rol: 'administrador', // o el rol que quieras
            google: true,
        });
        await user.save();
        }

        const token = generateJWT(user);
        res.json({ token, rol: user.rol });
    } catch (error) {
        console.error('Error en googleLogin:', error);
        res.status(401).json({ msg: 'Token de Google no válido' });
    }
};
