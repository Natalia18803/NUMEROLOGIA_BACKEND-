import mongoose from 'mongoose';
import Usuario from './models/usuario.js';
import * as dotenv from 'dotenv';
dotenv.config();

const uri = "mongodb+srv://Natalia:kinher1013@natalia.ksrcic0.mongodb.net/test";

async function main() {
    try {
        await mongoose.connect(uri);
        const u = await Usuario.findOne({ email: 'testuser@example.com' });
        console.log("Email:", u.email);
        console.log("Rol:", u.rol);
        console.log("Comparacion: u.rol !== 'usuario':", u.rol !== 'usuario');
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.connection.close();
    }
}

main().catch(console.error);
