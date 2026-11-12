import { DataTypes } from 'sequelize';
import db from '../config/db.js';

const Lote = db.define('Lote', {
    id_lte: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    kilos: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    numero_cajas: { type: DataTypes.SMALLINT, allowNull: false },
    precio_kilo_salida: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    fecha: { type: DataTypes.DATE, allowNull: false } // DATETIME en el PDF
}, { 
    tableName: 'lote', 
    timestamps: false 
});

export default Lote;