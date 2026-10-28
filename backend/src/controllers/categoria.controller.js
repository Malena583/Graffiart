const { repo } = require('../lib/data-source');

const esDuplicado = (error) => (error.code || error.driverError?.code) === 'ER_DUP_ENTRY';

async function conConteo(id) {
  const categoria = await repo('CategoriaProducto').findOneBy({ id });
  if (!categoria) return null;
  const productos = await repo('gabinete').countBy({ categoriaId: id });
  return { ...categoria, _count: { productos } };
}

async function listarCategorias(req, res) {
  try {
    const categorias = await repo('CategoriaProducto')
      .find({
        where: { activo: true },
        order: { nombre: 'ASC' },
      });
    const categoriasConConteo = await Promise.all(
      categorias.map(async (categoria) => ({
        ...categoria,
        _count: {
          productos: await repo('gabinete').countBy({ categoriaId: categoria.id }),
        },
      }))
    );

    res.json(categoriasConConteo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function crearCategoria(req, res) {
  try {
    const { nombre, descripcion } = req.body || {};
    const nombreLimpio = typeof nombre === 'string' ? nombre.trim() : '';

    if (!nombreLimpio) {
      return res.status(400).json({
        error: 'El nombre de la categoría es obligatorio',
      });
    }

    const categoria = await repo('CategoriaProducto').save(
      repo('CategoriaProducto').create({
        nombre: nombreLimpio,
        descripcion:
          typeof descripcion === 'string' && descripcion.trim()
            ? descripcion.trim()
            : null,
      })
    );

    res.status(201).json(categoria);
  } catch (error) {
    if (esDuplicado(error)) {
      return res.status(409).json({
        error: 'Ya existe una categoría con ese nombre',
      });
    }

    res.status(500).json({ error: error.message });
  }
}

async function editarCategoria(req, res) {
  try {
    const { nombre, descripcion, activo } = req.body || {};
    const data = {};

    if (nombre !== undefined) {
      const nombreLimpio = typeof nombre === 'string' ? nombre.trim() : '';
      if (!nombreLimpio) {
        return res.status(400).json({
          error: 'El nombre de la categoría es obligatorio',
        });
      }
      data.nombre = nombreLimpio;
    }

    if (descripcion !== undefined) {
      data.descripcion =
        typeof descripcion === 'string' && descripcion.trim()
          ? descripcion.trim()
          : null;
    }

    if (activo !== undefined) {
      data.activo = Boolean(activo);
    }

    if (!(await repo('CategoriaProducto').existsBy({ id: req.params.id }))) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }
    if (Object.keys(data).length) {
      await repo('CategoriaProducto').update({ id: req.params.id }, data);
    }
    const categoria = await conConteo(req.params.id);
    if (!categoria) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.json(categoria);
  } catch (error) {
    if (esDuplicado(error)) {
      return res.status(409).json({
        error: 'Ya existe una categoría con ese nombre',
      });
    }

    res.status(400).json({ error: error.message });
  }
}

async function eliminarCategoria(req, res) {
  try {
    const { affected } = await repo('CategoriaProducto').delete({ id: req.params.id });
    if (!affected) {
      return res.status(404).json({ error: 'Categoría no encontrada' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  listarCategorias,
  crearCategoria,
  editarCategoria,
  eliminarCategoria,
};
