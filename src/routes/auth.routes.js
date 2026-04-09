import { Router } from 'express';
import { 
    login, 
    register, 
    recoverPassword, 
    getUsers, 
    updateUser, 
    deleteUser 
} from '../controllers/auth.controller.js';

const router = Router();

// --- RUTAS DE AUTENTICACIÓN ---

// POST: Iniciar sesión
router.post('/login', login);

// POST: Crear una cuenta nueva (se guarda en Atlas)
router.post('/register', register);

// POST: Enviar correo de recuperación (vía Nodemailer)
router.post('/recover', recoverPassword);


// --- RUTAS DE GESTIÓN (CRUD) ---

// GET: Listar todos los usuarios registrados
router.get('/users', getUsers);

// PUT: Editar un usuario específico por su ID
// Ejemplo: /api/auth/update/65f123abc...
router.put('/update/:id', updateUser);

// DELETE: Borrar un usuario de la base de datos por su ID
router.delete('/delete/:id', deleteUser);


export default router;