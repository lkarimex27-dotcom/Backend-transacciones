import express from "express";
import cors from "cors";
import morgan from "morgan";

// 1. Importaciones de rutas (Solo las que existen físicamente)
import authRoutes from "./routes/auth.routes.js";
import transactionRoutes from "./routes/transaction.routes.js"; 

const app = express();

app.use(
    cors({
    origin: process.env.CORS_ORIGIN || "https://frotend-transacciones.vercel.app",
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 2. Registro de rutas
app.use("/api/auth", authRoutes);

// REGLA DE ORO: Si borraste el archivo aprendiz.routes.js, 
// DEBES borrar o comentar la siguiente línea:
// app.use("/api/aprendices", aprendizRoutes); 

app.use("/api/transacciones", transactionRoutes); 

app.get("/health", (req, res) => {
    res.json({ 
        status: "OK",
        message: "API funcionando correctamente"
    });
});

// Manejador de errores global
app.use((err, req, res, next) => {
    console.error('❌ Error en la ruta', err);
    res.status(500).json({
         message: 'Error interno del servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
     });
});

export default app;