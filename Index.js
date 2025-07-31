// ===========================
// Punto de entrada de la aplicación CLI
// Controla el flujo del menú principal y navegación entre módulos

const showMainMenu = require('./commands/mainMenu'); // Importamos el menú principal
const chalkTheme = require('./config/chalkTheme');   // Tema de colores para estilizar textos

// Función principal que inicia la aplicación
async function runApp() {
  let exit = false; // Variable de control para salir del sistema

  while (!exit) {
    // Mostramos el menú principal y capturamos la opción seleccionada
    const selected = await showMainMenu();

    // Evaluamos la opción seleccionada por el usuario
    switch (selected) {
      case chalkTheme.option('1. Gestión de Clientes'):
        console.log(chalkTheme.info('\n[CLIENTES] → Módulo en construcción...\n'));
        break;

      case chalkTheme.option('2. Gestión de Propuestas'):
        console.log(chalkTheme.info('\n[PROPUESTAS] → Módulo en construcción...\n'));
        break;

      case chalkTheme.option('3. Gestión de Proyectos'):
        console.log(chalkTheme.info('\n[PROYECTOS] → Módulo en construcción...\n'));
        break;

      case chalkTheme.option('4. Contratos'):
        console.log(chalkTheme.info('\n[CONTRATOS] → Módulo en construcción...\n'));
        break;

      case chalkTheme.option('5. Entregables'):
        console.log(chalkTheme.info('\n[ENTREGABLES] → Módulo en construcción...\n'));
        break;

      case chalkTheme.option('6. Finanzas'):
        console.log(chalkTheme.info('\n[FINANZAS] → Módulo en construcción...\n'));
        break;

      case chalkTheme.exit('0. Salir'):
        console.log(chalkTheme.exit('\n¡Gracias por usar el gestor de portafolio freelance!\n'));
        exit = true;
        break;

      default:
        console.log(chalkTheme.info('\nOpción no reconocida.\n'));
    }

    // Esperamos un poco antes de volver a mostrar el menú (solo si no se sale)
    if (!exit) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

// Ejecutamos la app
runApp();