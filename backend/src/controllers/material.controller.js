const { AppDataSource, repo } = require('../lib/data-source');

// Crear un material y registrar su stock inicial
async function crearMaterial(req, res) {
  try {
    const stockInicial = Number(req.body.stockActual ?? 0);

    if (!Number.isInteger(stockInicial) || stockInicial < 0) {
      return res.status(400).json({
        error: 'El stock inicial debe ser un entero mayor o igual a 0.',
      });
    }

    const material = await AppDataSource.transaction(async (manager) => {
      const materialRepo = manager.getRepository('material');
      const movimientoRepo = manager.getRepository('inventariomovimiento');

      const nuevoMaterial = materialRepo.create({
        ...req.body,
        stockActual: 0,
      });

      nuevoMaterial.stockActual = stockInicial;
      const guardado = await materialRepo.save(nuevoMaterial);

      if (stockInicial > 0) {
        const movimiento = movimientoRepo.create({
          materialId: guardado.id,
          tipo: 'ENTRADA',
          cantidad: stockInicial,
          motivo: 'Stock inicial',
          referencia: 'Creación de material',
          usuarioId: req.usuario?.id || null,
        });

        await movimientoRepo.save(movimiento);
      }

      return guardado;
    });

    res.status(201).json(material);
  } catch (error) {
    console.error('Error al crear material:', error);
    res.status(400).json({ error: error.message });
  }
}

// Listar todos los materiales
async function listarMateriales(req, res) {
  try {
    const materiales = await repo('material').find();
    res.json(materiales);
  } catch (error) {
    res.status(500).json({ error: error.message });
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
    res.status(500).json({ error: error.message });
  }
}

// Editar un material sin modificar directamente su stock
async function editarMaterial(req, res) {
  try {
    const materialRepo = repo('material');
    const material = await materialRepo.findOneBy({
      id: req.params.id,
    });

    if (!material) {
      return res.status(404).json({ error: 'Material no encontrado' });
    }

    // Se ignora stockActual aunque venga incluido en la petición.
    const { stockActual, ...datosEditables } = req.body;

    await materialRepo.update(
      { id: req.params.id },
      datosEditables
    );

    res.json(
      await materialRepo.findOneBy({ id: req.params.id })
    );
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// Eliminar un material
async function eliminarMaterial(req, res) {
  try {
    // Si tiene movimientos, se conserva para no perder el historial.
    const movimientos = await repo('inventariomovimiento').countBy({
      materialId: req.params.id,
    });

    if (movimientos > 0) {
      return res.status(409).json({
        error:
          'No se puede eliminar este artículo porque tiene movimientos de inventario asociados. Se conserva para no perder su historial.',
      });
    }

    const { affected } = await repo('material').delete({
      id: req.params.id,
    });

    if (!affected) {
      return res.status(404).json({ error: 'Material no encontrado' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  crearMaterial,
  listarMateriales,
  obtenerMaterial,
  editarMaterial,
  eliminarMaterial,
};
