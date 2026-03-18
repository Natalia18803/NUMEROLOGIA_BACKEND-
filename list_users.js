import 'dotenv/config';
import mongoose from 'mongoose';
import fs from 'fs';

mongoose.connect(process.env.MONGO_URI)
    .then(async () => {
        const users = await mongoose.connection.db.collection('usuarios').find({}).toArray();
        fs.writeFileSync('users_output.json', JSON.stringify(users, null, 2));
        console.log('✅ Usuarios guardados en users_output.json');
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
