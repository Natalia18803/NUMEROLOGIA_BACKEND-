import mongoose from 'mongoose';

// Interceptamos la variable de entorno de Vercel. Si dice /numerologia, la cambiamos a /test
// (Esto soluciona el problema de que Vercel esté apuntando a la base de datos vacía)
let uri = process.env.MONGO_URI || "mongodb+srv://Natalia:kinher1013@natalia.ksrcic0.mongodb.net/test";
if (uri.includes('/numerologia')) {
    uri = uri.replace('/numerologia', '/test');
}

async function conectarMongo() {
    try {
        await mongoose.connect(uri);
        console.log('Conectado exitosamente a MongoDB con Mongoose');
    } catch (error) {
        console.error('Error conectando a MongoDB:', error);
        throw error;
    }
}

export { conectarMongo };
