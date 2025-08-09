import mongoose from 'mongoose';

const { Schema } = mongoose;

const usuarioSchema = new Schema({
    nombre: String,
    email: String,
    googleId: {
        type: String,
        unique: true
    }
});

const Usuario = mongoose.model('Usuario', usuarioSchema);

export default Usuario;