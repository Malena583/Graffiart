require('dotenv').config();
const { DataSource } = require('typeorm');
const entities = require('../entities');

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  throw new Error('DATABASE_URL must be set to initialize TypeORM.');
}

const AppDataSource = new DataSource({
  type: 'mysql',
  url: databaseUrl,
  entities,
  synchronize: process.env.DB_SYNCHRONIZE === 'true',
  timezone: 'Z',
});

// Atajo para obtener el repositorio de una entidad por nombre.
const repo = (name) => AppDataSource.getRepository(name);

async function initDataSource() {
  if (!AppDataSource.isInitialized) await AppDataSource.initialize();
  return AppDataSource;
}

module.exports = { AppDataSource, repo, initDataSource };
