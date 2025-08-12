import mongoose, {Schema,model} from 'mongoose'

const deporteSchema = new Schema({
    nombre:{
        type:String,
        require:true,
        trim:true
    },
    descripcion: {
        type: String,
        required: true,
        trim: true
    },
    estudiante: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Estudiante',
        required: true
    },
    precioUniforme: {
        type: Number,
        required: true,
        min: 0
    },
    estadoPago: {
        type: String,
        enum: ['Pendiente', 'Pagado'],
        default: 'Pendiente'
    }
    },

 horarioDeporte: {
        type: String,
        required: true,
        trim: true
    },
    lugarDeporte: {
        type: String,
        required: true,
        trim: true
    },
    tipoDeporte: {
        type: String,
        required: true,
        trim: true
    },
    descripcionDeporte: {
        type: String,
        required: true,
        trim: true
    },
                             
    {
    timestamps: true
});
export default model('Deporte', deporteSchema);
