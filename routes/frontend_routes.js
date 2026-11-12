import express from "express";
import rutaProteger from "../middleware/protegerRutas.js";
import { Lote, Comprador, Especie, Tipo } from "../models/index.js";

const router = express.Router();

// Esta ruta conserva ese flujo y lleva al panel de compras existente.
router.get("/reporte-diario", rutaProteger, (req, res) => {
    res.redirect("/ventas");
});

// Catálogos de solo lectura para poblar los formularios y las vistas del frontend.
// No modifica ni sustituye los controladores de negocio existentes.
router.get("/ui/catalogos", rutaProteger, async (req, res) => {
    try {
        const [lotes, compradores, especies, tipos] = await Promise.all([
            Lote.findAll({
                attributes: ["id_lte", "kilos", "numero_cajas", "precio_kilo_salida", "fecha"],
                order: [["id_lte", "DESC"]]
            }),
            Comprador.findAll({
                attributes: ["codigo_cpr", "nombre", "apellido_paterno", "apellido_materno"],
                order: [["apellido_paterno", "ASC"], ["nombre", "ASC"]]
            }),
            Especie.findAll({
                attributes: ["id_epe", "nombre", "id_lte", "id_tpo"],
                order: [["nombre", "ASC"]]
            }),
            Tipo.findAll({
                attributes: ["id_tpo", "nombre"],
                order: [["nombre", "ASC"]]
            })
        ]);

        res.set("Cache-Control", "no-store");
        res.json({
            lotes: lotes.map((lote) => ({
                id_lte: lote.id_lte,
                kilos: Number(lote.kilos),
                numero_cajas: lote.numero_cajas,
                precio_kilo_salida: Number(lote.precio_kilo_salida),
                fecha: lote.fecha
            })),
            compradores: compradores.map((comprador) => ({
                codigo_cpr: comprador.codigo_cpr,
                nombre: [comprador.nombre, comprador.apellido_paterno, comprador.apellido_materno]
                    .filter(Boolean)
                    .join(" ")
            })),
            especies: especies.map((especie) => ({
                id_epe: especie.id_epe,
                nombre: especie.nombre,
                id_lte: especie.id_lte,
                id_tpo: especie.id_tpo
            })),
            tipos: tipos.map((tipo) => ({
                id_tpo: tipo.id_tpo,
                nombre: tipo.nombre
            }))
        });
    } catch (error) {
        console.error("Error al consultar catálogos para la interfaz:", error);
        res.status(500).json({ message: "No fue posible cargar los catálogos." });
    }
});

export default router;
