// ===============================
// CRUD de contratos (MongoDB Native + Inquirer)
// ===============================

const { ObjectId } = require('mongodb');
const inquirer = require('inquirer');
const chalkTheme = require('../config/chalkTheme');
const getDB = require('../config/mongoClient');

async function crearContrato() {
  const db = await getDB();
  const contratos = db.collection('contratos');

  const datos = await inquirer.prompt([
    { type: 'input', name: 'clienteId', message: 'ID del cliente asociado:' },
    { type: 'input', name: 'descripcion', message: 'Descripción del contrato:' },
    { type: 'number', name: 'valor', message: 'Valor del contrato:' },
    { type: 'input', name: 'fechaInicio', message: 'Fecha de inicio (YYYY-MM-DD):' },
    { type: 'input', name: 'fechaFin', message: 'Fecha de fin (YYYY-MM-DD):' }
  ]);

  datos.clienteId = new ObjectId(datos.clienteId);

  const resultado = await contratos.insertOne(datos);
  console.log(chalkTheme.success('\nContrato creado con ID: ' + resultado.insertedId));
}

async function listarContratos() {
  const db = await getDB();
  const contratos = await db.collection('contratos').find().toArray();

  console.log(chalkTheme.title('\nLista de Contratos:\n'));
  contratos.forEach((c, i) => {
    console.log(chalkTheme.option(`${i + 1}. Cliente ID: ${c.clienteId} | Valor: $${c.valor}`));
  });
}

async function buscarContratoPorId() {
  const { id } = await inquirer.prompt([
    { type: 'input', name: 'id', message: 'ID del contrato a buscar:' }
  ]);

  try {
    const db = await getDB();
    const contrato = await db.collection('contratos').findOne({ _id: new ObjectId(id) });

    if (!contrato) {
      console.log(chalkTheme.warning('\nContrato no encontrado.'));
    } else {
      console.log(chalkTheme.info('\nContrato encontrado:'));
      console.log(contrato);
    }
  } catch {
    console.log(chalkTheme.error('\nID inválido.'));
  }
}

async function actualizarContrato() {
  const { id } = await inquirer.prompt([
    { type: 'input', name: 'id', message: 'ID del contrato a actualizar:' }
  ]);

  const nuevosDatos = await inquirer.prompt([
    { type: 'input', name: 'descripcion', message: 'Nueva descripción:' },
    { type: 'number', name: 'valor', message: 'Nuevo valor:' },
    { type: 'input', name: 'fechaInicio', message: 'Nueva fecha de inicio (YYYY-MM-DD):' },
    { type: 'input', name: 'fechaFin', message: 'Nueva fecha de fin (YYYY-MM-DD):' }
  ]);

  try {
    const db = await getDB();
    const resultado = await db.collection('contratos').updateOne(
      { _id: new ObjectId(id) },
      { $set: nuevosDatos }
    );

    if (resultado.matchedCount === 0) {
      console.log(chalkTheme.warning('\nContrato no encontrado.'));
    } else {
      console.log(chalkTheme.success('\nContrato actualizado correctamente.'));
    }
  } catch {
    console.log(chalkTheme.error('\nID inválido o error al actualizar.'));
  }
}

async function eliminarContrato() {
  const { id } = await inquirer.prompt([
    { type: 'input', name: 'id', message: 'ID del contrato a eliminar:' }
  ]);

  try {
    const db = await getDB();
    const resultado = await db.collection('contratos').deleteOne({ _id: new ObjectId(id) });

    if (resultado.deletedCount === 0) {
      console.log(chalkTheme.warning('\nContrato no encontrado.'));
    } else {
      console.log(chalkTheme.success('\nContrato eliminado exitosamente.'));
    }
  } catch {
    console.log(chalkTheme.error('\nID inválido o error al eliminar.'));
  }
}

module.exports = {
  crearContrato,
  listarContratos,
  buscarContratoPorId,
  actualizarContrato,
  eliminarContrato
};