
const { AppDataSource } = require('../lib/data-source');

const ENTIDADES = {
  material: 'material',
  gabinete: 'gabinete',
};

// Listar historial de movimientos
async function listarMovimientos(req, res) {
  try {
    const movimientos = await AppDataSource.getRepository(
      'inventariomovimiento'
    ).find({
        relations: {
            material: true,
            gabinete: true,
            usuario: true,
        },
        select: {
            id: true,
            tipo: true,
            cantidad: true,
            motivo: true,
            referencia: true,
            fecha: true,
            materialId: true,
            gabineteId: true,
            usuarioId: true,
            material: { id: true, nombre: true, codigo: true },
            gabinete: { id: true, nombre: true },
            usuario: { id: true, nombre: true, apellido: true },
        },
      order: { fecha: 'DESC' },
    });

    res.json(movimientos);
  } catch (error) {
    console.error('Error al listar movimientos:', error);
    res.status(500).json({ error: 'No se pudo obtener el historial.' });
  }
}

// Registrar movimiento y actualizar stock
async function crearMovimiento(req, res) {
  const {
    entidad,
    articuloId,
    tipo,
    cantidad,
    motivo,
    referencia,
  } = req.body || {};

  if (!ENTIDADES[entidad]) {
    return res.status(400).json({
      error: 'El artículo debe ser un material o un gabinete.',
    });
  }
  if (
    articuloId === undefined ||
    articuloId === null ||
    !Number.isInteger(Number(articuloId)) ||
    Number(articuloId) <= 0
  ) {
    return res.status(400).json({
        error: 'El ID del artículo no es válido.',
    });
  }

  if (!['ENTRADA', 'SALIDA', 'AJUSTE'].includes(tipo)) {
    return res.status(400).json({ error: 'Tipo de movimiento inválido.' });
  }

  if (
    !Number.isInteger(cantidad) ||
    cantidad < (tipo === 'AJUSTE' ? 0 : 1)
  ) {
    return res.status(400).json({
      error: tipo === 'AJUSTE'
        ? 'El stock ajustado debe ser un entero mayor o igual a 0.'
        : 'La cantidad debe ser un entero mayor que 0.',
    });
  }

  if (motivo != null && (typeof motivo !== 'string' || motivo.trim().length > 191)) {
    return res.status(400).json({ error: 'El motivo no es válido.' });
  }

  if (referencia != null && (typeof referencia !== 'string' || referencia.trim().length > 191)) {
    return res.status(400).json({ error: 'La referencia no es válida.' });
  }

  try {
    const movimiento = await AppDataSource.transaction(async (manager) => {
      const articuloRepo = manager.getRepository(ENTIDADES[entidad]);
      const movimientoRepo = manager.getRepository('inventariomovimiento');

      const articulo = await articuloRepo.findOne({
        where: { id: articuloId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!articulo) {
        const error = new Error('Artículo no encontrado.');
        error.status = 404;
        throw error;
      }

      if (!articulo.activo) {
        const error = new Error('No se puede modificar un artículo inactivo.');
        error.status = 409;
        throw error;
      }

      const stockAnterior = Number(articulo.stockActual);
      let stockNuevo;

      if (tipo === 'ENTRADA') {
        stockNuevo = stockAnterior + cantidad;
      } else if (tipo === 'SALIDA') {
        if (cantidad > stockAnterior) {
          const error = new Error('No hay stock suficiente para esta salida.');
          error.status = 409;
          throw error;
        }
        stockNuevo = stockAnterior - cantidad;
      } else {
        // En un ajuste, cantidad representa el stock final deseado.
        stockNuevo = cantidad;
      }

      articulo.stockActual = stockNuevo;
      await articuloRepo.save(articulo);

      const nuevoMovimiento = movimientoRepo.create({
        tipo,
        cantidad,
        motivo: motivo?.trim() || null,
        referencia: referencia?.trim() || null,
        usuarioId: req.usuario?.id || null,
        materialId: entidad === 'material' ? articulo.id : null,
        gabineteId: entidad === 'gabinete' ? articulo.id : null,
      });

      return movimientoRepo.save(nuevoMovimiento);
    });

    res.status(201).json(movimiento);
  } catch (error) {
    console.error('Error al registrar movimiento:', error);
    res.status(error.status || 500).json({
      error: error.status ? error.message : 'No se pudo registrar el movimiento.',
    });
  }
}

module.exports = { listarMovimientos, crearMovimiento };
