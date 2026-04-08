import { Schema, model } from "mongoose";
import crypto from "crypto";

const TransactionSchema = new Schema({
  transaccion_uuid: {
    type: String,
    default: () => crypto.randomUUID(),
    unique: true,
  },
  cuenta_origen: {
    type: String,
    required: true,
    trim: true,
    maxlength: 30,
  },
  cuenta_destino: {
    type: String,
    required: true,
    trim: true,
    maxlength: 30,
  },
  monto: {
    type: Number,
    required: true,
    min: [0.01, 'El monto debe ser mayor a cero']
  },
  tipo: {
    type: String,
    required: true,
    enum: ["Transferencia", "Deposito", "Retiro"],
    default: "Transferencia"
  },
  fecha_hora: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

export default model("Transaction", TransactionSchema);