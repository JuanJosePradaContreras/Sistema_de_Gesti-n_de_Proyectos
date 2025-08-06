const { ObjectId } = require('mongodb');
const inquirer = require('inquirer');
const chalkTheme = require('../config/chalkTheme');
const getDB = require('../config/mongoClient');

// Crear una nueva propuesta
async function crearPropuesta() {
  const db = await getDB();
  const propuestas = db.collection('propuestas');
  const clientes = await db.collection('clientes').find().toArray();

  if (clientes.length === 0) {
    console.log(chalkTheme.exit('\nNo hay clientes registrados. Crea un cliente antes de crear una propuesta.\n'));
    return;
  }

  // Selección de cliente desde lista
  const { clienteId } = await inquirer.prompt([
    {
      type: 'list',
      name: 'clienteId',
      message: 'Selecciona un cliente para esta propuesta:',
      choices: clientes.map(c => ({
        name: `${c.nombre} (${c.email || 'sin email'})`,
        value: c._id.toString()
      }))
    }
  ]);

  const clienteSeleccionado = clientes.find(c => c._id.toString() === clienteId);

  const datos = await inquirer.prompt([
    { type: 'input', name: 'titulo', message: 'Título de la propuesta:' },
    { type: 'editor', name: 'contenido', message: 'Contenido o descripción de la propuesta:' },
    { type: 'input', name: 'fecha', message: 'Fecha (YYYY-MM-DD):' },
  ]);

  const resultado = await propuestas.insertOne({
    titulo: datos.titulo,
    contenido: datos.contenido,
    fecha: new Date(datos.fecha),
    clienteId: new ObjectId(clienteId),
    clienteNombre: clienteSeleccionado.nombre,
  });

  console.log(chalkTheme.success(`\nPropuesta creada con ID: ${resultado.insertedId}`));
}

// Listar todas las propuestas
async function listarPropuestas() {
  const db = await getDB();
  const propuestas = await db.collection('propuestas').find().toArray();

  if (propuestas.length === 0) {
    console.log(chalkTheme.warning('\n⚠️ No hay propuestas registradas.\n'));
    return;
  }

  const tabla = propuestas.map((p, i) => ({
    Nº: i + 1,
    Título: p.titulo,
    Cliente: p.cliente,
    Fecha: p.fecha ? p.fecha.toISOString().split('T')[0] : 'Sin fecha',
  }));

  console.log(chalkTheme.title('\n📄 Propuestas registradas:\n'));
  console.table(tabla);
}

// Buscar y ver detalles de una propuesta desde un listado
async function verDetallePropuesta() {
  const db = await getDB();
  const propuestas = await db.collection('propuestas').find().toArray();

  if (propuestas.length === 0) {
    console.log(chalkTheme.info('\nNo hay propuestas registradas.\n'));
    return;
  }

  const { propuestaId } = await inquirer.prompt([
    {
      type: 'list',
      name: 'propuestaId',
      message: 'Selecciona una propuesta para ver detalles:',
      choices: propuestas.map(p => ({
        name: `${p.titulo} (${p.clienteNombre || 'Cliente desconocido'})`,
        value: p._id.toString()
      }))
    }
  ]);

  const propuesta = propuestas.find(p => p._id.toString() === propuestaId);
  console.log(chalkTheme.info('\nDetalles de la propuesta:'));
  console.log(propuesta);
}

// Actualizar una propuesta desde listado
async function actualizarPropuesta() {
  const db = await getDB();
  const propuestas = await db.collection('propuestas').find().toArray();

  if (propuestas.length === 0) {
    console.log(chalkTheme.info('\nNo hay propuestas para actualizar.\n'));
    return;
  }

  const { propuestaId } = await inquirer.prompt([
    {
      type: 'list',
      name: 'propuestaId',
      message: 'Selecciona una propuesta para actualizar:',
      choices: propuestas.map(p => ({
        name: `${p.titulo} (${p.clienteNombre || 'Cliente desconocido'})`,
        value: p._id.toString()
      }))
    }
  ]);

  const nuevosDatos = await inquirer.prompt([
    { type: 'input', name: 'titulo', message: 'Nuevo título:' },
    { type: 'editor', name: 'contenido', message: 'Nuevo contenido:' },
    { type: 'input', name: 'fecha', message: 'Nueva fecha (YYYY-MM-DD):' },
  ]);

  const resultado = await db.collection('propuestas').updateOne(
    { _id: new ObjectId(propuestaId) },
    {
      $set: {
        titulo: nuevosDatos.titulo,
        contenido: nuevosDatos.contenido,
        fecha: new Date(nuevosDatos.fecha),
      }
    }
  );

  if (resultado.modifiedCount > 0) {
    console.log(chalkTheme.success('\nPropuesta actualizada correctamente.'));
  } else {
    console.log(chalkTheme.warning('\nNo se realizó ninguna modificación.'));
  }
}

// Eliminar una propuesta desde listado
async function eliminarPropuesta() {
  const db = await getDB();
  const propuestas = await db.collection('propuestas').find().toArray();

  if (propuestas.length === 0) {
    console.log(chalkTheme.info('\nNo hay propuestas para eliminar.\n'));
    return;
  }

  const { propuestaId } = await inquirer.prompt([
    {
      type: 'list',
      name: 'propuestaId',
      message: 'Selecciona una propuesta para eliminar:',
      choices: propuestas.map(p => ({
        name: `${p.titulo} (${p.clienteNombre || 'Cliente desconocido'})`,
        value: p._id.toString()
      }))
    }
  ]);

  const confirm = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'confirmDelete',
      message: '¿Estás seguro de eliminar esta propuesta?',
      default: false
    }
  ]);

  if (!confirm.confirmDelete) {
    console.log(chalkTheme.info('Eliminación cancelada.'));
    return;
  }

  const result = await db.collection('propuestas').deleteOne({ _id: new ObjectId(propuestaId) });

  if (result.deletedCount === 0) {
    console.log(chalkTheme.warning('\nPropuesta no encontrada o ya eliminada.'));
  } else {
    console.log(chalkTheme.success('\nPropuesta eliminada exitosamente.'));
  }
}

module.exports = {
  crearPropuesta,
  listarPropuestas,
  verDetallePropuesta,
  actualizarPropuesta,
  eliminarPropuesta
};