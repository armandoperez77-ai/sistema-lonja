import express from "express";
import { login, credenciales, cerrarsesion } from "../controllers/loginController.js";

const router = express.Router();

// Mostrar el formulario de inicio de sesión
router.get("/", login);

// Procesar el correo y la contraseña
router.post("/credenciales", credenciales);

// Destruir la cookie y salir
router.get("/cerrarsesion", cerrarsesion);

export default router;