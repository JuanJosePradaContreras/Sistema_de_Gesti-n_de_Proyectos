// ===========================
// Submenú: Gestión de Finanzas
// Opciones para manejar ingresos, egresos y reportes económicos
// ===========================

const inquirer = require('inquirer');                  // Librería para menús interactivos
const chalkTheme = require('../../config/chalkTheme'); // Tema personalizado para estilos CLI

// Función asincrónica para mostrar el menú de Finanzas
async function showFinanzasMenu() {
  console.clear(); // Limpia la pantalla para mostrar solo el submenú

  // Título del submenú
  console.log(chalkTheme.section('\n[Gestión de Finanzas]\n'));

  // Menú de opciones
  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'finanzasOption',
      message: chalkTheme.title('Selecciona una acción:'),
      loop: false, // Desactiva navegación infinita entre opciones
      choices: [
        chalkTheme.option('1. Registrar ingreso'),
        chalkTheme.option('2. Registrar gasto'),
        chalkTheme.option('3. Ver balance general'),
        chalkTheme.option('4. Generar reporte financiero'),
        new inquirer.Separator(),
        chalkTheme.exit('0. Volver al menú principal')
      ]
    }
  ]);

  return answer.finanzasOption;
}

// Exportamos la función para que pueda ser usada en el flujo principal
module.exports = showFinanzasMenu;