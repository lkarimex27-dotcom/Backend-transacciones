import { Router } from 'express';
import { login, register } from '../controllers/auth.controller.js'; // 👈 Asegúrate de importar register

const router = Router();

// Ruta de Login (la que ya tenías)
router.post('/login', login);

// --- AGREGA ESTA LÍNEA ---
router.post('/register', register); 

export default router;