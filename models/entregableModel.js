const { ObjectId } = require('mongodb');
const inquirer = require('inquirer');
const chalkTheme = require('../config/chalkTheme');
const getDB = require('../config/mongoClient');

async function crearEntregable() {
  const db = await getDB();
  const entregables = db.collection('entregables');

  const datos = await inquirer.prompt([
    { type: 'input', name: 'titulo', message: 'Título del entregable:' },
    { type: 'input', name: 'descripcion', message: 'Descripción del entregable:' },
    { type: 'input', name: 'fechaEntrega', message: 'Fecha de entrega (YYYY-MM-DD):' },
    { type: 'input', name: 'contratoId', message: 'ID del contrato asociado:' }
  ]);

  const resultado = await entregables.insertOne({
    ...datos,
    contratoId: new ObjectId(datos.contratoId),
    fechaEntrega: new Date(datos.fechaEntrega)
  });

  console.log(chalkTheme.success('\nEntregable creado con ID: ' + resultado.insertedId));
}

async function listarEntregables() {
  const db = await getDB();
  const entregables = await db.collection('entregables').find().toArray();

  console.log(chalkTheme.title('\nLista de Entregables:\n'));
  entregables.forEach((e, i) => {
    console.log(chalkTheme.option(`${i + 1}. ${e.titulo} - ${e.descripcion} - Fecha: ${e.fechaEntrega.toISOString().split('T')[0]}`));
  });
}

async function actualizarEntregable() {
  const { id } = await inquirer.prompt([
    { type: 'input', name: 'id', message: 'ID del entregable a actualizar:' }
  ]);

  const nuevosDatos = await inquirer.prompt([
    { type: 'input', name: 'titulo', message: 'Nuevo título:' },
    { type: 'input', name: 'descripcion', message: 'Nueva descripción:' },
    { type: 'input', name: 'fechaEntrega', message: 'Nueva fecha de entrega (YYYY-MM-DD):' }
  ]);

  const db = await getDB();
  const resultado = await db.collection('entregables').updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...nuevosDatos,
        fechaEntrega: new Date(nuevosDatos.fechaEntrega)
      }
    }
  );

  if (resultado.matchedCount === 0) {
    console.log(chalkTheme.warning('\nEntregable no encontrado.'));
  } else {
    console.log(chalkTheme.success('\nEntregable actualizado correctamente.'));
  }
}

async function eliminarEntregable() {
  const { id } = await inquirer.prompt([
    { type: 'input', name: 'id', message: 'ID del entregable a eliminar:' }
  ]);

  const db = await getDB();
  const resultado = await db.collection('entregables').deleteOne({ _id: new ObjectId(id) });

  if (resultado.deletedCount === 0) {
    console.log(chalkTheme.warning('\nEntregable no encontrado.'));
  } else {
    console.log(chalkTheme.success('\nEntregable eliminado exitosamente.'));
  }
}

module.exports = {
  crearEntregable,
  listarEntregables,
  actualizarEntregable,
  eliminarEntregable
};