const { randomUUID } = require('crypto');

require('dotenv').config();
const bcrypt = require('bcrypt');
const { AppDataSource, repo, initDataSource } = require('../src/lib/data-source');

async function crearAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error('Configurá ADMIN_EMAIL y ADMIN_PASSWORD antes de ejecutar este script.');
  }

  await initDataSource();
  const passwordHash = await bcrypt.hash(password, 10);

  const existente = await repo('usuario').findOneBy({ email });
  const admin = await repo('usuario').save(
    existente
      ? Object.assign(existente, { rol: 'ADMIN', emailVerificado: true, passwordHash })
      : repo('usuario').create({
          id: randomUUID(),
          nombre: 'Administrador',
          apellido: 'GraffiArt',
          email,
          passwordHash,
          rol: 'ADMIN',
          emailVerificado: true,
        })
  );

  console.log(`Administrador listo: ${admin.email}`);
  console.log(`Rol: ${admin.rol}`);
}

crearAdmin()
  .catch((error) => {
    console.error(error.message || error);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (AppDataSource.isInitialized) await AppDataSource.destroy();
  });
