// scripts/view-users-simple.js
// Versión simplificada que muestra solo información esencial
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/user.js';

dotenv.config();

const viewUsers = async () => {
    try {
        console.log('🔌 Conectando a MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Conectado a MongoDB\n');

        // Obtener usuarios sin validar (raw query)
        const users = await User.find({}).lean();

        console.log('📊 ===== USUARIOS REGISTRADOS =====\n');
        console.log(`Total: ${users.length} usuario(s)\n`);

        if (users.length === 0) {
            console.log('⚠️  No hay usuarios.');
        } else {
            // Mostrar en formato tabla simple
            console.log('ID                          | Email                    | Username      | Rol');
            console.log('-'.repeat(80));
            
            users.forEach(user => {
                const id = String(user._id).substring(0, 24);
                const email = (user.email || '').padEnd(24);
                const username = (user.username || '(sin username)').padEnd(13);
                const role = user.role || 'cliente';
                console.log(`${id} | ${email} | ${username} | ${role}`);
            });

            // Resumen
            const admins = users.filter(u => u.role === 'admin').length;
            const clientes = users.filter(u => !u.role || u.role === 'cliente').length;
            
            console.log('\n📈 RESUMEN:');
            console.log(`   Administradores: ${admins}`);
            console.log(`   Clientes: ${clientes}`);
        }

        await mongoose.connection.close();
        console.log('\n✅ Listo');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

viewUsers();

