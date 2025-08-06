const { ObjectId } = require('mongodb');
const inquirer = require('inquirer');
const chalkTheme = require('../config/chalkTheme');
const getDB = require('../config/mongoClient');

// Crear un nuevo proyecto vinculado a un contrato
async function crearProyecto() {
  const db = await getDB();

  // Buscar todos los contratos registrados
  const contratos = await db.collection('contratos').find().toArray();

  if (contratos.length === 0) {
    console.log(chalkTheme.error('\n⚠️ No hay contratos registrados. Debes crear uno antes de agregar proyectos.\n'));
    return;
  }

  // Seleccionar contrato existente
  const { contratoId } = await inquirer.prompt([
    {
      type: 'list',
      name: 'contratoId',
      message: 'Selecciona el contrato al que pertenece este proyecto:',
      choices: contratos.map(c => ({
        name: `${c.titulo} - Cliente: ${c.clienteNombre || 'No especificado'}`,
        value: c._id.toString()
      }))
    }
  ]);

  const contratoSeleccionado = contratos.find(c => c._id.toString() === contratoId);

  // Recolectar datos del proyecto
  const { titulo, descripcion, estado } = await inquirer.prompt([
    { type: 'input', name: 'titulo', message: 'Título del proyecto:' },
    { type: 'input', name: 'descripcion', message: 'Descripción del proyecto:' },
    {
      type: 'list',
      name: 'estado',
      message: 'Estado del proyecto:',
      choices: ['Activo', 'En progreso', 'Completado', 'Cancelado']
    }
  ]);

  const nuevoProyecto = {
    contratoId: new ObjectId(contratoId),
    contratoTitulo: contratoSeleccionado.titulo,
    titulo,
    descripcion,
    estado,
    creadoEn: new Date()
  };

  await db.collection('proyectos').insertOne(nuevoProyecto);
  console.log(chalkTheme.success('\n✅ Proyecto creado correctamente y vinculado al contrato.\n'));
}

// Listar proyectos
async function listarProyectos() {
  const db = await getDB();
  const proyectos = await db.collection('proyectos').find().toArray();

  if (proyectos.length === 0) {
    console.log(chalkTheme.warning('\n⚠️ No hay proyectos registrados.\n'));
    return;
  }

  const tabla = proyectos.map((p, i) => ({
    Nº: i + 1,
    Contrato: p.contratoTitulo,
    Título: p.titulo,
    Estado: p.estado
  }));

  console.log('\n📋 Proyectos Registrados:\n');
  console.table(tabla);
}

// Buscar proyectos con filtro
async function buscarProyecto(filtro) {
  const db = await getDB();
  const query = {};

  if (filtro.titulo) query.titulo = { $regex: filtro.titulo, $options: 'i' };
  if (filtro.estado) query.estado = filtro.estado;
  if (filtro.contratoId) query.contratoId = new ObjectId(filtro.contratoId);

  const resultados = await db.collection('proyectos').find(query).toArray();

  if (resultados.length === 0) {
    console.log(chalkTheme.warning('\n❌ No se encontraron proyectos con ese filtro.\n'));
    return;
  }

  console.table(resultados.map((p, i) => ({
    Nº: i + 1,
    Contrato: p.contratoTitulo,
    Título: p.titulo,
    Estado: p.estado
  })));
}

// Actualizar un proyecto por ID
async function actualizarProyecto(id, datos) {
  const db = await getDB();
  const resultado = await db.collection('proyectos').updateOne(
    { _id: new ObjectId(id) },
    { $set: datos }
  );

  if (resultado.modifiedCount === 0) {
    console.log(chalkTheme.warning('\n⚠️ No se modificó ningún documento.'));
  } else {
    console.log(chalkTheme.success('\n✔ Proyecto actualizado correctamente.'));
  }
}

// Eliminar un proyecto por ID
async function eliminarProyecto(id) {
  const db = await getDB();
  const resultado = await db.collection('proyectos').deleteOne({ _id: new ObjectId(id) });

  if (resultado.deletedCount === 0) {
    console.log(chalkTheme.warning('\n⚠️ No se eliminó ningún documento.'));
  } else {
    console.log(chalkTheme.exit('\n✔ Proyecto eliminado correctamente.'));
  }
}

module.exports = {
  crearProyecto,
  listarProyectos,
  buscarProyecto,
  actualizarProyecto,
  eliminarProyecto
};