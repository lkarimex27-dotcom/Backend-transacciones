import 'dotenv/config';
import mongoose from "mongoose";
import app from "./app.js";
import cors from "cors";

app.use(cors());


const { MONGODB_URI, PORT } = process.env;

/**
 * Conexión a MongoDB Atlas:
 * - useNewUrlParser y useUnifiedTopology ya son por defecto en Mongoose 6+
 * - Maneja eventos de conexión para debug.
 */
mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Conectado a MongoDB Atlas');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error conectando a MongoDB:', err.message);
    process.exit(1);
  });