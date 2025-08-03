const inquirer = require('inquirer');
const chalkTheme = require('../../config/chalkTheme');
const {
  crearProyecto,
  listarProyectos,
  buscarProyectoPorId,
  actualizarProyecto,
  eliminarProyecto
} = require('../../models/proyectoModel');

async function showProyectosMenu() {
  let salir = false;

  while (!salir) {
    const { opcion } = await inquirer.prompt([{
      type: 'list',
      name: 'opcion',
      message: chalkTheme.section('\nGestión de Proyectos'),
      choices: [
        'Crear proyecto',
        'Listar proyectos',
        'Buscar proyecto por ID',
        'Actualizar proyecto',
        'Eliminar proyecto',
        'Volver al menú principal'
      ]
    }]);

    switch (opcion) {
      case 'Crear proyecto':
        await crearProyecto();
        break;
      case 'Listar proyectos':
        await listarProyectos();
        break;
      case 'Buscar proyecto por ID':
        await buscarProyectoPorId();
        break;
      case 'Actualizar proyecto':
        await actualizarProyecto();
        break;
      case 'Eliminar proyecto':
        await eliminarProyecto();
        break;
      case 'Volver al menú principal':
        salir = true;
        break;
    }
  }
}

module.exports = showProyectosMenu;