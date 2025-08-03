const { ObjectId } = require('mongodb');
const inquirer = require('inquirer');
const chalkTheme = require('../config/chalkTheme');
const getDB = require('../config/mongoClient');

/**
 * Crear un nuevo proyecto
 */
async function crearProyecto() {
  const db = await getDB();
  const proyectos = db.collection('proyectos');

  const datos = await inquirer.prompt([
    { type: 'input', name: 'titulo', message: 'Título del proyecto:' },
    { type: 'input', name: 'cliente', message: 'Cliente asociado:' },
    { type: 'editor', name: 'descripcion', message: 'Descripción del proyecto:' },
    { type: 'input', name: 'fechaInicio', message: 'Fecha de inicio (YYYY-MM-DD):' },
    { type: 'input', name: 'fechaEntrega', message: 'Fecha estimada de entrega (YYYY-MM-DD):' }
  ]);

  const resultado = await proyectos.insertOne({
    ...datos,
    fechaInicio: new Date(datos.fechaInicio),
    fechaEntrega: new Date(datos.fechaEntrega),
  });

  console.log(chalkTheme.success(`\nProyecto creado con ID: ${resultado.insertedId}`));
}

/**
 * Listar todos los proyectos
 */
async function listarProyectos() {
  const db = await getDB();
  const proyectos = await db.collection('proyectos').find().toArray();

  console.log(chalkTheme.title('\nListado de Proyectos:\n'));
  proyectos.forEach((p, i) => {
    console.log(chalkTheme.option(`${i + 1}. ${p.titulo} - Cliente: ${p.cliente}`));
  });
}

/**
 * Buscar proyecto por ID
 */
async function buscarProyectoPorId() {
  const { id } = await inquirer.prompt([
    { type: 'input', name: 'id', message: 'ID del proyecto a buscar:' }
  ]);

  try {
    const db = await getDB();
    const proyecto = await db.collection('proyectos').findOne({ _id: new ObjectId(id) });

    if (!proyecto) {
      console.log(chalkTheme.warning('\nProyecto no encontrado.'));
    } else {
      console.log(chalkTheme.info('\nDetalles del Proyecto:'));
      console.log(proyecto);
    }
  } catch {
    console.log(chalkTheme.error('\nID inválido.'));
  }
}

/**
 * Actualizar proyecto
 */
async function actualizarProyecto() {
  const { id } = await inquirer.prompt([
    { type: 'input', name: 'id', message: 'ID del proyecto a actualizar:' }
  ]);

  const nuevosDatos = await inquirer.prompt([
    { type: 'input', name: 'titulo', message: 'Nuevo título:' },
    { type: 'input', name: 'cliente', message: 'Nuevo cliente:' },
    { type: 'editor', name: 'descripcion', message: 'Nueva descripción:' },
    { type: 'input', name: 'fechaInicio', message: 'Nueva fecha de inicio (YYYY-MM-DD):' },
    { type: 'input', name: 'fechaEntrega', message: 'Nueva fecha de entrega (YYYY-MM-DD):' }
  ]);

  const db = await getDB();
  const resultado = await db.collection('proyectos').updateOne(
    { _id: new ObjectId(id) },
    {
      $set: {
        ...nuevosDatos,
        fechaInicio: new Date(nuevosDatos.fechaInicio),
        fechaEntrega: new Date(nuevosDatos.fechaEntrega)
      }
    }
  );

  if (resultado.matchedCount === 0) {
    console.log(chalkTheme.warning('\nProyecto no encontrado.'));
  } else {
    console.log(chalkTheme.success('\nProyecto actualizado correctamente.'));
  }
}

/**
 * Eliminar proyecto
 */
async function eliminarProyecto() {
  const { id } = await inquirer.prompt([
    { type: 'input', name: 'id', message: 'ID del proyecto a eliminar:' }
  ]);

  const db = await getDB();
  const resultado = await db.collection('proyectos').deleteOne({ _id: new ObjectId(id) });

  if (resultado.deletedCount === 0) {
    console.log(chalkTheme.warning('\nProyecto no encontrado.'));
  } else {
    console.log(chalkTheme.success('\nProyecto eliminado exitosamente.'));
  }
}

module.exports = {
  crearProyecto,
  listarProyectos,
  buscarProyectoPorId,
  actualizarProyecto,
  eliminarProyecto
};