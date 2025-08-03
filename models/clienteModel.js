// ===========================================
// Módulo centralizado con la lógica CRUD para clientes
// Utiliza MongoDB Native y Inquirer para entrada interactiva
// ===========================================

const { ObjectId } = require('mongodb');
const inquirer = require('inquirer');
const chalkTheme = require('../config/chalkTheme');
const { getDB } = require('../config/mongoClient');

/**
 * Crea un nuevo cliente a partir de datos ingresados por el usuario.
 */
async function crearCliente() {
  const db = await getDB();
  const clientes = db.collection('clientes');

  const datos = await inquirer.prompt([
    { type: 'input', name: 'nombre', message: 'Nombre del cliente:' },
    { type: 'input', name: 'correo', message: 'Correo electrónico:' },
    { type: 'input', name: 'telefono', message: 'Teléfono de contacto:' }
  ]);

  const resultado = await clientes.insertOne(datos);
  console.log(chalkTheme.success('\nCliente creado con ID: ' + resultado.insertedId));
}

/**
 * Lista todos los clientes almacenados en la base de datos.
 */
async function listarClientes() {
  const db = await getDB();
  const clientes = await db.collection('clientes').find().toArray();

  console.log(chalkTheme.title('\nLista de Clientes:\n'));
  clientes.forEach((cliente, i) => {
    console.log(chalkTheme.option(`${i + 1}. ${cliente.nombre} - ${cliente.correo}`));
  });
}

/**
 * Busca un cliente por su ID y muestra los datos.
 */
async function buscarClientePorId() {
  const { id } = await inquirer.prompt([
    { type: 'input', name: 'id', message: 'ID del cliente a buscar:' }
  ]);

  try {
    const db = await getDB();
    const cliente = await db.collection('clientes').findOne({ _id: new ObjectId(id) });

    if (!cliente) {
      console.log(chalkTheme.warning('\nCliente no encontrado.'));
    } else {
      console.log(chalkTheme.info('\nCliente encontrado:'));
      console.log(cliente);
    }
  } catch (err) {
    console.log(chalkTheme.error('\nID inválido.'));
  }
}

/**
 * Actualiza los datos de un cliente por ID.
 */
async function actualizarCliente() {
  const { id } = await inquirer.prompt([
    { type: 'input', name: 'id', message: 'ID del cliente a actualizar:' }
  ]);

  const nuevosDatos = await inquirer.prompt([
    { type: 'input', name: 'nombre', message: 'Nuevo nombre:' },
    { type: 'input', name: 'correo', message: 'Nuevo correo:' },
    { type: 'input', name: 'telefono', message: 'Nuevo teléfono:' }
  ]);

  try {
    const db = await getDB();
    const resultado = await db.collection('clientes').updateOne(
      { _id: new ObjectId(id) },
      { $set: nuevosDatos }
    );

    if (resultado.matchedCount === 0) {
      console.log(chalkTheme.warning('\nCliente no encontrado.'));
    } else {
      console.log(chalkTheme.success('\nCliente actualizado correctamente.'));
    }
  } catch {
    console.log(chalkTheme.error('\nID inválido o error al actualizar.'));
  }
}

/**
 * Elimina un cliente por ID.
 */
async function eliminarCliente() {
  const { id } = await inquirer.prompt([
    { type: 'input', name: 'id', message: 'ID del cliente a eliminar:' }
  ]);

  try {
    const db = await getDB();
    const resultado = await db.collection('clientes').deleteOne({ _id: new ObjectId(id) });

    if (resultado.deletedCount === 0) {
      console.log(chalkTheme.warning('\nCliente no encontrado.'));
    } else {
      console.log(chalkTheme.success('\nCliente eliminado exitosamente.'));
    }
  } catch {
    console.log(chalkTheme.error('\nID inválido o error al eliminar.'));
  }
}

// Exportamos las funciones para el submenú
module.exports = {
  crearCliente,
  listarClientes,
  buscarClientePorId,
  actualizarCliente,
  eliminarCliente
};