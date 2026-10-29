const { AppDataSource, repo } = require('../lib/data-source');

const CODIGO_VALIDO = /^[A-Z][A-Z0-9_]{1,29}$/;
const MAX_CM = 1000;
const MAX_PRECIO = 99999999.99;

const DIMENSIONES = [
  ['alto', 'altoMinCm', 'altoMaxCm'],
  ['ancho', 'anchoMinCm', 'anchoMaxCm'],
  ['profundidad', 'profundidadMinCm', 'profundidadMaxCm'],
];

const codigoDeError = (error) => error.code || error.driverError?.code;

const esDuplicado = (error) => codigoDeError(error) === 'ER_DUP_ENTRY';

const esReferenciado = (error) =>
  ['ER_ROW_IS_REFERENCED', 'ER_ROW_IS_REFERENCED_2'].includes(codigoDeError(error));

const normalizarCodigo = (valor) =>
  typeof valor === 'string' ? valor.trim().toUpperCase() : '';

function numeroEntero(valor) {
  if (valor === '' || valor === null || valor === undefined || typeof valor === 'boolean') {
    return null;
  }
  const numero = Number(valor);
  return Number.isInteger(numero) ? numero : null;
}

// Valida nombre, precio, medidas y estado. No toca el código (la clave primaria).
function validarCampos(body) {
  const nombre = typeof body.nombre === 'string' ? body.nombre.trim() : '';
  if (!nombre) return { error: 'El nombre es obligatorio.' };
  if (nombre.length > 50) {
    return { error: 'El nombre no puede superar los 50 caracteres.' };
  }

  const precioBase =
    body.precioBase === '' || body.precioBase === null || body.precioBase === undefined
      ? NaN
      : Number(body.precioBase);
  if (!Number.isFinite(precioBase) || precioBase < 0 || precioBase > MAX_PRECIO) {
    return { error: 'El precio base debe ser un número mayor o igual a 0.' };
  }

  const data = { nombre, precioBase: Math.round(precioBase * 100) / 100 };

  for (const [etiqueta, campoMin, campoMax] of DIMENSIONES) {
    const min = numeroEntero(body[campoMin]);
    const max = numeroEntero(body[campoMax]);

    if (
      min === null || max === null ||
      min < 1 || max < 1 ||
      min > MAX_CM || max > MAX_CM
    ) {
      return {
        error: `Las medidas de ${etiqueta} deben ser números enteros entre 1 y ${MAX_CM} cm.`,
      };
    }
    if (min > max) {
      return { error: `En ${etiqueta}, el mínimo no puede ser mayor que el máximo.` };
    }

    data[campoMin] = min;
    data[campoMax] = max;
  }

  if (body.activo !== undefined) {
    if (typeof body.activo !== 'boolean') {
      return { error: 'El estado no es válido.' };
    }
    data.activo = body.activo;
  }

  return { data };
}

const respuesta = (tamano, disenos = 0) => ({
  ...tamano,
  id: tamano.codigo, // el hook de CRUD del frontend identifica los registros por "id"
  precioBase: Number(tamano.precioBase),
  _count: { disenos },
});

async function contarDisenos(codigo) {
  const filas = await AppDataSource.query(
    'SELECT COUNT(*) AS total FROM disenogabinetetamano WHERE tamanoCodigo = ?',
    [codigo],
  );
  return Number(filas[0]?.total ?? 0);
}

// Lista TODOS los tamaños (activos e inactivos) para el panel de administración.
async function listarTamanos(req, res) {
  try {
    const tamanos = await repo('tamanoconfigurador').find({
      order: { precioBase: 'ASC', codigo: 'ASC' },
    });
    const filas = await AppDataSource.query(
      'SELECT tamanoCodigo, COUNT(*) AS total FROM disenogabinetetamano GROUP BY tamanoCodigo',
    );
    const conteo = new Map(filas.map((fila) => [fila.tamanoCodigo, Number(fila.total)]));

    return res.json(
      tamanos.map((tamano) => respuesta(tamano, conteo.get(tamano.codigo) ?? 0)),
    );
  } catch (error) {
    console.error('Error al listar tamaños:', error);
    return res.status(500).json({ error: 'No se pudieron obtener los tamaños.' });
  }
}

async function crearTamano(req, res) {
  const body = req.body || {};
  const codigo = normalizarCodigo(body.codigo);

  if (!CODIGO_VALIDO.test(codigo)) {
    return res.status(400).json({
      error:
        'El código debe tener entre 2 y 30 caracteres: mayúsculas, números y guion bajo, empezando con una letra (por ejemplo, MID_TOWER).',
    });
  }

  const { data, error } = validarCampos(body);
  if (error) return res.status(400).json({ error });

  try {
    if (await repo('tamanoconfigurador').existsBy({ codigo })) {
      return res.status(409).json({ error: 'Ya existe un tamaño con ese código.' });
    }

    await repo('tamanoconfigurador').insert({
      codigo,
      ...data,
      activo: data.activo ?? true,
    });

    const creado = await repo('tamanoconfigurador').findOneBy({ codigo });
    return res.status(201).json(respuesta(creado, 0));
  } catch (err) {
    if (esDuplicado(err)) {
      return res.status(409).json({ error: 'Ya existe un tamaño con ese código.' });
    }
    console.error('Error al crear tamaño:', err);
    return res.status(500).json({ error: 'No se pudo crear el tamaño.' });
  }
}

async function editarTamano(req, res) {
  const codigo = normalizarCodigo(req.params.codigo);
  const body = req.body || {};

  // El código es la clave primaria: no se puede cambiar una vez creado.
  if (body.codigo !== undefined && normalizarCodigo(body.codigo) !== codigo) {
    return res.status(400).json({ error: 'El código de un tamaño no se puede modificar.' });
  }

  const { data, error } = validarCampos(body);
  if (error) return res.status(400).json({ error });

  try {
    if (!(await repo('tamanoconfigurador').existsBy({ codigo }))) {
      return res.status(404).json({ error: 'Tamaño no encontrado.' });
    }

    await repo('tamanoconfigurador').update({ codigo }, data);

    const actualizado = await repo('tamanoconfigurador').findOneBy({ codigo });
    return res.json(respuesta(actualizado, await contarDisenos(codigo)));
  } catch (err) {
    console.error('Error al editar tamaño:', err);
    return res.status(500).json({ error: 'No se pudo actualizar el tamaño.' });
  }
}

async function eliminarTamano(req, res) {
  const codigo = normalizarCodigo(req.params.codigo);

  try {
    const enUso = await contarDisenos(codigo);
    if (enUso > 0) {
      return res.status(409).json({
        error:
          enUso === 1
            ? 'No se puede eliminar el tamaño porque está asignado a 1 diseño. Desactivalo o quitalo de ese diseño.'
            : `No se puede eliminar el tamaño porque está asignado a ${enUso} diseños. Desactivalo o quitalo de esos diseños.`,
      });
    }

    const { affected } = await repo('tamanoconfigurador').delete({ codigo });
    if (!affected) {
      return res.status(404).json({ error: 'Tamaño no encontrado.' });
    }

    return res.status(204).send();
  } catch (err) {
    if (esReferenciado(err)) {
      return res.status(409).json({
        error: 'No se puede eliminar el tamaño porque está en uso. Desactivalo en su lugar.',
      });
    }
    console.error('Error al eliminar tamaño:', err);
    return res.status(500).json({ error: 'No se pudo eliminar el tamaño.' });
  }
}

module.exports = {
  listarTamanos,
  crearTamano,
  editarTamano,
  eliminarTamano,
};