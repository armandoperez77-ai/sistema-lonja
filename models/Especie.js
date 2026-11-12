import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const Especie = db.define('Especie', {
    id_epe: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING(25), allowNull: false },
    imagen: { type: DataTypes.STRING(100), allowNull: true },
    id_lte: { type: DataTypes.INTEGER, allowNull: false }, // Llave foránea de Lote
    id_tpo: { type: DataTypes.SMALLINT, allowNull: false } // Llave foránea de Tipo
}, { 
    tableName: 'especie', 
    timestamps: false 
});

export default Especie;