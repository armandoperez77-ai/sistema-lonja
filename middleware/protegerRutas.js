import jwt from "jsonwebtoken";
import Usuario from "../models/Usuario.js";
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const rutaProteger = async (req, res, next) => {
    // 1. Verificar si el navegador envió la cookie con el token
    const { _token } = req.cookies;
    
    if (!_token) {
        return res.redirect("/"); // Lo regresamos al login
    }

    try {
        // 2. Comprobar que el token es válido y no ha sido alterado
        const decoded = jwt.verify(_token, process.env.JWT_SECRET);
        const usuario = await Usuario.findByPk(decoded.id);

        // 3. Si el usuario existe, lo dejamos pasar a la siguiente ruta
        if (usuario) {
            req.usuario = usuario;
            return next();
        } else {
            return res.redirect("/");
        }
    } catch (error) {
        // Si el token expiró o es falso, limpiamos la cookie y lo botamos
        return res.clearCookie("_token").redirect("/");
    }
};

export default rutaProteger;