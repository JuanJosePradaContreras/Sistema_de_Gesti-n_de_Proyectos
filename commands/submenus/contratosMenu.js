// ===========================
// Submenú: Gestión de Contratos
// Este módulo muestra opciones relacionadas con la gestión de contratos freelance
// ===========================

// Importamos inquirer para crear menús interactivos
const inquirer = require('inquirer');
// Importamos tema personalizado para aplicar estilos
const chalkTheme = require('../../config/chalkTheme');

// Función asincrónica que muestra el submenú de Contratos
async function showContratosMenu() {
  console.clear(); // Limpia consola antes de mostrar menú

  // Título estilizado del submenú
  console.log(chalkTheme.section('\n[Gestión de Contratos]\n'));

  // Desplegamos las opciones del submenú
  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'contratoOption',
      message: chalkTheme.title('¿Qué deseas hacer?'),
      loop: false, // Impide el bucle visual de las opciones
      choices: [
        chalkTheme.option('1. Crear nuevo contrato'),
        chalkTheme.option('2. Ver contratos existentes'),
        chalkTheme.option('3. Editar un contrato'),
        chalkTheme.option('4. Cancelar contrato'),
        new inquirer.Separator(),
        chalkTheme.exit('0. Volver al menú principal')
      ]
    }
  ]);

  // Devolvemos la opción seleccionada
  return answer.contratoOption;
}

// Exportamos la función para su uso en index.js
module.exports = showContratosMenu;