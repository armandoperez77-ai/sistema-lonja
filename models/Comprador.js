import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const Comprador = db.define('Comprador', {
    codigo_cpr: { type: DataTypes.SMALLINT, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(15), allowNull: false },
    apellido_paterno: { type: DataTypes.STRING(15), allowNull: false },
    apellido_materno: { type: DataTypes.STRING(15), allowNull: false },
    direccion: { type: DataTypes.STRING(200), allowNull: false },
    correo: { type: DataTypes.STRING(80), unique: true, allowNull: false } // En el PDF tiene una "U" de Unique
}, { 
    tableName: 'comprador', 
    timestamps: false 
});

export default Comprador;