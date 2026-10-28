const { repo } = require('../lib/data-source');

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const PRODUCT_FIELDS = {
  id: true,
  nombre: true,
  marca: true,
  costoUnitario: true,
  stockActual: true,
  stockMinimo: true,
  createdAt: true,
  updatedAt: true,
  activo: true,
  formato: true,
  materialChasis: true,
  panel: true,
  tamano: true,
  categoriaId: true,
};

function decodeImage(dataUrl) {
  if (typeof dataUrl !== 'string') return null;
  const match = /^data:image\/(png|jpeg|webp);base64,([A-Za-z0-9+/]+={0,2})$/.exec(dataUrl);
  if (!match) return null;

  const buffer = Buffer.from(match[2], 'base64');
  if (
    !buffer.length ||
    buffer.length > MAX_IMAGE_SIZE ||
    buffer.toString('base64') !== match[2]
  ) {
    return null;
  }

  const mime = match[1] === 'jpg' ? 'jpeg' : match[1];
  const validSignature =
    (mime === 'png' &&
      buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) ||
    (mime === 'jpeg' && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) ||
    (mime === 'webp' &&
      buffer.toString('ascii', 0, 4) === 'RIFF' &&
      buffer.toString('ascii', 8, 12) === 'WEBP');

  return validSignature ? buffer : null;
}

const imageUrl = (producto) => {
  const version = producto.updatedAt
    ? new Date(producto.updatedAt).getTime()
    : 0;
  return `productos/${encodeURIComponent(producto.id)}/imagen?v=${version}`;
};

const productoResponse = (producto) => {
  const { imagen, ...datos } = producto;
  return { ...datos, imagenUrl: imageUrl(producto) };
};

async function listarProductos(req, res) {
  try {
    const productos = await repo('gabinete').find({
      select: {
        ...PRODUCT_FIELDS,
        categoria: { id: true, nombre: true },
      },
      relations: { categoria: true },
      order: { createdAt: 'DESC' },
    });

    res.json(productos.map(productoResponse));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function obtenerProducto(req, res) {
  try {
    const producto = await repo('gabinete').findOne({
      where: { id: req.params.id },
      select: {
        ...PRODUCT_FIELDS,
        categoria: { id: true, nombre: true },
      },
      relations: { categoria: true },
    });

    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.json(productoResponse(producto));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function obtenerImagenProducto(req, res) {
  try {
    const producto = await repo('gabinete').findOne({
      where: { id: req.params.id },
      select: { id: true, imagen: true },
    });

    if (!producto?.imagen) {
      return res.status(404).json({ error: 'Imagen de producto no encontrada' });
    }

    const imagen = Buffer.isBuffer(producto.imagen)
      ? producto.imagen
      : Buffer.from(producto.imagen);
    const mime =
      imagen.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
        ? 'image/png'
        : imagen[0] === 0xff && imagen[1] === 0xd8 && imagen[2] === 0xff
          ? 'image/jpeg'
          : imagen.toString('ascii', 0, 4) === 'RIFF' &&
              imagen.toString('ascii', 8, 12) === 'WEBP'
            ? 'image/webp'
            : null;

    if (!mime) {
      return res.status(500).json({ error: 'El formato de la imagen almacenada no es válido' });
    }

    res.set('Content-Type', mime);
    res.set('Cache-Control', 'public, max-age=86400');
    return res.send(imagen);
  } catch (error) {
    console.error('Error al obtener la imagen del producto:', error);
    return res.status(500).json({ error: 'No se pudo obtener la imagen del producto' });
  }
}

function validarDatosProducto(body) {
  const {
    nombre,
    marca,
    costoUnitario,
    stockActual,
    stockMinimo,
    tamano,
    formato,
    materialChasis,
    panel,
  } = body;

  if (!nombre?.trim() || !marca?.trim()) {
    return 'Nombre y marca son obligatorios';
  }

  if (costoUnitario === undefined || Number.isNaN(Number(costoUnitario)) || Number(costoUnitario) < 0) {
    return 'El costo unitario debe ser un número mayor o igual a 0';
  }

  if (stockActual === undefined || Number.isNaN(Number(stockActual)) || Number(stockActual) < 0) {
    return 'El stock actual debe ser un número mayor o igual a 0';
  }

  if (stockMinimo === undefined || Number.isNaN(Number(stockMinimo)) || Number(stockMinimo) < 0) {
    return 'El stock mínimo debe ser un número mayor o igual a 0';
  }

  if (!tamano || !formato || !materialChasis || !panel) {
    return 'Las características del gabinete son obligatorias';
  }

  return null;
}

async function crearProducto(req, res) {
  try {
    const imagen = decodeImage(req.body?.imagen);
    if (!imagen) {
      return res.status(400).json({
        error: 'La imagen es obligatoria y debe ser PNG, JPG o WebP de hasta 5 MB.',
      });
    }
    const errorValidacion = validarDatosProducto(req.body || {});
    if (errorValidacion) {
      return res.status(400).json({ error: errorValidacion });
    }

    const {
      nombre,
      marca,
      costoUnitario,
      stockActual,
      stockMinimo,
      tamano,
      formato,
      materialChasis,
      panel,
      categoriaId,
    } = req.body;

    if (categoriaId) {
      const categoria = await repo('CategoriaProducto').findOneBy({ id: categoriaId });
      if (!categoria) {
        return res.status(400).json({ error: 'La categoría seleccionada no existe' });
      }
    }

    const creado = await repo('gabinete').save(
      repo('gabinete').create({
        nombre: nombre.trim(),
        marca: marca.trim(),
        costoUnitario: Number(costoUnitario),
        stockActual: Number(stockActual),
        stockMinimo: Number(stockMinimo),
        tamano,
        formato,
        materialChasis,
        panel,
        categoriaId: categoriaId || null,
        imagen,
      })
    );
    const producto = await repo('gabinete').findOne({
      where: { id: creado.id },
      select: {
        ...PRODUCT_FIELDS,
        categoria: { id: true, nombre: true },
      },
      relations: { categoria: true },
    });

    res.status(201).json(productoResponse(producto));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function editarProducto(req, res) {
  try {
    const body = req.body || {};
    const data = {};
    if (body.imagen) {
      const imagen = decodeImage(body.imagen);
      if (!imagen) {
        return res.status(400).json({
          error: 'La imagen debe ser PNG, JPG o WebP de hasta 5 MB.',
        });
      }
      data.imagen = imagen;
    }

    if (body.nombre !== undefined) data.nombre = body.nombre.trim();
    if (body.marca !== undefined) data.marca = body.marca.trim();
    if (body.costoUnitario !== undefined) data.costoUnitario = Number(body.costoUnitario);
    if (body.stockActual !== undefined) data.stockActual = Number(body.stockActual);
    if (body.stockMinimo !== undefined) data.stockMinimo = Number(body.stockMinimo);
    if (body.tamano !== undefined) data.tamano = body.tamano;
    if (body.formato !== undefined) data.formato = body.formato;
    if (body.materialChasis !== undefined) data.materialChasis = body.materialChasis;
    if (body.panel !== undefined) data.panel = body.panel;
    if (body.categoriaId !== undefined) data.categoriaId = body.categoriaId || null;
    if (body.activo !== undefined) data.activo = Boolean(body.activo);

    if (data.nombre !== undefined && !data.nombre) {
      return res.status(400).json({ error: 'El nombre es obligatorio' });
    }
    if (data.marca !== undefined && !data.marca) {
      return res.status(400).json({ error: 'La marca es obligatoria' });
    }
    if (data.costoUnitario !== undefined && (Number.isNaN(data.costoUnitario) || data.costoUnitario < 0)) {
      return res.status(400).json({ error: 'El costo unitario no es válido' });
    }
    if (data.stockActual !== undefined && (Number.isNaN(data.stockActual) || data.stockActual < 0)) {
      return res.status(400).json({ error: 'El stock actual no es válido' });
    }
    if (data.stockMinimo !== undefined && (Number.isNaN(data.stockMinimo) || data.stockMinimo < 0)) {
      return res.status(400).json({ error: 'El stock mínimo no es válido' });
    }

    if (data.categoriaId) {
      const categoria = await repo('CategoriaProducto').findOneBy({ id: data.categoriaId });
      if (!categoria) {
        return res.status(400).json({ error: 'La categoría seleccionada no existe' });
      }
    }

    if (!(await repo('gabinete').existsBy({ id: req.params.id }))) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    if (Object.keys(data).length) {
      await repo('gabinete').update({ id: req.params.id }, data);
    }
    const producto = await repo('gabinete').findOne({
      where: { id: req.params.id },
      select: {
        ...PRODUCT_FIELDS,
        categoria: { id: true, nombre: true },
      },
      relations: { categoria: true },
    });

    res.json(productoResponse(producto));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function eliminarProducto(req, res) {
  try {
    const { affected } = await repo('gabinete').delete({ id: req.params.id });
    if (!affected) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

module.exports = {
  listarProductos,
  obtenerProducto,
  obtenerImagenProducto,
  crearProducto,
  editarProducto,
  eliminarProducto,
};
