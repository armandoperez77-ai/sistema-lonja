import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const JWTGenera = (info) =>
  jwt.sign({
    id: info.id,
    nombre: info.nombre
  }, process.env.JWT_SECRET, {
    expiresIn: '1d' // El token será válido por 1 día
  });

export { JWTGenera };