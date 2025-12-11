// scripts/update-user-role.js
// Script para actualizar el rol de un usuario a administrador
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../src/models/user.js';

// Cargar variables de entorno
dotenv.config();

// Obtener argumentos de la línea de comandos
const args = process.argv.slice(2);
const emailOrUsername = args[0];
const newRole = args[1] || 'admin';

if (!emailOrUsername) {
    console.log('❌ Uso: node scripts/update-user-role.js <email|username> [role]');
    console.log('   Ejemplo: node scripts/update-user-role.js admin@ejemplo.com admin');
    console.log('   Ejemplo: node scripts/update-user-role.js juan user');
    process.exit(1);
}

const updateUserRole = async () => {
    try {
        console.log('🔌 Conectando a MongoDB...');
        
        // Conectar a MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Conectado a MongoDB\n');

        // Buscar usuario por email o username
        const user = await User.findOne({
            $or: [
                { email: emailOrUsername },
                { username: emailOrUsername }
            ]
        });

        if (!user) {
            console.log(`❌ Usuario no encontrado: ${emailOrUsername}`);
            await mongoose.connection.close();
            process.exit(1);
        }

        console.log('👤 Usuario encontrado:');
        console.log(`   ID: ${user._id}`);
        console.log(`   Username: ${user.username}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Rol actual: ${user.role || 'user'}`);
        console.log(`   Nuevo rol: ${newRole}\n`);

        // Actualizar rol (sin validar otros campos requeridos)
        await User.updateOne(
            { _id: user._id },
            { $set: { role: newRole } }
        );

        console.log(`✅ Rol actualizado exitosamente a: ${newRole}`);

        // Cerrar conexión
        await mongoose.connection.close();
        console.log('✅ Conexión cerrada');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

// Ejecutar
updateUserRole();

