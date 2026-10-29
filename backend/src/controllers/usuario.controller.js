const { repo } = require('../lib/data-source');

async function getPerfil(req, res) {
  try {
    const usuario = await repo('usuario').findOne({
      where: { id: req.usuario.id },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        telefono: true,
        rol: true,

        fechaRegistro: true,
        emailVerificado: true,
      },
    });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updatePerfil(req, res) {
  try {
    const { nombre, apellido, telefono } = req.body;
    if (!nombre || !apellido) {
      return res.status(400).json({ error: 'Nombre y apellido son obligatorios' });
    }
    await repo('usuario').update({ id: req.usuario.id }, { nombre, apellido, telefono });
    const usuario = await repo('usuario').findOne({
      where: { id: req.usuario.id },
      select: {
        id: true,
        nombre: true,
        apellido: true,
        email: true,
        telefono: true,
        rol: true,
      },
    });
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

module.exports = { getPerfil, updatePerfil };
