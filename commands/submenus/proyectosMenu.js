// ===========================
// Submenú: Gestión de Proyectos
// Este módulo muestra opciones relacionadas con la administración de proyectos freelance
// ===========================

// Importamos inquirer para opciones interactivas en consola
const inquirer = require('inquirer');
// Importamos el tema de estilos personalizados (colores, énfasis)
const chalkTheme = require('../../config/chalkTheme');

// Función que muestra el submenú de Gestión de Proyectos
async function showProyectosMenu() {
  console.clear(); // Limpia la consola antes de mostrar el submenú

  // Título del submenú con estilo
  console.log(chalkTheme.section('\n[Gestión de Proyectos]\n'));

  // Opciones del submenú
  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'proyectoOption',
      message: chalkTheme.title('¿Qué deseas hacer?'),
      loop: false, // Evita el bucle visual al llegar a la primera o última opción
      choices: [
        chalkTheme.option('1. Registrar nuevo proyecto'),
        chalkTheme.option('2. Ver todos los proyectos'),
        chalkTheme.option('3. Actualizar información de un proyecto'),
        chalkTheme.option('4. Eliminar un proyecto'),
        new inquirer.Separator(),
        chalkTheme.exit('0. Volver al menú principal')
      ]
    }
  ]);

  // Devolvemos la opción seleccionada
  return answer.proyectoOption;
}

// Exportamos la función para que pueda ser usada en index.js
module.exports = showProyectosMenu;