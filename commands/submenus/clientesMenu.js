// ============================
// Submenú para Gestión de Clientes
// Opciones: Crear, Editar, Eliminar, Listar
// ============================

const inquirer = require('inquirer');
const chalkTheme = require('../../config/chalkTheme');

async function showClientesMenu() {
  console.clear();
  console.log(chalkTheme.section('\n[Gestión de Clientes]\n'));

  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'clienteOption',
      message: chalkTheme.title('¿Qué acción deseas realizar?'),
      loop: false,
      choices: [
        chalkTheme.option('1. Registrar nuevo cliente'),      // CT1
        chalkTheme.option('2. Editar cliente existente'),     // CT2
        chalkTheme.option('3. Eliminar cliente'),             // CT3
        chalkTheme.option('4. Ver todos los clientes'),       // (Visualización adicional)
        chalkTheme.exit('0. Volver al menú principal')
      ]
    }
  ]);

  return answer.clienteOption;
}

module.exports = showClientesMenu;