const { repo } = require('../lib/data-source');

const RELACIONES_CARRITO = { itemcarrito: { gabinete: true, disenoguardado: true } };
const ORDEN_ITEMS = { itemcarrito: { createdAt: 'DESC' } };

function buscarCarrito(where) {
  return repo('carrito').findOne({ where, relations: RELACIONES_CARRITO, order: ORDEN_ITEMS });
}

async function actualizarCantidadItem(req, res){
  try {
    const { id } = req.params;
    const { cantidad } = req.body;

    if (!cantidad || parseInt(cantidad) <= 0) {
      return res.status(400).json({ error: 'La cantidad debe ser mayor a 0'});
    }

    const itemExistente = await repo('itemcarrito').findOneBy({
      id,
      carrito: { usuarioId: req.usuario.id },
    });

    if (!itemExistente) {
      return res.status(400).json({ error: 'Item no encontrado en el carrito'});
    }

    await repo('itemcarrito').update({ id }, { cantidad: parseInt(cantidad) });

    const carritoActualizado = await buscarCarrito({ usuarioId: req.usuario.id });

    res.json(calcularTotalesCarrito(carritoActualizado));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function eliminarItem(req, res) {
  try {
    const { id } = req.params;

    const itemExistente = await repo('itemcarrito').findOneBy({
      id,
      carrito: { usuarioId: req.usuario.id },
    });

    if (!itemExistente) {
      return res.status(404).json({ error: 'Item no encontrado en el carrito'});
    }

    await repo('itemcarrito').delete({ id });

    const carritoActualizado = await buscarCarrito({ usuarioId: req.usuario.id });

    res.json(calcularTotalesCarrito(carritoActualizado));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


function calcularTotalesCarrito(carrito) {
    if (!carrito || !carrito.itemcarrito) return { ...carrito, items: [], total: 0};

    const itemsConSubtotal = carrito.itemcarrito.map( item => {
        const subtotal = Number(item.precioUnitario) * item.cantidad;
        return {
            ...item,
            subtotal,
        };
    });

    const total = itemsConSubtotal.reduce((acc, item) => acc + item.subtotal, 0);
    return {
        ...carrito,
        items: itemsConSubtotal,
        total,
    };
}


async function obtenerCarrito(req, res) {
    try {
        let carrito = await buscarCarrito({ usuarioId: req.usuario.id });

        if (!carrito) {
            carrito = await repo('carrito').save(
                repo('carrito').create({ usuarioId: req.usuario.id })
            );
            carrito.itemcarrito = [];
        }

        const carritoConTotales = calcularTotalesCarrito(carrito);
        res.json(carritoConTotales);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}


async function agregarItem(req, res) {
    try {
        const { gabineteId, disenoGuardadoId, cantidad = 1 } = req.body;

        if (!gabineteId && !disenoGuardadoId) {
            return res.status(400).json({ error: 'No se especificó ningún producto o diseño para agregar al carrito.'})
        }

        let precioUnitario = 0;
        let gabinete = null;
        let diseno = null;

        if (gabineteId) {
          gabinete= await repo('gabinete').findOneBy({ id: gabineteId });

      if (!gabinete || !gabinete.activo) {
        return res.status(404).json({ error: 'El gabinete seleccionado no está disponible' });
      }
      precioUnitario += Number(gabinete.costoUnitario);
    }

    if (disenoGuardadoId) {
      diseno = await repo('disenoguardado').findOneBy({ id: disenoGuardadoId, usuarioId: req.usuario.id });

      if (!diseno) {
        return res.status(404).json({ error: 'El diseño guardado no fue encontrado' });
      }
      const costoDiseno = 0; //Modificar aca el costo de diseño para sumar al total
      precioUnitario += costoDiseno; 
    }

    //Verifica si el usuario tiene un carrito activo
    let carrito = await repo('carrito').findOneBy({ usuarioId: req.usuario.id });

    if (!carrito) {
      carrito = await repo('carrito').save(
        repo('carrito').create({ usuarioId: req.usuario.id })
      );
    }

    //Verifica si el item ya existe en el carrito para sumar la cantidad o crearlo
    const itemExistente = await repo('itemcarrito').findOneBy({
      carritoId: carrito.id,
      ...(gabineteId ? { gabineteId } : { disenoGuardadoId }),
    });

    const cantidadAEnviar = parseInt(cantidad) > 0 ? parseInt(cantidad) : 1;

    if (itemExistente) {
      await repo('itemcarrito').update(
        { id: itemExistente.id },
        { cantidad: itemExistente.cantidad + cantidadAEnviar }
      );
    } else {
      await repo('itemcarrito').save(
        repo('itemcarrito').create({
          carritoId: carrito.id,
          gabineteId: gabineteId || null,
          disenoGuardadoId: disenoGuardadoId || null,
          cantidad: cantidadAEnviar,
          precioUnitario,
        })
      );
    }

    // Devolver el carrito completo y actualizado con sus subtotales y totales calculados
    const carritoActualizado = await buscarCarrito({ id: carrito.id });

    const resultadoFinal = calcularTotalesCarrito(carritoActualizado);
    res.status(201).json(resultadoFinal);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}


module.exports = {
    obtenerCarrito,
    agregarItem,
    actualizarCantidadItem,
    eliminarItem,
};