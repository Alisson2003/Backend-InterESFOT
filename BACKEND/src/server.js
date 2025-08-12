import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import routerAdministrador from './routers/administrador_routes.js';

//Estudiante
import cloudinary from 'cloudinary'
import fileUpload from "express-fileupload"
import routerEstudiante from './routers/estudiante_routes.js';

//Deportes
import routerDeportes from './routers/deportes_routes.js';

//Login con Google
import session from 'express-session';
import passport from './config/passport.js';
import authRoutes from './routes/auth_routes.js';

dotenv.config();

// Inicializaciones
const app = express();

// Configurar sesiones
app.use(cors({
    origin: "https://deportpoli.netlify.app",
    credentials: true
}));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

// Inicializar passport
app.use(passport.initialize());
app.use(passport.session());


//module.exports = app;

// Configuraciones 
app.use(cors()); // Permitir solicitudes desde cualquier origen


// Middlewares 
app.use(express.json());
// Para poder recibir datos en formato JSON y URL-encoded
app.use(express.urlencoded({ extended: true })); 

app.set('port', process.env.PORT || 3000);

// Configuración de Cloudinary
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : './uploads',
    limits: { fileSize: 10 * 1024 * 1024 }, // hasta 10MB
}))

// Variables globales

// Rutas para administradores
app.use('/api', routerAdministrador);

// Rutas para Director
app.use('/api',routerEstudiante);

// Rutas para deportes
app.use('/api',routerDeportes);

//Ruta Login Google
app.use('/auth', authRoutes);


// Rutas 
app.get('/', (req, res) => {
    res.send("Server on");
});


// Manejo de una ruta que no sea encontrada
app.use((req, res) => res.status(404).send("Endpoint no encontrado - 404"));


// Exportar la instancia de express por medio de app
export default app;
