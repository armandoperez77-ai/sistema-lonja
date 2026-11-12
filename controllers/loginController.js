import Usuario from "../models/Usuario.js";
import { JWTGenera } from "../helpers/tokens.js";

// Renderiza la vista del formulario
const login = (req, res) => {
    res.render("login.ejs", {
        action: "/credenciales",
        method: "POST",
        error: null
    });
};

// Procesa los datos del formulario
const credenciales = async (req, res) => {
    const { email, password } = req.body;

    // 1. Comprobar si el usuario existe
    const us = await Usuario.findOne({ where: { email } });
    if (!us) {
        return res.render("login.ejs", {
            action: "/credenciales",
            method: "POST",
            error: "Credenciales no válidas"
        });
    }

    // 2. Comprobar contraseña
    if (!us.verificandoClave(password)) {
        return res.render("login.ejs", {
            action: "/credenciales",
            method: "POST",
            error: "Credenciales no válidas"
        });
    }

    // 3. Crear el JSON Web Token
    const token = JWTGenera({ id: us.id, nombre: us.nombre });

    // 4. Almacenar el token en una cookie y redirigir
    return res.cookie('_token', token, {
        httpOnly: true, // Protege contra ataques XSS
        maxAge: 2 * 60 * 60 * 1000 // Expira en 2 horas
    }).redirect('/reporte-diario'); // Los mandamos a la página de ventas
};

// Cerrar sesión
const cerrarsesion = (req, res) => {
    res.clearCookie('_token').redirect('/');
};

export { login, credenciales, cerrarsesion };