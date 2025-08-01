// ===============================
// Tema de colores con Chalk para estilizar textos
// ===============================

const chalk = require('chalk');

// Creamos un objeto con diferentes estilos de texto
const chalkTheme = {
  banner: chalk.hex("#FFD700").bold,          // Amarillo oro para títulos principales
  title: chalk.hex("#00BFFF").bold,           // Azul cielo brillante para títulos
  option: chalk.hex("#7FFF00"),               // Verde claro para opciones del menú
  exit: chalk.hex("#FF4500").bold,            // Rojo anaranjado para "salir"
  info: chalk.hex("#B0C4DE"),                 // Azul grisáceo para mensajes informativos
  section: chalk.hex("#DA70D6").bold.underline // 💡 Agrega esta línea para el submenú
};

module.exports = chalkTheme;