import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
dotenv.config();

const uri = "mongodb+srv://Natalia:kinher1013@natalia.ksrcic0.mongodb.net/";

async function main() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        const users = await client.db('test').collection('usuarios').find({}, { projection: { email: 1, password: 1 } }).toArray();
        
        const testPasswords = ['123456', '12345678', 'password', '999999999', '1234', 'kinher1013'];
        
        const fs = await import('fs');
        let output = "";
        for (const u of users) {
            if (!u.password) continue;
            let found = false;
            for (const p of testPasswords) {
                if (await bcrypt.compare(p, u.password)) {
                    output += `Email: ${u.email} -> Password: ${p}\n`;
                    found = true;
                    break;
                }
            }
            if (!found) {
                output += `Email: ${u.email} -> Password: [desconocida/encriptada]\n`;
            }
        }
        fs.writeFileSync('passwords_out.txt', output, 'utf8');
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);
