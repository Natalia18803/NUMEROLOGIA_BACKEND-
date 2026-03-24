import mongoose from 'mongoose';
import Usuario from './models/usuario.js';
import * as dotenv from 'dotenv';
dotenv.config();

const uri = "mongodb+srv://Natalia:kinher1013@natalia.ksrcic0.mongodb.net/test";

async function main() {
    try {
        await mongoose.connect(uri);
        const email = 'lis@example.com';
        const exists = await Usuario.findOne({ email });
        if (!exists) {
            const nuevo = new Usuario({
                nombre: 'Lis',
                email: email,
                password: 'passwordlis', // will be hashed by pre-save
                fecha_nacimiento: new Date('2000-01-01'),
                estado: 'activo',
                rol: 'usuario'
            });
            await nuevo.save();
            console.log("Usuario Lis creado exitosamente");
        } else {
            console.log("Lis ya existe");
        }
    } catch (e) {
        console.error(e);
    } finally {
        await mongoose.connection.close();
    }
}

main().catch(console.error);
