const { ObjectId } = require('mongodb');
const inquirer = require('inquirer');
const chalkTheme = require('../config/chalkTheme');
const getDB = require('../config/mongoClient');


async function crearProyecto() {
  const db = await getDB();

  // Buscar cliente por nombre
  const { nombreCliente } = await inquirer.prompt([
    {
      type: 'input',
      name: 'nombreCliente',
      message: 'Nombre del cliente:'
    }
  ]);

  const cliente = await db.collection('clientes').findOne({
    nombre: { $regex: new RegExp(nombreCliente, 'i') }
  });

  if (!cliente) {
    console.log(chalkTheme.error('\nCliente no encontrado. Por favor créalo primero.\n'));
    return;
  }

  // Pedir datos esenciales del proyecto
  const { titulo, descripcion, estado } = await inquirer.prompt([
    {
      type: 'input',
      name: 'titulo',
      message: 'Título del proyecto:'
    },
    {
      type: 'input',
      name: 'descripcion',
      message: 'Descripción del proyecto:'
    },
    {
      type: 'list',
      name: 'estado',
      message: 'Estado del proyecto:',
      choices: ['Activo', 'En progreso', 'Completado', 'Cancelado']
    }
  ]);

  // Insertar solo los campos necesarios
  const nuevoProyecto = {
    cliente: cliente.nombre,
    titulo,
    descripcion,
    estado,
    creadoEn: new Date()
  };

  await db.collection('proyectos').insertOne(nuevoProyecto);
  console.log(chalkTheme.success('\n✅ Proyecto creado exitosamente.\n'));
}

module.exports = {
  crearProyecto
};

async function listarProyectos() {
  const db = await getDB();
  const proyectos = await db.collection('proyectos').find().toArray();

  if (proyectos.length === 0) {
    console.log(chalkTheme.warning('\n⚠️  No hay proyectos registrados.\n'));
    return;
  }

  // Mapear solo los campos relevantes para mostrar en tabla
  const tabla = proyectos.map((p, i) => ({
    Nº: i + 1,
    Cliente: p.cliente,
    Título: p.titulo,
    Descripción: p.descripcion,
    Estado: p.estado
  }));

  console.log('\nProyectos Registrados:\n');
  console.table(tabla);
}

async function buscarProyecto(filtro) {
  const db = await getDB();
  const query = {};

  if (filtro.nombre) query.nombre = { $regex: filtro.nombre, $options: 'i' };
  if (filtro.estado) query.estado = filtro.estado;
  if (filtro.tipo) query.tipo = filtro.tipo;
  if (filtro.cliente_id) query.cliente_id = new ObjectId(filtro.cliente_id);

  const resultados = await db.collection('proyectos').find(query).toArray();
  console.table(resultados);
}

async function actualizarProyecto(id, datos) {
  const db = await getDB();
  const resultado = await db.collection('proyectos').updateOne(
    { _id: new ObjectId(id) },
    { $set: datos }
  );
  console.log(chalkTheme.success(`\n✔ Proyecto actualizado (${resultado.modifiedCount} documento modificado)`));
}

async function eliminarProyecto(id) {
  const db = await getDB();
  const resultado = await db.collection('proyectos').deleteOne({ _id: new ObjectId(id) });
  console.log(chalkTheme.exit(`\n✔ Proyecto eliminado (${resultado.deletedCount} documento eliminado)`));
}

module.exports = {
  crearProyecto,
  listarProyectos,
  buscarProyecto,
  actualizarProyecto,
  eliminarProyecto
};