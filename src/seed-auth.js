import 'dotenv/config';
import bcrypt from 'bcryptjs';
import User from './models/User.js';
import mongoose from 'mongoose';

async function run() {
    try {
        console.log('⏳ Conectando a MongoDB Atlas...');
        
        // Añadimos las opciones para ignorar errores de certificados del WiFi
        await mongoose.connect(process.env.MONGODB_URI, {
            tls: true,
            tlsAllowInvalidCertificates: true 
        });

        console.log('📡 Conexión exitosa. Limpiando base de datos...');
        await User.deleteMany({});

        const hashed = await bcrypt.hash('123456', 10);

        await User.create({
            email: 'admin@demo.com',
            password: hashed,
            role: 'admin'
        });

        console.log('✅ Usuario admin creado correctamente');
        console.log('------------------------------');
        console.log('📧 Email: admin@demo.com');
        console.log('🔑 Password: 123456');
        console.log('------------------------------');

    } catch (error) {
        console.error('❌ Error durante la ejecución:');
        console.error(error.message);
    } finally {
        // Cerramos la conexión siempre, ocurra un error o no
        await mongoose.disconnect();
        process.exit();
    }
}

run();