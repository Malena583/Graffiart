require('dotenv').config();
const { AppDataSource, repo, initDataSource } = require('../src/lib/data-source');
const bcrypt = require('bcrypt');          
const { randomUUID } = require('crypto');  

const CATEGORIAS = [
  { nombre: 'Gamer', descripcion: 'Gabinetes con iluminación RGB y paneles de vidrio' },
  { nombre: 'Oficina', descripcion: 'Gabinetes sobrios y económicos para uso diario' },
  { nombre: 'Compactos', descripcion: 'Gabinetes mini torre y formatos ITX / Micro ATX' },
  { nombre: 'Premium', descripcion: 'Gabinetes full tower y de gama alta' },
];

async function seedCategorias() {
  for (const categoria of CATEGORIAS) {
    const existente = await repo('CategoriaProducto').findOneBy({ nombre: categoria.nombre });
    await repo('CategoriaProducto').save(
      existente
        ? Object.assign(existente, { descripcion: categoria.descripcion })
        : repo('CategoriaProducto').create(categoria)
    );
  }
  console.log('Categorías cargadas.');
}

async function seedAdmin() {
  const email = (process.env.ADMIN_EMAIL || 'admin@gmail.com').trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD || 'madredeDios';
  const passwordHash = await bcrypt.hash(password, 10);

  const existente = await repo('usuario').findOneBy({ email });
  await repo('usuario').save(
    existente
      ? Object.assign(existente, { rol: 'ADMIN', emailVerificado: true })
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
  console.log(`Administrador listo: ${email}`);
}

async function main() {
  await initDataSource();
  const gabinetesData = [
    {
      id: 'gab-01',
      nombre: 'Gabinete Gamer RGB Alpha',
      marca: 'AlphaGamer',
      costoUnitario: 12500,
      stockActual: 10,
      stockMinimo: 2,
      formato: 'ATX',
      materialChasis: 'ACERO',
      panel: 'VIDRIO_TEMPLADO',
      tamano: 'MID_TOWER',
      activo: true,
      updatedAt: new Date(),
    },
    {
      id: 'gab-02',
      nombre: 'Gabinete Oficina Minimalista',
      marca: 'OfficeTech',
      costoUnitario: 7500,
      stockActual: 15,
      stockMinimo: 3,
      formato: 'MICRO_ATX',
      materialChasis: 'ALUMINIO',
      panel: 'MALLADO',
      tamano: 'MINI_TOWER',
      activo: true,
      updatedAt: new Date(),
    },
    {
      id: 'gab-03',
      nombre: 'Gabinete Extreme Pro Full Tower',
      marca: 'Corsair',
      costoUnitario: 21000,
      stockActual: 5,
      stockMinimo: 1,
      formato: 'ATX',
      materialChasis: 'ACERO',
      panel: 'VIDRIO_TEMPLADO',
      tamano: 'FULL_TOWER',
      activo: true,
      updatedAt: new Date(),
    },
    {
      id: 'gab-04',
      nombre: 'Gabinete Compact Mesh ITX',
      marca: 'CoolerMaster',
      costoUnitario: 9500,
      stockActual: 8,
      stockMinimo: 2,
      formato: 'ITX',
      materialChasis: 'ALUMINIO',
      panel: 'MALLADO',
      tamano: 'MINI_TOWER',
      activo: true,
      updatedAt: new Date(),
    },
    {
      id: 'gab-05',
      nombre: 'Gabinete Beast RGB Edition',
      marca: 'Redragon',
      costoUnitario: 11000,
      stockActual: 12,
      stockMinimo: 3,
      formato: 'ATX',
      materialChasis: 'ACERO',
      panel: 'ACRILICO',
      tamano: 'MID_TOWER',
      activo: true,
      updatedAt: new Date(),
    },
    {
      id: 'gab-06',
      nombre: 'Gabinete Silent Pro Black',
      marca: 'BeQuiet',
      costoUnitario: 14000,
      stockActual: 6,
      stockMinimo: 2,
      formato: 'ATX',
      materialChasis: 'ACERO',
      panel: 'MALLADO',
      tamano: 'MID_TOWER',
      activo: true,
      updatedAt: new Date(),
    },
    {
      id: 'gab-07',
      nombre: 'Gabinete White Edition Glass',
      marca: 'NZXT',
      costoUnitario: 16500,
      stockActual: 9,
      stockMinimo: 2,
      formato: 'ATX',
      materialChasis: 'ALUMINIO',
      panel: 'VIDRIO_TEMPLADO',
      tamano: 'MID_TOWER',
      activo: true,
      updatedAt: new Date(),
    },
    {
      id: 'gab-08',
      nombre: 'Gabinete Budget Office Micro',
      marca: 'Genius',
      costoUnitario: 5500,
      stockActual: 20,
      stockMinimo: 5,
      formato: 'MICRO_ATX',
      materialChasis: 'ACERO',
      panel: 'ACRILICO',
      tamano: 'MINI_TOWER',
      activo: true,
      updatedAt: new Date(),
    },
    {
      id: 'gab-09',
      nombre: 'Gabinete Dragon Scale RGB',
      marca: 'Aerocool',
      costoUnitario: 9999,
      stockActual: 14,
      stockMinimo: 3,
      formato: 'ATX',
      materialChasis: 'ACERO',
      panel: 'VIDRIO_TEMPLADO',
      tamano: 'MID_TOWER',
      activo: true,
      updatedAt: new Date(),
    },
    {
      id: 'gab-10',
      nombre: 'Gabinete Nano ITX Aluminum',
      marca: 'LianLi',
      costoUnitario: 18000,
      stockActual: 4,
      stockMinimo: 1,
      formato: 'ITX',
      materialChasis: 'ALUMINIO',
      panel: 'VIDRIO_TEMPLADO',
      tamano: 'MINI_TOWER',
      activo: true,
      updatedAt: new Date(),
    },
    {
      id: 'gab-11',
      nombre: 'Gabinete Hydro Master Full',
      marca: 'Thermaltake',
      costoUnitario: 23000,
      stockActual: 3,
      stockMinimo: 1,
      formato: 'ATX',
      materialChasis: 'ACERO',
      panel: 'VIDRIO_TEMPLADO',
      tamano: 'FULL_TOWER',
      activo: true,
      updatedAt: new Date(),
    },
    {
      id: 'gab-12',
      nombre: 'Gabinete Squad Micro ATX',
      marca: 'Xigmatek',
      costoUnitario: 6800,
      stockActual: 11,
      stockMinimo: 2,
      formato: 'MICRO_ATX',
      materialChasis: 'ACERO',
      panel: 'ACRILICO',
      tamano: 'MINI_TOWER',
      activo: true,
      updatedAt: new Date(),
    },
    {
      id: 'gab-13',
      nombre: 'Gabinete Horizon Mesh',
      marca: 'Antec',
      costoUnitario: 10500,
      stockActual: 7,
      stockMinimo: 2,
      formato: 'ATX',
      materialChasis: 'ACERO',
      panel: 'MALLADO',
      tamano: 'MID_TOWER',
      activo: true,
      updatedAt: new Date(),
    },
    {
      id: 'gab-14',
      nombre: 'Gabinete Titan Ultra Tower',
      marca: 'Phanteks',
      costoUnitario: 25000,
      stockActual: 2,
      stockMinimo: 1,
      formato: 'ATX',
      materialChasis: 'ALUMINIO',
      panel: 'VIDRIO_TEMPLADO',
      tamano: 'FULL_TOWER',
      activo: true,
      updatedAt: new Date(),
    },
    {
      id: 'gab-15',
      nombre: 'Gabinete Cube Mini ITX',
      marca: 'BitFenix',
      costoUnitario: 8900,
      stockActual: 10,
      stockMinimo: 2,
      formato: 'ITX',
      materialChasis: 'ACERO',
      panel: 'MALLADO',
      tamano: 'MINI_TOWER',
      activo: true,
      updatedAt: new Date(),
    }
  ];

  for (const gabinete of gabinetesData) {
    const existente = await repo('gabinete').findOneBy({ id: gabinete.id });
    if (existente) {
      // Esto asegura que tome tu nuevo precio
      await repo('gabinete').update(
        { id: gabinete.id },
        { costoUnitario: gabinete.costoUnitario, nombre: gabinete.nombre }
      );
    } else {
      await repo('gabinete').insert(gabinete);
    }
  }

  await seedCategorias();   
  await seedAdmin(); 

  console.log('¡Se han actualizado los gabinetes exitosamente!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    if (AppDataSource.isInitialized) await AppDataSource.destroy();
  });