import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
    const auth = req.headers.authorization;

    // LÓGICA CORREGIDA: 
    // Si no existe el encabezado O NO (¡) empieza con 'Bearer ', rechaza.
    if (!auth || !auth.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'No autorizado - Formato inválido' });
    }

    // Extraemos el token (lo que va después del espacio)
    const token = auth.split(' ')[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next(); // Todo bien, adelante.
    } catch (err) {
        // Si el token expiró o la firma es falsa
        return res.status(401).json({ message: 'Token inválido o expirado' });
    }
};
