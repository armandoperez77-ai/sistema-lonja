import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const Compra = db.define('Compra', {
    id_cmp: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_lte: { type: DataTypes.INTEGER, allowNull: false }, // Corrección lógica del diagrama
    codigo_cpr: { type: DataTypes.SMALLINT, allowNull: false },
    precio_kilo_final: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    precio_total: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    fecha: { type: DataTypes.DATE, allowNull: false }
}, { 
    tableName: 'compra', 
    timestamps: false 
});

export default Compra;