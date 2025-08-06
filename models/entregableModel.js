const { ObjectId } = require('mongodb');
const inquirer = require('inquirer');
const chalkTheme = require('../config/chalkTheme');
const getDB = require('../config/mongoClient');

// Crear nuevo entregable asociado a un proyecto
async function crearEntregable() {
  const db = await getDB();

  // Obtener todos los proyectos
  const proyectos = await db.collection('proyectos').find().toArray();

  if (proyectos.length === 0) {
    console.log(chalkTheme.warning('\n⚠️ No hay proyectos registrados. Debes crear uno primero.\n'));
    return;
  }

  // Seleccionar proyecto
  const { proyectoId } = await inquirer.prompt([
    {
      type: 'list',
      name: 'proyectoId',
      message: 'Selecciona el proyecto al que pertenece este entregable:',
      choices: proyectos.map(p => ({
        name: `${p.titulo} (Contrato: ${p.contratoTitulo})`,
        value: p._id.toString()
      }))
    }
  ]);

  const proyectoSeleccionado = proyectos.find(p => p._id.toString() === proyectoId);

  // Recolectar datos del entregable
  const datos = await inquirer.prompt([
    { type: 'input', name: 'titulo', message: 'Título del entregable:' },
    { type: 'input', name: 'descripcion', message: 'Descripción del entregable:' },
    { type: 'input', name: 'fechaEntrega', message: 'Fecha de entrega (YYYY-MM-DD):' }
  ]);

  const nuevoEntregable = {
    proyectoId: new ObjectId(proyectoId),
    proyectoTitulo: proyectoSeleccionado.titulo,
    titulo: datos.titulo,
    descripcion: datos.descripcion,
    fechaEntrega: new Date(datos.fechaEntrega),
    creadoEn: new Date()
  };

  const resultado = await db.collection('entregables').insertOne(nuevoEntregable);

  console.log(chalkTheme.success(`\n✅ Entregable creado con ID: ${resultado.insertedId}\n`));
}

// Listar todos los entregables
async function listarEntregables() {
  const db = await getDB();
  const entregables = await db.collection('entregables').find().toArray();

  if (entregables.length === 0) {
    console.log(chalkTheme.warning('\n⚠️ No hay entregables registrados.\n'));
    return;
  }

  const tabla = entregables.map((e, i) => ({
    Nº: i + 1,
    Proyecto: e.proyectoTitulo || 'Sin título',
    Título: e.titulo,
    Descripción: e.descripcion,
    'Fecha de Entrega': e.fechaEntrega
      ? e.fechaEntrega.toISOString().split('T')[0]
      : 'No especificada'
  }));

  console.log(chalkTheme.title('\n📦 Entregables registrados:\n'));
  console.table(tabla);
}
// Actualizar entregable por ID
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
        titulo: nuevosDatos.titulo,
        descripcion: nuevosDatos.descripcion,
        fechaEntrega: new Date(nuevosDatos.fechaEntrega)
      }
    }
  );

  if (resultado.matchedCount === 0) {
    console.log(chalkTheme.warning('\n❌ Entregable no encontrado.'));
  } else {
    console.log(chalkTheme.success('\n✔ Entregable actualizado correctamente.'));
  }
}

// Eliminar entregable por ID
async function eliminarEntregable() {
  const { id } = await inquirer.prompt([
    { type: 'input', name: 'id', message: 'ID del entregable a eliminar:' }
  ]);

  const db = await getDB();
  const resultado = await db.collection('entregables').deleteOne({ _id: new ObjectId(id) });

  if (resultado.deletedCount === 0) {
    console.log(chalkTheme.warning('\n⚠️ Entregable no encontrado.'));
  } else {
    console.log(chalkTheme.exit('\n✔ Entregable eliminado exitosamente.'));
  }
}

module.exports = {
  crearEntregable,
  listarEntregables,
  actualizarEntregable,
  eliminarEntregable
};