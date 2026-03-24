import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
dotenv.config();

const uri = "mongodb+srv://Natalia:kinher1013@natalia.ksrcic0.mongodb.net/test";

async function main() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const users = await client.db('test').collection('usuarios').find({}).toArray();
        for (const u of users) {
             console.log(`Email: ${u.email}, Rol real en DB: '${u.rol}', Tipo de rol: ${typeof u.rol}`);
        }
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);
