import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
dotenv.config();

const uri = "mongodb+srv://Natalia:kinher1013@natalia.ksrcic0.mongodb.net/";

async function main() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const users = await client.db('test').collection('usuarios').find({}, { projection: { nombre: 1, email: 1, rol: 1, estado: 1 } }).toArray();
        const fs = await import('fs');
        const output = users.map(u => `${u.nombre} - ${u.email} - Rol: ${u.rol || 'usuario'} - Estado: ${u.estado}`).join('\n');
        fs.writeFileSync('usuarios_list.txt', output, 'utf8');
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);
