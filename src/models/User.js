import { Schema, model } from "mongoose";

const userSchema = new Schema(
    {
        // Agregamos username para que coincida con el formulario de registro
        username: {
            type: String,
            required: [true, "El nombre de usuario es obligatorio"],
            trim: true
        },
        email: {
            type: String,
            required: [true, "El correo es obligatorio"],
            unique: true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: [true, "La contraseña es obligatoria"]
        },
        role: {
            type: String,
            enum: ['admin', 'user'],
            default: 'user' // Cambiado a 'user' por seguridad, cámbialo a 'admin' si prefieres
        }
    },
    { timestamps: true }
);

export default model("User", userSchema);