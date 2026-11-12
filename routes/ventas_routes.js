import express from "express";
import { verVentas, registrarCompra } from "../controllers/ventasController.js";
import rutaProteger from "../middleware/protegerRutas.js";

const router = express.Router();

// OJO AQUÍ: Aplicamos el middleware a TODO el router
// Si no hay token válido, de aquí no pasan.
router.use(rutaProteger);

// Rutas protegidas para manejar las ventas
router.get("/", verVentas);
router.post("/registrar", registrarCompra);

export default router;