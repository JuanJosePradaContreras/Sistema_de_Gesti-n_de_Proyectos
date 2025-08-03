const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri);

let db;

async function getDB() {
  if (!db) {
    try {
      await client.connect();
      console.log('✅ Conectado a MongoDB');
      db = client.db('gestor_portafolio');
    } catch (err) {
      console.error('❌ Error al conectar a MongoDB:', err);
      process.exit(1);
    }
  }
  return db;
}

module.exports = getDB;