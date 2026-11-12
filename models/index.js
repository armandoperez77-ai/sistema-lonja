import Lote from "./Lote.js";
import Compra from "./Compra.js";
import Comprador from "./Comprador.js";
import Especie from "./Especie.js";
import Tipo from "./Tipo.js";
import Usuario from "./Usuario.js"; // El que creaste hace un rato

// Relación: Un Lote tiene muchas Compras
Lote.hasMany(Compra, { foreignKey: 'id_lte' });
Compra.belongsTo(Lote, { foreignKey: 'id_lte' });

// Relación: Un Comprador tiene muchas Compras
Comprador.hasMany(Compra, { foreignKey: 'codigo_cpr' });
Compra.belongsTo(Comprador, { foreignKey: 'codigo_cpr' });

// Relación: Un Lote tiene muchas Especies
Lote.hasMany(Especie, { foreignKey: 'id_lte' });
Especie.belongsTo(Lote, { foreignKey: 'id_lte' });

// Relación: Un Tipo tiene muchas Especies
Tipo.hasMany(Especie, { foreignKey: 'id_tpo' });
Especie.belongsTo(Tipo, { foreignKey: 'id_tpo' });

export { Lote, Compra, Comprador, Especie, Tipo, Usuario };