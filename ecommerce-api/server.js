import express from 'express';
import dotenv from "dotenv";
import routes from "./src/routes/index.js";
import dbConnection from "./src/config/database.js";
import { logger } from './src/middlewares/logger.js';



dotenv.config();

const app = express();

app.use(express.json()); // para leer los datos json (send es por default, así que se tiene qué especificar que es json).
app.use(logger);

app.get("/", (req, res) => {
    res.send("¡Cursos en Línea para Todos 🤓!");
});

app.use('/api',routes);

//conexión a base de datos
dbConnection();


app.listen(process.env.PORT, () => {
    console.log(`Servidor corriendo en el puerto https://localhost:${process.env.PORT}`);
});



//se debe agregar conexión a la base de datos y rutas


