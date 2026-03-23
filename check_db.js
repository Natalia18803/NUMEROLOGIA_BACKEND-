import 'dotenv/config';
import mongoose from 'mongoose';

async function deepCheck() {
    try {
        const baseUri = 'mongodb+srv://Natalia:kinher1013@natalia.ksrcic0.mongodb.net/admin?retryWrites=true&w=majority';
        const conn = await mongoose.createConnection(baseUri).asPromise();
        const adminDb = conn.db.admin();
        const { databases } = await adminDb.listDatabases();
        
        for (const dbInfo of databases) {
            const dbName = dbInfo.name;
            if (['admin', 'local', 'config'].includes(dbName)) continue;
            
            console.log(`\n--- DB: ${dbName} ---`);
            const dbConn = await mongoose.createConnection(baseUri.replace('/admin', `/${dbName}`)).asPromise();
            const collections = await dbConn.db.listCollections().toArray();
            
            for (const col of collections) {
                const count = await dbConn.db.collection(col.name).countDocuments();
                console.log(`  - ${col.name} (${count})`);
                if (col.name.toLowerCase().includes('usuario')) {
                    const data = await dbConn.db.collection(col.name).find({}).toArray();
                    console.log(`    Emails:`, data.map(u => u.email));
                }
            }
            await dbConn.close();
        }
        await conn.close();
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

deepCheck();
