const { ObjectId } = require('mongodb');
const inquirer = require('inquirer');
const chalkTheme = require('../config/chalkTheme');
const getDB = require('../config/mongoClient');

async function registrarMovimiento() {
  const db = await getDB();
  const finanzas = db.collection('finanzas');

  const datos = await inquirer.prompt([
    { type: 'list', name: 'tipo', message: 'Tipo de movimiento:', choices: ['Ingreso', 'Gasto'] },
    { type: 'input', name: 'descripcion', message: 'Descripción:' },
    { type: 'number', name: 'monto', message: 'Monto (número positivo):' },
    { type: 'input', name: 'fecha', message: 'Fecha (YYYY-MM-DD):' }
  ]);

  const resultado = await finanzas.insertOne({
    ...datos,
    fecha: new Date(datos.fecha),
    monto: parseFloat(datos.monto)
  });

  console.log(chalkTheme.success(`\nMovimiento registrado con ID: ${resultado.insertedId}`));
}

async function listarMovimientos() {
  const db = await getDB();
  const movimientos = await db.collection('finanzas').find().toArray();

  console.log(chalkTheme.title('\nRegistro financiero:\n'));
  movimientos.forEach((m, i) => {
    const color = m.tipo === 'Ingreso' ? chalkTheme.option : chalkTheme.exit;
    console.log(color(`${i + 1}. [${m.tipo}] ${m.descripcion} - $${m.monto} - ${m.fecha.toISOString().split('T')[0]}`));
  });
}

async function actualizarMovimiento() {
  const { id } = await inquirer.prompt([
    { type: 'input', name: 'id', message: 'ID del movimiento a actualizar:' }
  ]);

  const nuevosDatos = await inquirer.prompt([
    { type: 'list', name: 'tipo', message: 'Nuevo tipo:', choices: ['Ingreso', 'Gasto'] },
    { type: 'input', name: 'descripcion', message: 'Nueva descripción:' },
    { type: 'number', name: 'monto', message: 'Nuevo monto:' },
    { type: 'input', name: 'fecha', message: 'Nueva fecha (YYYY-MM-DD):' }
  ]);

  const db = await getDB();
  const resultado = await db.collection('finanzas').updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...nuevosDatos,
        fecha: new Date(nuevosDatos.fecha),
        monto: parseFloat(nuevosDatos.monto)
      }
    }
  );

  if (resultado.matchedCount === 0) {
    console.log(chalkTheme.warning('\nMovimiento no encontrado.'));
  } else {
    console.log(chalkTheme.success('\nMovimiento actualizado correctamente.'));
  }
}

async function eliminarMovimiento() {
  const { id } = await inquirer.prompt([
    { type: 'input', name: 'id', message: 'ID del movimiento a eliminar:' }
  ]);

  const db = await getDB();
  const resultado = await db.collection('finanzas').deleteOne({ _id: new ObjectId(id) });

  if (resultado.deletedCount === 0) {
    console.log(chalkTheme.warning('\nMovimiento no encontrado.'));
  } else {
    console.log(chalkTheme.success('\nMovimiento eliminado exitosamente.'));
  }
}

module.exports = {
  registrarMovimiento,
  listarMovimientos,
  actualizarMovimiento,
  eliminarMovimiento
};