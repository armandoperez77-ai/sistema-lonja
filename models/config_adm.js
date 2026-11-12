import { Usuario, Tipo, Comprador, Lote, Especie } from "./index.js";

async function createInitialAdmin() {
    try {
        // 1. Crear Administrador Inicial (Requerimiento 2)
        const adminExistente = await Usuario.findOne({ where: { email: 'admin@lonja.com' } });
        if (!adminExistente) {
            await Usuario.create({
                nombre: 'Administrador Lonja',
                email: 'admin@lonja.com',
                password: '1234' 
            });
            console.log('Usuario administrador inicial creado exitosamente.');
        } else {
            console.log('El usuario administrador ya existe. No se requiere acción.');
        }

        // 2. Poblar Catálogos Iniciales si están vacíos (Para habilitar formularios de Compra)
        const totalTipos = await Tipo.count();
        if (totalTipos === 0) {
            const tipos = await Tipo.bulkCreate([
                { nombre: 'Pescado Azul' },
                { nombre: 'Pescado Blanco' },
                { nombre: 'Marisco / Crustáceo' }
            ]);

            await Comprador.bulkCreate([
                { nombre: 'Armando', apellido_paterno: 'Pérez', apellido_materno: 'Villegas', direccion: 'Av. Central 120, Ciudad Nezahualcóyotl', correo: 'armando.perez@comercializadora.mx' },
                { nombre: 'Carlos', apellido_paterno: 'Mendoza', apellido_materno: 'Ruiz', direccion: 'Blvd. Ávila Camacho 450, Veracruz', correo: 'cmendoza@mariscosdelgolfo.mx' },
                { nombre: 'Elena', apellido_paterno: 'Gómez', apellido_materno: 'Lara', direccion: 'Mercado de la Viga Local 34, CDMX', correo: 'elena.gomez@pescadosviga.mx' }
            ]);

            const lotes = await Lote.bulkCreate([
                { kilos: 250.50, numero_cajas: 10, precio_kilo_salida: 85.00, fecha: new Date() },
                { kilos: 180.00, numero_cajas: 8, precio_kilo_salida: 120.00, fecha: new Date() },
                { kilos: 95.75, numero_cajas: 5, precio_kilo_salida: 210.00, fecha: new Date() }
            ]);

            await Especie.bulkCreate([
                { nombre: 'Atún Aleta Amarilla', imagen: 'atun.jpg', id_lte: lotes[0].id_lte, id_tpo: tipos[0].id_tpo },
                { nombre: 'Huachinango del Golfo', imagen: 'huachinango.jpg', id_lte: lotes[1].id_lte, id_tpo: tipos[1].id_tpo },
                { nombre: 'Camarón Cristal', imagen: 'camaron.jpg', id_lte: lotes[2].id_lte, id_tpo: tipos[2].id_tpo }
            ]);

            console.log('Catálogos iniciales (Tipos, Compradores, Lotes y Especies) creados exitosamente.');
        }
    } catch (error) {
        console.error('Error al inicializar datos base:', error);
    }
}

export default createInitialAdmin;