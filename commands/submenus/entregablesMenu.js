// ===========================
// Submenú: Gestión de Entregables
// Muestra opciones para administrar entregables dentro del sistema de portafolio freelance
// ===========================

// Importamos inquirer para preguntas interactivas en CLI
const inquirer = require('inquirer');
// Importamos el tema de colores personalizado
const chalkTheme = require('../../config/chalkTheme');

// Función que muestra el submenú de Entregables
async function showEntregablesMenu() {
  console.clear(); // Limpia la consola antes de mostrar el menú

  // Título del submenú estilizado
  console.log(chalkTheme.section('\n[Gestión de Entregables]\n'));

  // Menú de opciones
  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'entregableOption',
      message: chalkTheme.title('Selecciona una acción:'),
      loop: false, // Desactiva el loop de navegación circular en el menú
      choices: [
        chalkTheme.option('1. Agregar nuevo entregable'),
        chalkTheme.option('2. Ver lista de entregables'),
        chalkTheme.option('3. Marcar entregable como finalizado'),
        chalkTheme.option('4. Eliminar entregable'),
        new inquirer.Separator(),
        chalkTheme.exit('0. Volver al menú principal')
      ]
    }
  ]);

  // Retorna la opción seleccionada
  return answer.entregableOption;
}

// Exportamos la función para integrarla al flujo principal
module.exports = showEntregablesMenu;