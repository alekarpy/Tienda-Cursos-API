// scripts/view-users.js
// Script para ver usuarios en la base de datos
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/user.js';

// Cargar variables de entorno
dotenv.config();

const viewUsers = async () => {
    try {
        console.log('🔌 Conectando a MongoDB...');
        
        // Conectar a MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Conectado a MongoDB\n');

        // Obtener todos los usuarios (sin contraseñas)
        const users = await User.find().select('-password').lean();

        console.log('📊 ===== USUARIOS REGISTRADOS =====\n');
        console.log(`Total de usuarios: ${users.length}\n`);

        if (users.length === 0) {
            console.log('⚠️  No hay usuarios registrados en la base de datos.');
        } else {
            users.forEach((user, index) => {
                console.log(`\n--- Usuario ${index + 1} ---`);
                console.log(`ID: ${user._id}`);
                console.log(`Username: ${user.username || '(no definido)'}`);
                console.log(`Email: ${user.email || '(no definido)'}`);
                console.log(`Rol: ${user.role || 'cliente'}`);
                console.log(`Creado: ${user.createdAt ? new Date(user.createdAt).toLocaleString() : 'N/A'}`);
                if (user.updatedAt) {
                    console.log(`Actualizado: ${new Date(user.updatedAt).toLocaleString()}`);
                }
            });

            // Resumen por roles
            const roleCount = {};
            users.forEach(user => {
                const role = user.role || 'user';
                roleCount[role] = (roleCount[role] || 0) + 1;
            });

            console.log('\n📈 ===== RESUMEN POR ROLES =====');
            Object.entries(roleCount).forEach(([role, count]) => {
                console.log(`${role}: ${count} usuario(s)`);
            });
        }

        // Cerrar conexión
        await mongoose.connection.close();
        console.log('\n✅ Conexión cerrada');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

// Ejecutar
viewUsers();

