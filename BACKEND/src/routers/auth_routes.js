import express from 'express';
import passport from '../config/passport.js';

const router = express.Router();

// Ruta para iniciar sesión con Google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Ruta de callback
router.get('/google/callback', 
    passport.authenticate('google', { failureRedirect: '/' }),
    (req, res) => {
        // Redirigir al frontend con datos del usuario
        res.redirect(`https://deportpoli.netlify.app/dashboard?user=${encodeURIComponent(JSON.stringify(req.user))}`);
    }
    );

    // Cerrar sesión
    router.get('/logout', (req, res) => {
    req.logout(() => {
        res.redirect('/');
    });
});

export default router;
