import 'dotenv/config';
import mongoose from 'mongoose';

async function listDbs() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const adminDb = mongoose.connection.db.admin();
        const dbs = await adminDb.listDatabases();
        console.log('Available Databases:', dbs.databases.map(d => d.name));
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

listDbs();
