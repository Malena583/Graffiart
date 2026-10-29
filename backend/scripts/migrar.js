require('dotenv').config();
const { AppDataSource, initDataSource } = require('../src/lib/data-source');

async function migrar() {
  await initDataSource();
  const ejecutadas = await AppDataSource.runMigrations();

  if (ejecutadas.length === 0) {
    console.log('No hay migraciones pendientes.');
    return;
  }

  ejecutadas.forEach((migracion) => {
    console.log(`Migración ejecutada: ${migracion.name}`);
  });
}

migrar()
  .catch((error) => {
    console.error('Error al ejecutar las migraciones:', error.message || error);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (AppDataSource.isInitialized) await AppDataSource.destroy();
  });