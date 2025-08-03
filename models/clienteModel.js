// ===============================
// Logica de Clientes
// ===============================

const { ObjectId } = require('mongodb');
const inquirer = require('inquirer');
const chalkTheme = require('../config/chalkTheme');
const getDB = require('../config/mongoClient');


// Validación simple de email
function validarEmail(email) {
  return /^\S+@\S+\.\S+$/.test(email) || 'Correo no válido';
}

// Validación de número
function validarTelefono(telefono) {
  return /^\d{7,15}$/.test(telefono) || 'Teléfono inválido (solo números, 7 a 15 dígitos)';
}

// Crear nuevo cliente
async function crearCliente() {
  const db = await getDB();
  const clientes = db.collection('clientes');

  const datos = await inquirer.prompt([
    { type: 'input', name: 'nombre', message: 'Nombre del cliente:', validate: input => !!input || 'Requerido' },
    { type: 'input', name: 'correo', message: 'Correo electrónico:', validate: validarEmail },
    { type: 'input', name: 'telefono', message: 'Teléfono de contacto:', validate: validarTelefono }
  ]);

  const resultado = await clientes.insertOne(datos);
  console.log(chalkTheme.success('\n✅ Cliente creado con ID: ' + resultado.insertedId));
}

// Listar todos los clientes
async function listarClientes() {
  const db = await getDB();
  const clientes = await db.collection('clientes').find().toArray();

  if (!clientes.length) {
    console.log(chalkTheme.warning('\nNo hay clientes registrados.'));
    return;
  }

  console.log(chalkTheme.title('\n📋 Lista de Clientes:\n'));
  console.table(clientes.map(c => ({
    ID: c._id.toString(),
    Nombre: c.nombre,
    Correo: c.correo,
    Teléfono: c.telefono
  })));
}

// Buscar cliente por nombre, correo o teléfono
async function buscarCliente() {
  const db = await getDB();
  const clientes = db.collection('clientes');

  const { criterio, valor } = await inquirer.prompt([
    {
      type: 'list',
      name: 'criterio',
      message: '¿Buscar por?',
      choices: ['nombre', 'correo', 'ID']
    },
    {
      type: 'input',
      name: 'valor',
      message: 'Ingresa el valor a buscar:'
    }
  ]);

  let query = {};

  if (criterio === 'ID') {
    try {
      query._id = new ObjectId(valor);
    } catch {
      console.log(chalkTheme.error('\nID no válido.'));
      return;
    }
  } else {
    query[criterio] = { $regex: valor, $options: 'i' };
  }

  const resultados = await clientes.find(query).toArray();

  if (resultados.length === 0) {
    console.log(chalkTheme.warning('\nNo se encontraron coincidencias.'));
  } else {
    console.log(chalkTheme.info('\nResultados encontrados:\n'));
    resultados.forEach((cliente, i) => {
      console.log(chalkTheme.option(`${i + 1}. ${cliente.nombre} - ${cliente.correo}`));
    });
  }
}

// Actualizar cliente parcialmente
async function actualizarCliente() {
  const db = await getDB();
  const clientes = db.collection('clientes');

  // Buscar cliente
  const { criterio, valor } = await inquirer.prompt([
    {
      type: 'list',
      name: 'criterio',
      message: 'Buscar cliente por:',
      choices: ['nombre', 'correo', 'ID']
    },
    {
      type: 'input',
      name: 'valor',
      message: 'Ingresa el valor:'
    }
  ]);

  let query = {};
  if (criterio === 'ID') {
    try {
      query._id = new ObjectId(valor);
    } catch {
      console.log(chalkTheme.error('\nID no válido.'));
      return;
    }
  } else {
    query[criterio] = { $regex: valor, $options: 'i' };
  }

  const resultados = await clientes.find(query).toArray();
  if (resultados.length === 0) {
    console.log(chalkTheme.warning('\nNo se encontró ningún cliente.'));
    return;
  }

  let clienteSeleccionado;
  if (resultados.length === 1) {
    clienteSeleccionado = resultados[0];
  } else {
    const { clienteId } = await inquirer.prompt([
      {
        type: 'list',
        name: 'clienteId',
        message: 'Selecciona un cliente:',
        choices: resultados.map(c => ({
          name: `${c.nombre} - ${c.correo}`,
          value: c._id
        }))
      }
    ]);
    clienteSeleccionado = await clientes.findOne({ _id: new ObjectId(clienteId) });
  }

  // Elegir campo a actualizar
  const campos = Object.keys(clienteSeleccionado).filter(k => !['_id'].includes(k));
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

  const result = await clientes.updateOne(
    { _id: clienteSeleccionado._id },
    { $set: { [campo]: nuevoValor } }
  );

  console.log(chalkTheme.success(`\nCliente actualizado correctamente. Campos modificados: ${result.modifiedCount}`));
}

// Eliminar cliente
async function eliminarCliente() {
  const { id } = await inquirer.prompt({
    type: 'input',
    name: 'id',
    message: 'ID del cliente a eliminar:'
  });

  try {
    const db = await getDB();

    const { confirmacion } = await inquirer.prompt({
      type: 'confirm',
      name: 'confirmacion',
      message: '¿Estás seguro de que quieres eliminar este cliente?',
      default: false
    });

    if (!confirmacion) {
      console.log(chalkTheme.warning('\n❎ Eliminación cancelada.'));
      return;
    }

    const resultado = await db.collection('clientes').deleteOne({ _id: new ObjectId(id) });

    if (resultado.deletedCount === 0) {
      console.log(chalkTheme.warning('\n❌ Cliente no encontrado.'));
    } else {
      console.log(chalkTheme.success('\n✅ Cliente eliminado exitosamente.'));
    }
  } catch {
    console.log(chalkTheme.error('\nID inválido o error al eliminar.'));
  }
}

module.exports = {
  crearCliente,
  listarClientes,
  buscarCliente,
  actualizarCliente,
  eliminarCliente
};