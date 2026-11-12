import { Sequelize } from "sequelize";
import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

const db = new Sequelize(process.env.BD_NOMBRE, process.env.BD_USUARIO, process.env.BD_CLAVE, {
  dialect: process.env.BD_DIALEC,
  host: process.env.BD_HOST,
  port: process.env.BD_PORT,
  logging: false // Para que no llene la terminal de código SQL
});

export default db;