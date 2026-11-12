import { Compra, Comprador, Lote, Especie, Tipo } from "../models/index.js";

// GET: Muestra el panel principal de ventas y reportes
const verVentas = async (req, res) => {
    try {
        const compras = await Compra.findAll({
            include: [
                { model: Comprador },
                { 
                    model: Lote,
                    include: [{ model: Especie, include: [{ model: Tipo }] }]
                }
            ],
            order: [['fecha', 'DESC']]
        });
        
        const lotes = await Lote.findAll({ order: [['id_lte', 'DESC']] });
        const compradores = await Comprador.findAll({ order: [['apellido_paterno', 'ASC']] });
        
        res.render("ventas/index.ejs", { 
            compras,
            lotes,
            compradores,
            usuario: req.usuario 
        });
    } catch (error) {
        console.error("Error al obtener las ventas:", error);
        res.status(500).send("Error al obtener las ventas");
    }
};

// POST: Registra una nueva compra en la base de datos (Requerimiento 1)
const registrarCompra = async (req, res) => {
    try {
        const { id_lte, codigo_cpr, precio_kilo_final, precio_total } = req.body;

        if (!id_lte || !codigo_cpr || !precio_kilo_final || !precio_total) {
            return res.redirect("/ventas?error=Campos_incompletos");
        }

        await Compra.create({
            id_lte: Number(id_lte),
            codigo_cpr: Number(codigo_cpr),
            precio_kilo_final: Number(precio_kilo_final),
            precio_total: Number(precio_total),
            fecha: new Date()
        });

        res.redirect("/ventas");
    } catch (error) {
        console.error("Error al registrar la compra:", error);
        res.redirect("/ventas?error=No_se_pudo_registrar");
    }
};

export { verVentas, registrarCompra };