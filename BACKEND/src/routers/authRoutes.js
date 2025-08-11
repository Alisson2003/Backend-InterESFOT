/* import express from 'express';
import passport from 'passport';
import { loginSuccess, loginFailed } from '../controllers/authController.js';

const router = express.Router();

router.get('/google', passport.authenticate('google', {
    scope: ['profile', 'email']
    }));

    router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/auth/failed'
    }),
    (req, res) => {
        // Redireccionar o mostrar algo en el navegador después del login
        res.redirect('/auth/success');
    }
);

router.get('/success', loginSuccess);
router.get('/failed', loginFailed);

export default router;

*/

import express from 'express';
import { loginUser, loginEstudiante, googleLogin } from '../controllers/authController.js';


const router = express.Router();

// Ruta para login usuario general
router.post('/login', loginUser);

// Ruta para login estudiante (cuando password contiene 'POLI')
router.post('/estudiante/login', loginEstudiante);

// Ruta para login con Google
router.post('/auth/google-login', googleLogin);

module.exports = router;

export default router;