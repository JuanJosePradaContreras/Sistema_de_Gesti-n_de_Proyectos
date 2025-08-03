const inquirer = require('inquirer');
const chalkTheme = require('../../config/chalkTheme');
const {
  crearContrato,
  listarContratos,
  buscarContratoPorId,
  actualizarContrato,
  eliminarContrato
} = require('../../models/contratoModel');

async function showContratosMenu() {
  let salir = false;

  while (!salir) {
    const { opcion } = await inquirer.prompt([
      {
        type: 'list',
        name: 'opcion',
        message: chalkTheme.section('\nGestión de Contratos'),
        choices: [
          { name: 'Crear contrato', value: 'crear' },
          { name: 'Listar contratos', value: 'listar' },
          { name: 'Buscar contrato por ID', value: 'buscar' },
          { name: 'Actualizar contrato', value: 'actualizar' },
          { name: 'Eliminar contrato', value: 'eliminar' },
          { name: 'Volver al menú principal', value: 'salir' }
        ]
      }
    ]);

    switch (opcion) {
      case 'crear': await crearContrato(); break;
      case 'listar': await listarContratos(); break;
      case 'buscar': await buscarContratoPorId(); break;
      case 'actualizar': await actualizarContrato(); break;
      case 'eliminar': await eliminarContrato(); break;
      case 'salir': salir = true; break;
    }
  }
}

module.exports = showContratosMenu;
