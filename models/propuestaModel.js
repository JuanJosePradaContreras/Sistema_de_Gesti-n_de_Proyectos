const { ObjectId } = require('mongodb');
const inquirer = require('inquirer');
const chalkTheme = require('../config/chalkTheme');
const getDB = require('../config/mongoClient');

async function crearPropuesta() {
  const db = await getDB();
  const propuestas = db.collection('propuestas');

  const datos = await inquirer.prompt([
    { type: 'input', name: 'titulo', message: 'Título de la propuesta:' },
    { type: 'input', name: 'cliente', message: 'Nombre del cliente:' },
    { type: 'editor', name: 'contenido', message: 'Contenido o descripción de la propuesta:' },
    { type: 'input', name: 'fecha', message: 'Fecha (YYYY-MM-DD):' },
  ]);

  const resultado = await propuestas.insertOne({
    ...datos,
    fecha: new Date(datos.fecha),
  });

  console.log(chalkTheme.success(`\nPropuesta creada con ID: ${resultado.insertedId}`));
}

async function listarPropuestas() {
  const db = await getDB();
  const propuestas = await db.collection('propuestas').find().toArray();

  console.log(chalkTheme.title('\nListado de Propuestas:\n'));
  propuestas.forEach((p, i) => {
    console.log(chalkTheme.option(`${i + 1}. ${p.titulo} - Cliente: ${p.cliente} - Fecha: ${p.fecha.toISOString().split('T')[0]}`));
  });
}

async function buscarPropuestaPorId() {
  const { id } = await inquirer.prompt([
    { type: 'input', name: 'id', message: 'ID de la propuesta a buscar:' }
  ]);

  try {
    const db = await getDB();
    const propuesta = await db.collection('propuestas').findOne({ _id: new ObjectId(id) });

    if (!propuesta) {
      console.log(chalkTheme.warning('\nPropuesta no encontrada.'));
    } else {
      console.log(chalkTheme.info('\nDetalles de la propuesta:'));
      console.log(propuesta);
    }
  } catch {
    console.log(chalkTheme.error('\nID inválido.'));
  }
}

async function actualizarPropuesta() {
  const { id } = await inquirer.prompt([
    { type: 'input', name: 'id', message: 'ID de la propuesta a actualizar:' }
  ]);

  const nuevosDatos = await inquirer.prompt([
    { type: 'input', name: 'titulo', message: 'Nuevo título:' },
    { type: 'input', name: 'cliente', message: 'Nuevo nombre del cliente:' },
    { type: 'editor', name: 'contenido', message: 'Nuevo contenido:' },
    { type: 'input', name: 'fecha', message: 'Nueva fecha (YYYY-MM-DD):' },
  ]);

  const db = await getDB();
  const resultado = await db.collection('propuestas').updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...nuevosDatos,
        fecha: new Date(nuevosDatos.fecha),
      }
    }
  );

  if (resultado.matchedCount === 0) {
    console.log(chalkTheme.warning('\nPropuesta no encontrada.'));
  } else {
    console.log(chalkTheme.success('\nPropuesta actualizada correctamente.'));
  }
}

async function eliminarPropuesta() {
  const { id } = await inquirer.prompt([
    { type: 'input', name: 'id', message: 'ID de la propuesta a eliminar:' }
  ]);

  const db = await getDB();
  const resultado = await db.collection('propuestas').deleteOne({ _id: new ObjectId(id) });

  if (resultado.deletedCount === 0) {
    console.log(chalkTheme.warning('\nPropuesta no encontrada.'));
  } else {
    console.log(chalkTheme.success('\nPropuesta eliminada exitosamente.'));
  }
}

module.exports = {
  crearPropuesta,
  listarPropuestas,
  buscarPropuestaPorId,
  actualizarPropuesta,
  eliminarPropuesta
};