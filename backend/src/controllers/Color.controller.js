const { repo } = require('../lib/data-source');
 
// Colores de PERSONALIZACIÓN del configurador (tabla colorconfigurador).
// No se mezclan con los atributos de color de los productos del catálogo.
 
const HEX_VALIDO = /^#[0-9A-Fa-f]{6}$/;
const MAX_NOMBRE = 50;
 
const codigoDeError = (error) => error.code || error.driverError?.code;
const esDuplicado = (error) => codigoDeError(error) === 'ER_DUP_ENTRY';
 
const normalizarHex = (valor) =>
  typeof valor === 'string' ? valor.trim().toUpperCase() : '';
 
// Valida y normaliza nombre, código hexadecimal y estado.
function validarCampos(body) {
  const nombre = typeof body.nombre === 'string' ? body.nombre.trim() : '';
  if (!nombre) return { error: 'El nombre es obligatorio.' };
  if (nombre.length > MAX_NOMBRE) {
    return { error: `El nombre no puede superar los ${MAX_NOMBRE} caracteres.` };
  }
 
  const codigoHex = normalizarHex(body.codigoHex);
  if (!HEX_VALIDO.test(codigoHex)) {
    return {
      error:
        'El código hexadecimal no es válido. Usá el formato #RRGGBB (por ejemplo, #FF0000).',
    };
  }
 
  const data = { nombre, codigoHex };
 
  if (body.activo !== undefined) {
    if (typeof body.activo !== 'boolean') {
      return { error: 'El estado no es válido.' };
    }
    data.activo = body.activo;
  }
 
  return { data };
}
 
// Busca otro color con el mismo nombre o el mismo código hexadecimal.
// La tabla es chica, así que se compara en memoria (sin distinguir mayúsculas).
async function buscarDuplicado({ nombre, codigoHex }, idActual = null) {
  const colores = await repo('colorconfigurador').find();
  const otros = colores.filter((color) => color.id !== idActual);
 
  if (otros.some((c) => c.nombre.trim().toLowerCase() === nombre.toLowerCase())) {
    return 'Ya existe un color con ese nombre.';
  }
  if (otros.some((c) => normalizarHex(c.codigoHex) === codigoHex)) {
    return 'Ya existe un color con ese código hexadecimal.';
  }
  return null;
}
 
// Lista TODOS los colores (activos e inactivos) para el panel de administración.
async function listarColores(req, res) {
  try {
    const colores = await repo('colorconfigurador').find({
      order: { nombre: 'ASC' },
    });
    return res.json(colores);
  } catch (error) {
    console.error('Error al listar colores:', error);
    return res.status(500).json({ error: 'No se pudieron obtener los colores.' });
  }
}
 
// Lista SOLO los colores activos para el configurador público.
async function listarColoresConfigurador(req, res) {
  try {
    const colores = await repo('colorconfigurador').find({
      where: { activo: true },
      order: { nombre: 'ASC' },
    });
    return res.json(
      colores.map(({ id, nombre, codigoHex, activo }) => ({
        id,
        nombre,
        codigoHex,
        activo,
      })),
    );
  } catch (error) {
    console.error('Error al obtener los colores del configurador:', error);
    return res.status(500).json({
      error: 'No se pudieron obtener los colores del configurador.',
    });
  }
}
 
async function crearColor(req, res) {
  const { data, error } = validarCampos(req.body || {});
  if (error) return res.status(400).json({ error });
 
  try {
    const duplicado = await buscarDuplicado(data);
    if (duplicado) return res.status(409).json({ error: duplicado });
 
    const color = await repo('colorconfigurador').save(
      repo('colorconfigurador').create({ ...data, activo: data.activo ?? true }),
    );
    return res.status(201).json(color);
  } catch (err) {
    if (esDuplicado(err)) {
      return res.status(409).json({ error: 'Ya existe un color con ese nombre.' });
    }
    console.error('Error al crear color:', err);
    return res.status(500).json({ error: 'No se pudo crear el color.' });
  }
}
 
async function editarColor(req, res) {
  const { id } = req.params;
  const { data, error } = validarCampos(req.body || {});
  if (error) return res.status(400).json({ error });
 
  try {
    const existente = await repo('colorconfigurador').findOneBy({ id });
    if (!existente) return res.status(404).json({ error: 'Color no encontrado.' });
 
    const duplicado = await buscarDuplicado(data, id);
    if (duplicado) return res.status(409).json({ error: duplicado });
 
    await repo('colorconfigurador').update({ id }, data);
    return res.json(await repo('colorconfigurador').findOneBy({ id }));
  } catch (err) {
    if (esDuplicado(err)) {
      return res.status(409).json({ error: 'Ya existe un color con ese nombre.' });
    }
    console.error('Error al editar color:', err);
    return res.status(500).json({ error: 'No se pudo actualizar el color.' });
  }
}
 
// Activa o desactiva un color. Nunca se elimina: los diseños y pedidos
// que ya lo usan conservan su referencia.
async function cambiarEstadoColor(req, res) {
  const { id } = req.params;
  const { activo } = req.body || {};
 
  if (typeof activo !== 'boolean') {
    return res.status(400).json({ error: 'El estado no es válido.' });
  }
 
  try {
    const existente = await repo('colorconfigurador').findOneBy({ id });
    if (!existente) return res.status(404).json({ error: 'Color no encontrado.' });
 
    await repo('colorconfigurador').update({ id }, { activo });
    return res.json(await repo('colorconfigurador').findOneBy({ id }));
  } catch (err) {
    console.error('Error al cambiar el estado del color:', err);
    return res.status(500).json({ error: 'No se pudo cambiar el estado del color.' });
  }
}
 
module.exports = {
  listarColores,
  listarColoresConfigurador,
  crearColor,
  editarColor,
  cambiarEstadoColor,
};