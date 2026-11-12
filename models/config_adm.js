import Usuario from "./Usuario.js";

async function createInitialAdmin() {
    try {
        // Buscamos si ya existe el correo para no duplicarlo
        const adminExistente = await Usuario.findOne({ where: { email: 'admin@lonja.com' } });
        
        if (!adminExistente) {
            // Si no existe, lo creamos. El hook de Usuario.js encriptará el '1234' automáticamente.
            await Usuario.create({
                nombre: 'Administrador Lonja',
                email: 'admin@lonja.com',
                password: '1234' 
            });
            console.log('Usuario administrador inicial creado exitosamente.');
        } else {
            console.log('El usuario administrador ya existe. No se requiere acción.');
        }
    } catch (error) {
        console.error('Error al crear el administrador inicial:', error);
    }
}

export default createInitialAdmin;