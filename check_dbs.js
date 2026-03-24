import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

const uri = "mongodb+srv://Natalia:kinher1013@natalia.ksrcic0.mongodb.net/";

async function main() {
    const client = new MongoClient(uri);
    try {
        await client.connect();
        let output = "";
        const databasesList = await client.db().admin().listDatabases();
        output += "Databases en el cluster:\n";
        databasesList.databases.forEach(db => output += ` - ${db.name}\n`);
        
        const dbsToTest = ['test', 'numerologia'];
        for (const dbName of dbsToTest) {
            output += `\nColecciones en db '${dbName}':\n`;
            const collections = await client.db(dbName).listCollections().toArray();
            for (const col of collections) {
                output += ` - ${col.name} (${await client.db(dbName).collection(col.name).countDocuments()} documentos)\n`;
                if (col.name === 'usuarios') {
                    const sample = await client.db(dbName).collection(col.name).findOne({});
                    output += `   Sample: ${JSON.stringify(sample)}\n`;
                }
            }
        }
        fs.writeFileSync('dbs_output.txt', output, 'utf8');
    } catch (e) {
        fs.writeFileSync('dbs_output.txt', "Error: " + e, 'utf8');
    } finally {
        await client.close();
    }
}

main().catch(console.error);
