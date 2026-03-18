import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import Usuario from './models/usuario.js';
import fs from 'fs';

async function crearUsuarios() {
    try {
        console.log('Iniciando conexión...');
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: 'Numerologia'
        });
        console.log('Conectado a MongoDB (DB: Numerologia) para creación de usuarios...');

        const salt = await bcrypt.genSalt(10);
        
        const usuariosParaCrear = [
            {
                nombre: 'Admin General 1',
                email: 'admin_gen1@test.com',
                password: 'admin_password_1',
                rol: 'admin',
                fecha_nacimiento: new Date('1990-01-01')
            },
            {
                nombre: 'Admin General 2',
                email: 'admin_gen2@test.com',
                password: 'admin_password_2',
                rol: 'admin',
                fecha_nacimiento: new Date('1992-05-15')
            },
            {
                nombre: 'Usuario Test 1',
                email: 'user_test1@test.com',
                password: 'user_password_1',
                rol: 'usuario',
                fecha_nacimiento: new Date('1995-10-20')
            },
            {
                nombre: 'Usuario Test 2',
                email: 'user_test2@test.com',
                password: 'user_password_2',
                rol: 'usuario',
                fecha_nacimiento: new Date('1988-12-12')
            }
        ];

        let credencialesTexto = "=== NUEVAS CREDENCIALES DE ACCESO ===\n\n";

        for (const u of usuariosParaCrear) {
            const existe = await Usuario.findOne({ email: u.email });
            if (existe) {
                console.log(`El usuario ${u.email} ya existe. Saltando...`);
                continue;
            }

            const hashedPassword = await bcrypt.hash(u.password, salt);
            const nuevoUsuario = new Usuario({
                ...u,
                password: hashedPassword,
                estado: 'activo'
            });

            await nuevoUsuario.save();
            console.log(`✅ Creado: ${u.nombre} (${u.rol})`);

            credencialesTexto += `Nombre: ${u.nombre}\n`;
            credencialesTexto += `Email: ${u.email}\n`;
            credencialesTexto += `Password: ${u.password}\n`;
            credencialesTexto += `Rol: ${u.rol}\n`;
            credencialesTexto += `-----------------------------------\n`;
        }

        fs.writeFileSync('nuevas_credenciales.txt', credencialesTexto);
        console.log('\n📄 Archivo nuevas_credenciales.txt creado con éxito.');

        await mongoose.connection.close();
        process.exit(0);
    } catch (error) {
        console.error('Error creando usuarios:', error);
        process.exit(1);
    }
}

crearUsuarios();
