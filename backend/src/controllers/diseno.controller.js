const { repo } = require('../lib/data-source');

async function listarDisenos(req, res) {
  try {
    const disenos = await repo('disenoguardado').find({
      where: { usuarioId: req.usuario.id },
      order: { updatedAt: 'DESC' },
    });

    res.json(disenos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function crearDiseno(req, res) {
  try {
    const { nombre, descripcion, configuracion } = req.body;

    if (!nombre || !configuracion) {
      return res.status(400).json({ error: 'Nombre y configuración son obligatorios' });
    }

    const diseno = await repo('disenoguardado').save(
      repo('disenoguardado').create({
        nombre,
        descripcion: descripcion || '',
        configuracion,
        usuarioId: req.usuario.id,
      })
    );

    res.status(201).json(diseno);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function actualizarDiseno(req, res) {
  try {
    const { nombre, descripcion, configuracion } = req.body;

    const existente = await repo('disenoguardado').findOneBy({ id: req.params.id, usuarioId: req.usuario.id });

    if (!existente) {
      return res.status(404).json({ error: 'Diseño no encontrado' });
    }

    const diseno = await repo('disenoguardado').save(
      Object.assign(existente, {
        ...(nombre !== undefined && { nombre }),
        ...(descripcion !== undefined && { descripcion }),
        ...(configuracion !== undefined && { configuracion }),
      })
    );

    res.json(diseno);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function eliminarDiseno(req, res) {
  try {
    const existente = await repo('disenoguardado').findOneBy({ id: req.params.id, usuarioId: req.usuario.id });

    if (!existente) {
      return res.status(404).json({ error: 'Diseño no encontrado' });
    }

    await repo('disenoguardado').delete({ id: req.params.id });

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  listarDisenos,
  crearDiseno,
  actualizarDiseno,
  eliminarDiseno,
};
