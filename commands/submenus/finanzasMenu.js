const inquirer = require('inquirer');
const chalkTheme = require('../../config/chalkTheme');
const {
  registrarMovimiento,
  listarMovimientos,
  actualizarMovimiento,
  eliminarMovimiento
} = require('../../models/finanzasModel');

async function showFinanzasMenu() {
  let salir = false;

  while (!salir) {
    const { opcion } = await inquirer.prompt([{
      type: 'list',
      name: 'opcion',
      message: chalkTheme.section('\nGestión de Finanzas'),
      choices: [
        'Registrar ingreso o gasto',
        'Listar movimientos',
        'Actualizar movimiento',
        'Eliminar movimiento',
        'Volver al menú principal'
      ]
    }]);

    switch (opcion) {
      case 'Registrar ingreso o gasto':
        await registrarMovimiento();
        break;
      case 'Listar movimientos':
        await listarMovimientos();
        break;
      case 'Actualizar movimiento':
        await actualizarMovimiento();
        break;
      case 'Eliminar movimiento':
        await eliminarMovimiento();
        break;
      case 'Volver al menú principal':
        salir = true;
        break;
    }
  }
}

module.exports = showFinanzasMenu;