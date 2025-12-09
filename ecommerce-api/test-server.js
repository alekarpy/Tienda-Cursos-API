import express from 'express';

const app = express();
const PORT = 3001; // ← Puerto diferente

// Middleware básico
app.use((req, res, next) => {
    console.log(`📨 ${req.method} ${req.url}`);
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
});

// Rutas simples
app.get('/test', (req, res) => {
    res.json({
        status: 'success',
        message: '✅ ¡Servidor funcionando!',
        timestamp: new Date().toISOString()
    });
});

app.post('/api/auth/register', (req, res) => {
    console.log('Datos de registro:', req.body);
    res.json({
        success: true,
        message: 'Registro exitoso (simulado)'
    });
});

app.listen(PORT, () => {
    console.log(`🎯 Servidor de diagnóstico en http://localhost:${PORT}`);
    console.log(`🔗 Prueba: http://localhost:${PORT}/test`);
});