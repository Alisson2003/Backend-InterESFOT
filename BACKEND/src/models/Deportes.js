import mongoose, {Schema,model} from 'mongoose'

const deporteSchema = new Schema({
   
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

/*horario: {
        type: String,
        required: true,
        trim: true
    },                                                // esto va ir en estudiantes para agregar
    lugar: {
        type: String,
        required: true,
        trim: true
    },
*/



                                 
                                 
    {
    timestamps: true
});
export default model('Deporte', deporteSchema);
