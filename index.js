import 'dotenv/config';
import express from 'express';
import path from 'path';
import { conectarMongo } from './database/cnx-mongo.js';
import cors from 'cors'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import Usuario from './models/usuario.js';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
const __dirname = dirname(fileURLToPath(import.meta.url));

import usuarioRoutes from './routes/usuarioRoutes.js';
import pagoRoutes from './routes/pagoRoutes.js';
import lecturaRoutes from './routes/lecturaRoutes.js';
import { validarJWT } from './middlewares/validar-jwt.js';

const app = express();

// Middleware para parsear JSON
app.use(express.json());

// Configuración de CORS dinámica
const corsOptions = {
    origin: process.env.FRONTEND_URL || '*', // Permite el origen del frontend o todos en desarrollo
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};
app.use(cors(corsOptions));

// 1. Indicar la carpeta de archivos estáticos
app.use(express.static(path.join(__dirname, 'public', 'dist')));

// Conectar a MongoDB
conectarMongo();

// Seed usuario admin para desarrollo
const seedAdmin = async () => {
  try {
    const adminEmail = 'admin@admin.com';
    const existeAdmin = await Usuario.findOne({ email: adminEmail });
    if (!existeAdmin) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('999999999', salt);
      const adminUser = new Usuario({
        nombre: 'Admin Master',
        email: adminEmail,
        password: hashedPassword,
        fecha_nacimiento: new Date('1980-01-01'),
        estado: 'activo',
        rol: 'admin'
      });
      await adminUser.save();
      console.log('✅ Usuario admin creado:', adminEmail, '- Pass: 999999999');
    } else {
      console.log('ℹ️ Usuario admin ya existe.');
    }
  } catch (error) {
    console.error('Error en seed admin:', error);
  }
};
seedAdmin();

// Helper para generar token (ya no se usa aquí pero lo dejamos si es necesario para el index)
const generarToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secreto-temporal', {
        expiresIn: '30d'
    });
};

// ==========================================
//  RUTAS DE LA API
// ==========================================

// Rutas de Autenticación y Usuarios
app.use('/api/auth', usuarioRoutes);
app.use('/api/usuarios', usuarioRoutes);

// Otras rutas
app.use('/api/pagos', pagoRoutes);
app.use('/api/lecturas', lecturaRoutes);

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('API de Numerologia funcionando - Registro sin token requerido');
});

// Ruta de health check
app.get('/api/health', async (req, res) => {
    try {
        const state = mongoose.connection.readyState;
        if (state === 1) {
            res.status(200).json({ status: 'OK', message: 'Base de datos conectada' });
        } else {
            res.status(500).json({ status: 'ERROR', message: 'Base de datos no conectada' });
        }
    } catch (error) {
        res.status(500).json({ status: 'ERROR', message: 'Error verificando conexion' });
    }
});

// 2. Manejar rutas del Frontend (Importante para SPAs como React o Vue)
// Esto asegura que si refrescas la página en /dashboard, el backend devuelva el index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'dist', 'index.html'));
});

// Puerto del servidor
const PORT = process.env.PORT || 3000;

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
    console.log('');
    console.log('RUTAS DISPONIBLES EN /api/auth (y /api/usuarios):');
    console.log('  POST /api/auth/registro - Registro de usuario');
    console.log('  POST /api/auth/login    - Login de usuario');
    console.log('  GET  /api/auth/perfil   - Obtener usuario autenticado');
    console.log('');
    console.log('OTRAS RUTAS:');
    console.log('  /api/pagos/*            - Rutas de pagos');
    console.log('  /api/lecturas/*         - Rutas de lecturas');
});
