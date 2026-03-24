import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
dotenv.config();

const uri = "mongodb+srv://Natalia:kinher1013@natalia.ksrcic0.mongodb.net/test";

async function main() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const users = await client.db('test').collection('usuarios').find({}).toArray();
        const fs = await import('fs');
        let output = "";
        for (const u of users) {
             output += `Nombre: ${u.nombre}, Email: ${u.email}\n`;
        }
        fs.writeFileSync('lis_check.txt', output, 'utf8');
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);
