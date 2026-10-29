const { AppDataSource, repo } = require('../lib/data-source');
 
const CATEGORIAS = ['MDF', 'MELAMINA', 'METAL', 'VIDRIO', 'ACERO', 'ACCESORIO', 'OTRO'];
const UNIDADES = ['UNIDAD', 'KG', 'M', 'M2', 'CM', 'LATA', 'BOLSA'];
const MAX_NOMBRE = 150;
const MAX_CODIGO = 50;
const MAX_DESCRIPCION = 2000;
const MAX_COSTO = 99999999.99;
const MAX_STOCK = 2147483647; // límite de la columna INT
 
const codigoDeError = (error) => error.code || error.driverError?.code;
const esDuplicado = (error) => codigoDeError(error) === 'ER_DUP_ENTRY';
const esReferenciado = (error) =>
  ['ER_ROW_IS_REFERENCED', 'ER_ROW_IS_REFERENCED_2'].includes(codigoDeError(error));
 
const MSG_CODIGO_DUPLICADO = 'Ya existe un artículo del inventario con ese código.';
 
const vacio = (valor) => valor === undefined || valor === null || valor === '';
 
// Devuelve el entero (>= 0) o null si el valor no es válido.
function enteroNoNegativo(valor) {
  if (vacio(valor) || typeof valor === 'boolean') return null;
  const numero = Number(valor);
  return Number.isInteger(numero) && numero >= 0 && numero <= MAX_STOCK
    ? numero
    : null;
}
 
// Valida y normaliza los campos de un material.
// En la creación nombre, código, categoría y unidad son obligatorios; en la
// edición solo se validan los campos que vienen en la petición.
// El stock actual NO se valida aquí: se trata aparte (stock inicial / movimientos).
function validarCampos(body, { creacion }) {
  const data = {};
 
  if (creacion || body.nombre !== undefined) {
    const nombre = typeof body.nombre === 'string' ? body.nombre.trim() : '';
    if (!nombre) return { error: 'El nombre es obligatorio.' };
    if (nombre.length > MAX_NOMBRE) {
      return { error: `El nombre no puede superar los ${MAX_NOMBRE} caracteres.` };
    }
    data.nombre = nombre;
  }
 
  if (creacion || body.codigo !== undefined) {
    const codigo = typeof body.codigo === 'string' ? body.codigo.trim() : '';
    if (!codigo) return { error: 'El código es obligatorio.' };
    if (codigo.length > MAX_CODIGO) {
      return { error: `El código no puede superar los ${MAX_CODIGO} caracteres.` };
    }
    data.codigo = codigo;
  }
 
  if (creacion || body.categoria !== undefined) {
    if (!CATEGORIAS.includes(body.categoria)) {
      return { error: `La categoría no es válida. Opciones: ${CATEGORIAS.join(', ')}.` };
    }
    data.categoria = body.categoria;
  }
 
  if (creacion || body.unidadMedida !== undefined) {
    if (!UNIDADES.includes(body.unidadMedida)) {
      return { error: `La unidad de medida no es válida. Opciones: ${UNIDADES.join(', ')}.` };
    }
    data.unidadMedida = body.unidadMedida;
  }
 
  if (body.stockMinimo !== undefined) {
    const minimo = vacio(body.stockMinimo) ? 0 : enteroNoNegativo(body.stockMinimo);
    if (minimo === null) {
      return { error: 'El stock mínimo debe ser un entero mayor o igual a 0.' };
    }
    data.stockMinimo = minimo;
  }
 
  if (body.costoUnitario !== undefined) {
    if (vacio(body.costoUnitario)) {
      data.costoUnitario = null;
    } else {
      const costo = typeof body.costoUnitario === 'boolean'
        ? NaN
        : Number(body.costoUnitario);
      if (!Number.isFinite(costo) || costo < 0 || costo > MAX_COSTO) {
        return { error: 'El costo unitario debe ser un número mayor o igual a 0.' };
      }
      data.costoUnitario = Math.round(costo * 100) / 100;
    }
  }
 
  if (body.descripcion !== undefined) {
    if (body.descripcion === null) {
      data.descripcion = null;
    } else if (typeof body.descripcion !== 'string') {
      return { error: 'La descripción no es válida.' };
    } else {
      const descripcion = body.descripcion.trim();
      if (descripcion.length > MAX_DESCRIPCION) {
        return {
          error: `La descripción no puede superar los ${MAX_DESCRIPCION} caracteres.`,
        };
      }
      data.descripcion = descripcion || null;
    }
  }
 
  if (body.activo !== undefined) {
    if (typeof body.activo !== 'boolean') {
      return { error: 'El estado no es válido.' };
    }
    data.activo = body.activo;
  }
 
  return { data };
}
 
// ¿Hay otro artículo con el mismo código? (sin distinguir mayúsculas)
async function codigoEnUso(codigo, idActual = '') {
  const filas = await AppDataSource.query(
    'SELECT id FROM material WHERE LOWER(codigo) = LOWER(?) AND id <> ? LIMIT 1',
    [codigo, idActual],
  );
  return filas.length > 0;
}
 
// Crear un material y registrar su stock inicial como movimiento de ENTRADA
async function crearMaterial(req, res) {
  const body = req.body || {};
  const { data, error } = validarCampos(body, { creacion: true });
  if (error) return res.status(400).json({ error });
 
  const stockInicial = vacio(body.stockActual) ? 0 : enteroNoNegativo(body.stockActual);
  if (stockInicial === null) {
    return res.status(400).json({
      error: 'El stock inicial debe ser un entero mayor o igual a 0.',
    });
  }
 
  try {
    if (await codigoEnUso(data.codigo)) {
      return res.status(409).json({ error: MSG_CODIGO_DUPLICADO });
    }
 
    const material = await AppDataSource.transaction(async (manager) => {
      const materialRepo = manager.getRepository('material');
      const movimientoRepo = manager.getRepository('inventariomovimiento');
 
      const guardado = await materialRepo.save(
        materialRepo.create({
          stockMinimo: 0,
          activo: true,
          ...data,
          stockActual: stockInicial,
        }),
      );
 
      if (stockInicial > 0) {
        await movimientoRepo.save(
          movimientoRepo.create({
            materialId: guardado.id,
            tipo: 'ENTRADA',
            cantidad: stockInicial,
            motivo: 'Stock inicial',
            referencia: 'Creación de material',
            usuarioId: req.usuario?.id || null,
          }),
        );
      }
 
      return guardado;
    });
 
    return res.status(201).json(material);
  } catch (err) {
    if (esDuplicado(err)) {
      return res.status(409).json({ error: MSG_CODIGO_DUPLICADO });
    }
    console.error('Error al crear material:', err);
    return res.status(500).json({ error: 'No se pudo crear el material.' });
  }
}
 
// Listar todos los materiales (activos e inactivos)
async function listarMateriales(req, res) {
  try {
    const materiales = await repo('material').find({ order: { nombre: 'ASC' } });
    res.json(materiales);
  } catch (error) {
    console.error('Error al listar materiales:', error);
    res.status(500).json({ error: 'No se pudieron obtener los materiales.' });
  }
}
 
// Ver un material por id
async function obtenerMaterial(req, res) {
  try {
    const material = await repo('material').findOneBy({
      id: req.params.id,
    });
 
    if (!material) {
      return res.status(404).json({ error: 'Material no encontrado' });
    }
 
    res.json(material);
  } catch (error) {
    console.error('Error al obtener material:', error);
    res.status(500).json({ error: 'No se pudo obtener el material.' });
  }
}
 
// Editar un material. El stock NO se modifica aquí: se cambia solo con
// movimientos de inventario (POST /api/inventario/movimientos).
async function editarMaterial(req, res) {
  const { id } = req.params;
  // Se ignora stockActual aunque venga incluido en la petición.
  // eslint-disable-next-line no-unused-vars
  const { stockActual, ...cuerpo } = req.body || {};
 
  const { data, error } = validarCampos(cuerpo, { creacion: false });
  if (error) return res.status(400).json({ error });
 
  try {
    const materialRepo = repo('material');
    const material = await materialRepo.findOneBy({ id });
 
    if (!material) {
      return res.status(404).json({ error: 'Material no encontrado' });
    }
 
    if (data.codigo && (await codigoEnUso(data.codigo, id))) {
      return res.status(409).json({ error: MSG_CODIGO_DUPLICADO });
    }
 
    if (Object.keys(data).length > 0) {
      await materialRepo.update({ id }, data);
    }
 
    return res.json(await materialRepo.findOneBy({ id }));
  } catch (err) {
    if (esDuplicado(err)) {
      return res.status(409).json({ error: MSG_CODIGO_DUPLICADO });
    }
    console.error('Error al editar material:', err);
    return res.status(500).json({ error: 'No se pudo actualizar el material.' });
  }
}
 
// Activar o desactivar un material sin eliminarlo.
async function cambiarEstadoMaterial(req, res) {
  const { id } = req.params;
  const { activo } = req.body || {};
 
  if (typeof activo !== 'boolean') {
    return res.status(400).json({ error: 'El estado no es válido.' });
  }
 
  try {
    const materialRepo = repo('material');
    const material = await materialRepo.findOneBy({ id });
    if (!material) {
      return res.status(404).json({ error: 'Material no encontrado' });
    }
 
    await materialRepo.update({ id }, { activo });
    return res.json(await materialRepo.findOneBy({ id }));
  } catch (err) {
    console.error('Error al cambiar el estado del material:', err);
    return res.status(500).json({ error: 'No se pudo cambiar el estado del material.' });
  }
}
 
// Cuenta pedidos y diseños guardados que mencionan al material.
// Las configuraciones se guardan como JSON de texto (sin clave foránea).
async function contarReferencias(materialId) {
  const patron = `%${materialId}%`;
  const [pedidos] = await AppDataSource.query(
    'SELECT COUNT(*) AS total FROM detallepedido WHERE configuracion LIKE ?',
    [patron],
  );
  const [disenos] = await AppDataSource.query(
    'SELECT COUNT(*) AS total FROM disenoguardado WHERE configuracion LIKE ?',
    [patron],
  );
  return Number(pedidos?.total ?? 0) + Number(disenos?.total ?? 0);
}
 
// Eliminar un material (solo si nunca se usó; si no, se desactiva)
async function eliminarMaterial(req, res) {
  try {
    const material = await repo('material').findOneBy({ id: req.params.id });
    if (!material) {
      return res.status(404).json({ error: 'Material no encontrado' });
    }
 
    const movimientos = await repo('inventariomovimiento').countBy({
      materialId: material.id,
    });
 
    if (movimientos > 0) {
      return res.status(409).json({
        error:
          'No se puede eliminar este artículo porque tiene movimientos de inventario asociados. Se conserva para no perder su historial. Podés desactivarlo.',
      });
    }
 
    if ((await contarReferencias(material.id)) > 0) {
      return res.status(409).json({
        error:
          'No se puede eliminar este artículo porque está usado en pedidos o diseños guardados. Podés desactivarlo para que deje de ofrecerse.',
      });
    }
 
    const { affected } = await repo('material').delete({ id: material.id });
    if (!affected) {
      return res.status(404).json({ error: 'Material no encontrado' });
    }
 
    res.status(204).send();
  } catch (err) {
    if (esReferenciado(err)) {
      return res.status(409).json({
        error: 'No se puede eliminar el artículo porque está en uso. Podés desactivarlo.',
      });
    }
    console.error('Error al eliminar material:', err);
    res.status(500).json({ error: 'No se pudo eliminar el material.' });
  }
}
 
module.exports = {
  crearMaterial,
  listarMateriales,
  obtenerMaterial,
  editarMaterial,
  cambiarEstadoMaterial,
  eliminarMaterial,
};