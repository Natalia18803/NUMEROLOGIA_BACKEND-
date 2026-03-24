import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

const MONGO_URI = "mongodb+srv://Natalia:kinher1013@natalia.ksrcic0.mongodb.net/numerologia";

const usuarioSchema = new mongoose.Schema({
    nombre: { type: String },
    email: { type: String },
    password: { type: String },
    rol: { type: String },
    estado: { type: String }
});

const Usuario = mongoose.models.Usuario || mongoose.model('Usuario', usuarioSchema);

async function checkUsers() {
    try {
        await mongoose.connect(MONGO_URI);
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("Colecciones en la DB:", collections.map(c => c.name));
        const users = await Usuario.find({}, 'nombre email rol estado');
        console.log("Todos los usuarios en la base de datos:");
        console.table(users.map(u => ({
            Nombre: u.nombre,
            Email: u.email,
            Estado: u.estado,
            Rol: u.rol
        })));
        process.exit(0);
    } catch (error) {
        console.error("Error al consultar:", error);
        process.exit(1);
    }
}

checkUsers();
