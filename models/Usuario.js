import { DataTypes } from "sequelize";
import db from "../config/db.js";
import bcrypt from "bcryptjs";

const Usuario = db.define("Usuario", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  nombre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: "usuarios",
  timestamps: false,
  hooks: {
    beforeCreate: async function (usuario) {
      const rep = await bcrypt.genSalt(10);
      usuario.password = await bcrypt.hash(usuario.password, rep);
    }
  }
});

// Método para comparar la contraseña que ponga el usuario con la encriptada
Usuario.prototype.verificandoClave = function(password) {
  return bcrypt.compareSync(password, this.password);
}

export default Usuario;