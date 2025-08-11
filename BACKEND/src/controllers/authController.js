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

const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const User = require('../models/User'); // Modelo Usuario (adaptar a tu DB)

const generateJWT = (user) => {
  // Genera un token JWT con la info mínima necesaria
    return jwt.sign({ id: user._id, rol: user.rol }, process.env.JWT_SECRET, { expiresIn: '24h' });
    };

    // Login normal usuario general
    const loginUser = async (req, res) => {
    const { email, password } = req.body;
    // Aquí debe ir la lógica de buscar usuario, verificar password...
    // Ejemplo simple:
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Usuario no encontrado' });

    // Verificar contraseña (usar bcrypt o similar)
    const isMatch = (password === user.password); // simplificado, usa bcrypt en realidad
    if (!isMatch) return res.status(400).json({ msg: 'Contraseña incorrecta' });

    const token = generateJWT(user);
    res.json({ token, rol: user.rol });
    };

    // Login para estudiante
    const loginEstudiante = async (req, res) => {
    const { email, password } = req.body;
    // Lógica propia para estudiantes, ejemplo:
    const estudiante = await User.findOne({ email, rol: 'estudiante' });
    if (!estudiante) return res.status(400).json({ msg: 'Estudiante no encontrado' });

    // Validar password / código POLI etc.
    const isMatch = (password === estudiante.password); // simplificado
    if (!isMatch) return res.status(400).json({ msg: 'Contraseña incorrecta' });

    const token = generateJWT(estudiante);
    res.json({ token, rol: estudiante.rol });
    };

    // Login con Google
    const googleLogin = async (req, res) => {
    const { idToken } = req.body;
    try {
        // Verifica el token con Google
        const ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        // Busca o crea usuario en base al email recibido
        let user = await User.findOne({ email: payload.email });
        if (!user) {
        user = new User({
            email: payload.email,
            rol: 'administrador', // o rol por defecto que prefieras
            google: true,
            // ... otros datos
        });
        await user.save();
        }

        // Genera token
        const token = generateJWT(user);
        res.json({ token, rol: user.rol });
    } catch (error) {
        console.error('Error en googleLogin:', error);
        res.status(401).json({ msg: 'Token de Google no válido' });
    }
};

module.exports = { loginUser, loginEstudiante, googleLogin };