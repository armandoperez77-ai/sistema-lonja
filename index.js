import express from "express";
import db from "./config/db.js";
import dotenv from 'dotenv';
import cookieParser from "cookie-parser";

// Importaciones internas
import authRoutes from "./routes/auth_routes.js";
import createInitialAdmin from "./models/config_adm.js";
import { Lote, Compra, Comprador, Especie, Tipo, Usuario } from "./models/index.js";

dotenv.config({ path: '.env' });

const app = express();

// Configuración de Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser()); // Habilita la lectura de la cookie del token

// Motor de vistas
app.set('view engine', 'ejs');
app.set('views', './views');

// Conectar las rutas
app.use("/", authRoutes);

// Configuración y arranque del servidor
const port = 3000;

(async () => {
    try {
        await db.authenticate();
        console.log('Conexión a MariaDB establecida.');
        
        // Sincronizar tablas
        await db.sync({ alter: true }); 
        console.log('Modelos sincronizados.');
        
        // Crear administrador por defecto
        await createInitialAdmin();

        app.listen(port, () => {
            console.log(`Sistema Lonja encendido en el puerto ${port} 🚀`);
        });
    } catch (err) {
        console.error('Error al iniciar el servidor:', err);
    }
})();