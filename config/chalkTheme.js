// ===============================================
// Archivo de configuración de estilos para la CLI
// Utiliza la librería 'chalk@4' para colorear textos
// ===============================================

// Importamos chalk usando CommonJS (válido con chalk@4)
const chalk = require('chalk');

// Exportamos un objeto con diferentes estilos personalizados
module.exports = {
  
  title: chalk.hex("#00BFFF").bold, // Estilo para títulos o encabezados: azul celeste + negrita
  option: chalk.green, // Estilo para opciones interactivas: verde
  exit: chalk.redBright,  // Estilo para la opción de salida: rojo brillante
  info: chalk.whiteBright, // Estilo para mensajes informativos o neutrales: blanco brillante
  banner: chalk.bgMagenta.white.bold // Estilo para banners decorativos: fondo magenta, texto blanco y en negrita
};