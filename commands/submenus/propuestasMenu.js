// ===============================================
// Submenú para la Gestión de Propuestas
// ===============================================

const inquirer = require('inquirer');
const chalkTheme = require('../../config/chalkTheme');

async function showPropuestasMenu() {
  console.clear();
  console.log(chalkTheme.section('\n[Gestión de Propuestas]\n'));

  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'propuestaOption',
      message: chalkTheme.title('¿Qué deseas hacer?'),
      loop: false,
      choices: [
        chalkTheme.option('1. Registrar nueva propuesta'),
        chalkTheme.option('2. Ver propuestas registradas'),
        chalkTheme.option('3. Editar propuesta existente'),
        chalkTheme.exit('0. Volver al menú principal')
      ]
    }
  ]);

  // Retornamos la opción seleccionada al menú principal
  return answer.propuestaOption;
}

module.exports = showPropuestasMenu;