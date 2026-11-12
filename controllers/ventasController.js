import { Compra, Comprador, Lote } from "../models/index.js";

// GET: Muestra el panel principal de ventas
const verVentas = async (req, res) => {
    try {
        // Traemos todas las compras uniendo los datos del Comprador y el Lote
        const compras = await Compra.findAll({
            include: [
                { model: Comprador },
                { model: Lote }
            ],
            order: [['fecha', 'DESC']]
        });
        
        // Renderiza la vista que hará tu compañero
        res.render("ventas/index.ejs", { 
            compras,
            usuario: req.usuario // Mandamos los datos del admin que inició sesión
        });
    } catch (error) {
        console.log(error);
        res.status(500).send("Error al obtener las ventas");
    }
};

// POST: Función para registrar una nueva compra en la base de datos
const registrarCompra = async (req, res) => {
    try {
        // Estos son los nombres ("name") que tu compañero debe poner en sus inputs HTML
        const { id_lte, codigo_cpr, precio_kilo_final, precio_total } = req.body;

        // Insertamos la venta (Requerimiento 1)
        await Compra.create({
            id_lte,
            codigo_cpr,
            precio_kilo_final,
            precio_total,
            fecha: new Date() // Se registra automáticamente la fecha actual
        });

        // Redirigir a la vista de ventas tras guardar con éxito
        res.redirect("/ventas");
    } catch (error) {
        console.log("Error al registrar la compra:", error);
        res.redirect("/ventas?error=No_se_pudo_registrar");
    }
};

export { verVentas, registrarCompra };