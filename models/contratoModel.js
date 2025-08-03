// ===============================
// CRUD de contratos (MongoDB Native + Inquirer)
// ===============================

// models/contratoModel.js

const inquirer = require('inquirer');
const { ObjectId } = require('mongodb');
const getDB = require('../config/mongoClient');
const chalkTheme = require('../config/chalkTheme');

// Crear contrato
async function crearContrato() {
  const db = await getDB();

  // Obtener lista de clientes
  const clientes = await db.collection('clientes').find().toArray();

  if (clientes.length === 0) {
    console.log(chalkTheme.exit('\nNo hay clientes disponibles. Crea uno antes de generar un contrato.\n'));
    return;
  }

  // Mostrar clientes para seleccionar
  const { clienteId } = await inquirer.prompt([
    {
      type: 'list',
      name: 'clienteId',
      message: 'Selecciona un cliente para este contrato:',
      choices: clientes.map(c => ({
        name: `${c.nombre} (${c.email || 'sin email'})`,
        value: c._id.toString()
      }))
    }
  ]);

  const clienteSeleccionado = clientes.find(c => c._id.toString() === clienteId);

  // Formulario de contrato
  const contrato = await inquirer.prompt([
    {
      type: 'input',
      name: 'freelance',
      message: 'Nombre del freelance:'
    },
    {
      type: 'input',
      name: 'proyecto',
      message: 'Nombre del proyecto:'
    },
    {
      type: 'list',
      name: 'tipo',
      message: 'Tipo de contrato:',
      choices: ['Por proyecto', 'Por horas', 'Retainer']
    },
    {
      type: 'list',
      name: 'estado',
      message: 'Estado del contrato:',
      choices: ['Activo', 'Finalizado', 'Cancelado']
    },
    {
      type: 'input',
      name: 'fecha',
      message: 'Fecha de inicio del contrato (YYYY-MM-DD):'
    },
    {
      type: 'number',
      name: 'monto',
      message: 'Monto del contrato (USD):'
    }
  ]);

  // Asociar cliente seleccionado
  contrato.clienteId = new ObjectId(clienteId);
  contrato.clienteNombre = clienteSeleccionado.nombre;

  const resultado = await db.collection('contratos').insertOne(contrato);

  console.log(chalkTheme.success('\nContrato creado con ID: ' + resultado.insertedId + '\n'));
}
// Listar contratos
async function listarContratos() {
  try {
    const db = await getDB();
    const contratos = await db.collection('contratos').find().toArray();

    if (contratos.length === 0) {
      console.log(chalkTheme.info('\nNo hay contratos registrados.\n'));
      return;
    }

    console.log(chalkTheme.section('\nLista de Contratos:\n'));
    console.table(
      contratos.map(c => ({
        ID: c._id.toString(),
        Cliente: c.cliente || 'N/A',
        Proyecto: c.proyecto || 'N/A',
        Fecha: c.fecha || 'N/A',
        Monto: `$${c.monto || 0}`
      }))
    );
  } catch (error) {
    console.log(chalkTheme.exit('\nError al listar contratos: '), error.message);
  }
}
// Buscar contrato
async function buscarContrato() {
  const db = await getDB();

  const { criterio } = await inquirer.prompt([
    {
      type: 'list',
      name: 'criterio',
      message: '¿Cómo deseas buscar el contrato?',
      choices: [
        'Por ID',
        'Por nombre del freelance',
        'Por estado',
        'Por tipo de contrato'
      ]
    }
  ]);

  let filtro = {};

  switch (criterio) {
    case 'Por ID':
      const { id } = await inquirer.prompt([
        {
          type: 'input',
          name: 'id',
          message: 'Ingresa el ID del contrato:'
        }
      ]);
      try {
        filtro = { _id: new ObjectId(id) };
      } catch {
        console.log(chalkTheme.exit('\nID inválido.\n'));
        return;
      }
      break;

    case 'Por nombre del freelance':
      const { freelance } = await inquirer.prompt([
        {
          type: 'input',
          name: 'freelance',
          message: 'Nombre del freelance:'
        }
      ]);
      filtro = { freelance: { $regex: freelance, $options: 'i' } };
      break;

    case 'Por estado':
      const { estado } = await inquirer.prompt([
        {
          type: 'list',
          name: 'estado',
          message: 'Estado del contrato:',
          choices: ['Activo', 'Finalizado', 'Cancelado']
        }
      ]);
      filtro = { estado };
      break;

    case 'Por tipo de contrato':
      const { tipo } = await inquirer.prompt([
        {
          type: 'list',
          name: 'tipo',
          message: 'Tipo de contrato:',
          choices: ['Por proyecto', 'Por horas', 'Retainer']
        }
      ]);
      filtro = { tipo };
      break;
  }

  const resultados = await db.collection('contratos').find(filtro).toArray();

  if (resultados.length === 0) {
    console.log(chalkTheme.info('\nNo se encontraron contratos con ese criterio.\n'));
    return;
  }

  console.log(chalkTheme.section('\nResultados encontrados:\n'));
  console.table(
    resultados.map(c => ({
      ID: c._id.toString(),
      Freelance: c.freelance || 'N/A',
      Proyecto: c.proyecto || 'N/A',
      Tipo: c.tipo || 'N/A',
      Estado: c.estado || 'N/A',
      Fecha: c.fecha || 'N/A',
      Monto: `$${c.monto || 0}`
    }))
  );
}

// Actualizar contrato
async function actualizarContrato() {
  const db = await getDB();
  const contratos = db.collection('contratos');

  const { id } = await inquirer.prompt([
    { name: 'id', message: 'ID del contrato a actualizar:' }
  ]);

  let contrato;
  try {
    contrato = await contratos.findOne({ _id: new ObjectId(id) });
    if (!contrato) throw new Error();
  } catch {
    console.log(chalkTheme.error('ID no válido o contrato no encontrado.'));
    return;
  }

  const campos = Object.keys(contrato).filter(k => k !== '_id');
  const { campo, nuevoValor } = await inquirer.prompt([
    {
      type: 'list',
      name: 'campo',
      message: '¿Qué campo deseas actualizar?',
      choices: campos
    },
    {
      type: 'input',
      name: 'nuevoValor',
      message: 'Ingresa el nuevo valor:'
    }
  ]);

  const result = await contratos.updateOne(
    { _id: contrato._id },
    { $set: { [campo]: nuevoValor } }
  );

  console.log(chalkTheme.success(`Contrato actualizado. Campos modificados: ${result.modifiedCount}`));
}

// Eliminar contrato
async function eliminarContrato() {
  const db = await getDB();
  const contratos = db.collection('contratos');

  const { id } = await inquirer.prompt([
    { name: 'id', message: 'ID del contrato a eliminar:' }
  ]);

  try {
    const confirm = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmDelete',
        message: '¿Estás seguro de eliminar este contrato?',
        default: false
      }
    ]);

    if (!confirm.confirmDelete) {
      console.log(chalkTheme.info('Eliminación cancelada.'));
      return;
    }

    const result = await contratos.deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 0) {
      console.log(chalkTheme.warning('Contrato no encontrado.'));
    } else {
      console.log(chalkTheme.success('Contrato eliminado correctamente.'));
    }
  } catch {
    console.log(chalkTheme.error('ID inválido.'));
  }
}

module.exports = {
  crearContrato,
  listarContratos,
  buscarContrato,
  actualizarContrato,
  eliminarContrato
};