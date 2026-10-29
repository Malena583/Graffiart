
const crypto = require('crypto');
const { AppDataSource } = require('../lib/data-source');

const ESTADOS_PEDIDO = [
  'PENDIENTE',
  'CONFIRMADO',
  'EN_PREPARACION',
  'ENVIADO',
  'ENTREGADO',
  'CANCELADO',
];

const ESTADOS_PAGO = [
  'PENDIENTE',
  'PAGADO',
  'RECHAZADO',
  'REEMBOLSADO',
];

const errorPedido = (mensaje, status = 400) => {
  const error = new Error(mensaje);
  error.status = status;
  return error;
};

const hashSeguimiento = (codigo) =>
  crypto.createHash('sha256').update(codigo).digest('hex');

const generarCodigoPedido = () =>
  `GA-${crypto.randomBytes(8).toString('hex').toUpperCase()}`;

const numero = (valor) => Number(Number(valor).toFixed(2));

function obtenerUsuarioId(req) {
  return req.usuario?.id ?? req.usuario?.usuarioId ?? null;
}

function validarCliente(cliente) {
  const campos = [
    'nombre',
    'email',
    'direccionEnvio',
    'localidad',
    'provincia',
  ];

  for (const campo of campos) {
    if (
      typeof cliente?.[campo] !== 'string' ||
      !cliente[campo].trim()
    ) {
      throw errorPedido(`El campo ${campo} es obligatorio.`);
    }
  }

  if (
    cliente.nombre.length > 191 ||
    cliente.email.length > 191 ||
    cliente.direccionEnvio.length > 191 ||
    cliente.localidad.length > 100 ||
    cliente.provincia.length > 100 ||
    (cliente.telefono && cliente.telefono.length > 50) ||
    (cliente.codigoPostal && cliente.codigoPostal.length > 20)
  ) {
    throw errorPedido('Uno o más datos del cliente son demasiado largos.');
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cliente.email.trim())) {
    throw errorPedido('El correo electrónico no es válido.');
  }
}

function validarItems(items) {
  if (!Array.isArray(items) || items.length === 0) {
    throw errorPedido('El carrito está vacío.');
  }

  if (items.length > 50) {
    throw errorPedido('El pedido contiene demasiados artículos.');
  }

  for (const item of items) {
    if (
      !Number.isInteger(Number(item.cantidad)) ||
      Number(item.cantidad) < 1 ||
      Number(item.cantidad) > 100
    ) {
      throw errorPedido('Hay una cantidad de artículos no válida.');
    }

    if (!['GABINETE', 'PERSONALIZADO'].includes(item.tipo)) {
      throw errorPedido('Hay un tipo de artículo no válido.');
    }

    if (item.tipo === 'GABINETE' && !item.gabineteId) {
      throw errorPedido('Falta el identificador de un gabinete.');
    }

    if (
      item.tipo === 'PERSONALIZADO' &&
      (!item.configuracion ||
        typeof item.configuracion !== 'object' ||
        Array.isArray(item.configuracion))
    ) {
      throw errorPedido('La configuración de un gabinete no es válida.');
    }
  }
}

async function crearPedido(req, res) {
  const { cliente, items, metodoPago } = req.body || {};

  try {
    validarCliente(cliente);
    validarItems(items);

    // Solo se admite el medio de pago simulado.
    if (metodoPago !== 'SIMULADO') {
      throw errorPedido('El método de pago no es válido.');
    }

    const usuarioId = obtenerUsuarioId(req);

    const codigoSeguimiento = crypto.randomBytes(24).toString('hex');
    const codigoPedido = generarCodigoPedido();

    const resultado = await AppDataSource.transaction(
      async (manager) => {
        const pedidoRepo = manager.getRepository('pedido');
        const detalleRepo = manager.getRepository('detallepedido');
        const gabineteRepo = manager.getRepository('gabinete');
        const materialRepo = manager.getRepository('material');
        const tamanoRepo = manager.getRepository('tamanoconfigurador');
        const movimientoRepo = manager.getRepository('inventariomovimiento');

        const consumos = new Map();
        const detallesPreparados = [];
        let subtotal = 0;

        const agregarConsumo = (entidad, articuloId, cantidad) => {
          const clave = `${entidad}:${articuloId}`;
          const actual = consumos.get(clave);

          if (actual) {
            actual.cantidad += cantidad;
          } else {
            consumos.set(clave, {
              entidad,
              articuloId,
              cantidad,
              articulo: null,
            });
          }
        };

        // Primero se validan los artículos y se calculan los precios.
        // Todavía no se modifica el stock.
        for (const item of items) {
          const cantidad = Number(item.cantidad);
          let nombreArticulo;
          let precioUnitario;
          let gabineteId = null;
          let configuracion = null;

          if (item.tipo === 'GABINETE') {
            const gabinete = await gabineteRepo.findOne({
              where: { id: item.gabineteId, activo: true },
            });

            if (!gabinete) {
              throw errorPedido(
                'Uno de los gabinetes ya no está disponible.',
                409,
              );
            }

            nombreArticulo = gabinete.nombre;
            precioUnitario = Number(gabinete.costoUnitario);
            gabineteId = gabinete.id;

            agregarConsumo('gabinete', gabinete.id, cantidad);
          } else {
            const config = item.configuracion;
            const tamanoId = config.tamanoId ?? config.tamano;

            if (!tamanoId) {
              throw errorPedido('La configuración no tiene un tamaño.');
            }

            const tamano = await tamanoRepo.findOne({
              where: { codigo: tamanoId, activo: true },
            });

            if (!tamano) {
              throw errorPedido(
                'El tamaño seleccionado ya no está disponible.',
                409,
              );
            }

            const materialIds = Array.isArray(config.materialIds)
              ? config.materialIds
              : [];

            const accesorioIds = Array.isArray(config.accesorioIds)
              ? config.accesorioIds
              : [];

            if (new Set(materialIds).size !== materialIds.length) {
              throw errorPedido('Hay materiales repetidos.');
            }

            if (new Set(accesorioIds).size !== accesorioIds.length) {
              throw errorPedido('Hay accesorios repetidos.');
            }

            if (materialIds.some((id) => accesorioIds.includes(id))) {
              throw errorPedido(
                'Un artículo no puede ser material y accesorio a la vez.',
              );
            }

            precioUnitario = Number(tamano.precioBase);

            for (const materialId of [...materialIds, ...accesorioIds]) {
              const material = await materialRepo.findOne({
                where: { id: materialId, activo: true },
              });

              if (!material || material.costoUnitario == null) {
                throw errorPedido(
                  'Un material o accesorio ya no está disponible.',
                  409,
                );
              }

              const esAccesorio = accesorioIds.includes(materialId);

              if (
                (esAccesorio && material.categoria !== 'ACCESORIO') ||
                (!esAccesorio && material.categoria === 'ACCESORIO')
              ) {
                throw errorPedido('La categoría de un artículo no coincide.');
              }

              precioUnitario += Number(material.costoUnitario);
              agregarConsumo('material', material.id, cantidad);
            }

            // Se conserva la configuración como copia del momento de compra.
            // No se usa el ID temporal config-... como gabineteId.
            configuracion = {
              ...config,
              tamanoId,
              materialIds,
              accesorioIds,
            };

            nombreArticulo =
              `Gabinete personalizado - ${config.tamanoNombre || tamano.nombre}`;
          }

          precioUnitario = numero(precioUnitario);
          const totalDetalle = numero(precioUnitario * cantidad);
          subtotal = numero(subtotal + totalDetalle);

          detallesPreparados.push({
            gabineteId,
            tipo: item.tipo,
            nombreArticulo,
            cantidad,
            precioUnitario,
            subtotal: totalDetalle,
            configuracion,
          });
        }

        // Se bloquean las filas de inventario en un orden estable.
        const consumosOrdenados = [...consumos.values()].sort((a, b) =>
          `${a.entidad}:${a.articuloId}`.localeCompare(
            `${b.entidad}:${b.articuloId}`,
          ),
        );

        for (const consumo of consumosOrdenados) {
          const articuloRepo =
            consumo.entidad === 'gabinete' ? gabineteRepo : materialRepo;

          consumo.articulo = await articuloRepo.findOne({
            where: { id: consumo.articuloId },
            lock: { mode: 'pessimistic_write' },
          });

          if (!consumo.articulo || !consumo.articulo.activo) {
            throw errorPedido(
              'Un artículo dejó de estar disponible.',
              409,
            );
          }

          if (Number(consumo.articulo.stockActual) < consumo.cantidad) {
            throw errorPedido(
              `Stock insuficiente para ${consumo.articulo.nombre}.`,
              409,
            );
          }
        }

        // Se crea el pedido y sus detalles dentro de la misma transacción.
        const pedido = pedidoRepo.create({
          codigoPedido,
          usuarioId,
          clienteNombre: cliente.nombre.trim(),
          clienteEmail: cliente.email.trim().toLowerCase(),
          clienteTelefono: cliente.telefono?.trim() || null,
          direccionEnvio: cliente.direccionEnvio.trim(),
          localidad: cliente.localidad.trim(),
          provincia: cliente.provincia.trim(),
          codigoPostal: cliente.codigoPostal?.trim() || null,
          subtotal,
          costoEnvio: 0,
          total: subtotal,
          estado: 'PENDIENTE',
          estadoPago: 'PAGADO',
          metodoPago: 'SIMULADO',
          codigoSeguimientoHash: hashSeguimiento(codigoSeguimiento),
        });

        const pedidoGuardado = await pedidoRepo.save(pedido);

        for (const detalle of detallesPreparados) {
          await detalleRepo.save(
            detalleRepo.create({
              ...detalle,
              pedidoId: pedidoGuardado.id,
              configuracion: detalle.configuracion
                ? JSON.stringify(detalle.configuracion)
                : null,
            }),
          );
        }

        // Descuento de stock y movimientos en la misma transacción.
        for (const consumo of consumosOrdenados) {
          const articulo = consumo.articulo;
          articulo.stockActual =
            Number(articulo.stockActual) - consumo.cantidad;

          const articuloRepo =
            consumo.entidad === 'gabinete' ? gabineteRepo : materialRepo;

          await articuloRepo.save(articulo);

          await movimientoRepo.save(
            movimientoRepo.create({
              tipo: 'SALIDA',
              cantidad: consumo.cantidad,
              motivo: 'Pedido realizado',
              referencia: `PEDIDO:${codigoPedido}:SALIDA`,
              usuarioId: usuarioId || null,
              gabineteId:
                consumo.entidad === 'gabinete' ? articulo.id : null,
              materialId:
                consumo.entidad === 'material' ? articulo.id : null,
            }),
          );
        }

        return {
          id: pedidoGuardado.id,
          codigoPedido,
          estado: pedidoGuardado.estado,
          estadoPago: pedidoGuardado.estadoPago,
          subtotal,
          costoEnvio: 0,
          total: subtotal,
          detalles: detallesPreparados,
        };
      },
    );

    return res.status(201).json({
      mensaje: 'Pedido creado correctamente.',
      pedido: resultado,
      codigoSeguimiento,
    });
  } catch (error) {
    console.error('Error al crear pedido:', error);

    return res.status(error.status || 500).json({
      error:
        error.status
          ? error.message
          : 'No se pudo crear el pedido.',
    });
  }
}

async function obtenerMisPedidos(req, res) {
  try {
    const usuarioId = obtenerUsuarioId(req);

    if (!usuarioId) {
      return res.status(401).json({ error: 'Sesión no válida.' });
    }

    const pedidos = await AppDataSource.getRepository('pedido').find({
      where: { usuarioId },
      relations: { detalles: true },
      order: { createdAt: 'DESC' },
    });

    return res.json(pedidos);
  } catch (error) {
    console.error('Error al listar pedidos del cliente:', error);
    return res.status(500).json({ error: 'No se pudieron obtener los pedidos.' });
  }
}

async function obtenerPedidoPorSeguimiento(req, res) {
  const codigoPedido = String(req.query.codigoPedido || '').trim();
  const codigoSeguimiento = String(req.query.codigoSeguimiento || '').trim();

  if (!codigoPedido || !codigoSeguimiento) {
    return res.status(400).json({
      error: 'Ingresá el número de pedido y el código de seguimiento.',
    });
  }

  try {
    const pedidoRepo = AppDataSource.getRepository('pedido');

    const pedido = await pedidoRepo.findOne({
      where: {
        codigoPedido,
        codigoSeguimientoHash: hashSeguimiento(codigoSeguimiento),
      },
      relations: { detalles: true },
    });

    if (!pedido) {
      return res.status(404).json({
        error: 'No se encontró el pedido con esos datos.',
      });
    }

    // No se devuelve el hash del código privado.
    delete pedido.codigoSeguimientoHash;

    return res.json(pedido);
  } catch (error) {
    console.error('Error al consultar seguimiento:', error);
    return res.status(500).json({ error: 'No se pudo consultar el pedido.' });
  }
}

async function listarPedidos(req, res) {
  try {
    const pedidos = await AppDataSource.getRepository('pedido').find({
      relations: { detalles: true, usuario: true },
      select: {
        id: true,
        codigoPedido: true,
        usuarioId: true,
        clienteNombre: true,
        clienteEmail: true,
        clienteTelefono: true,
        direccionEnvio: true,
        localidad: true,
        provincia: true,
        codigoPostal: true,
        subtotal: true,
        costoEnvio: true,
        total: true,
        estado: true,
        estadoPago: true,
        metodoPago: true,
        createdAt: true,
        updatedAt: true,
        detalles: true,
        usuario: { id: true, nombre: true, apellido: true, email: true },
      },
      order: { createdAt: 'DESC' },
    });

    return res.json(pedidos);
  } catch (error) {
    console.error('Error al listar pedidos:', error);
    return res.status(500).json({ error: 'No se pudieron obtener los pedidos.' });
  }
}

async function actualizarEstadoPedido(req, res) {
  const { estado } = req.body || {};

  if (!ESTADOS_PEDIDO.includes(estado)) {
    return res.status(400).json({ error: 'El estado del pedido no es válido.' });
  }

  try {
    const pedidoActualizado = await AppDataSource.transaction(
      async (manager) => {
        const pedidoRepo = manager.getRepository('pedido');
        const detalleRepo = manager.getRepository('detallepedido');
        const gabineteRepo = manager.getRepository('gabinete');
        const materialRepo = manager.getRepository('material');
        const movimientoRepo = manager.getRepository('inventariomovimiento');

        const pedido = await pedidoRepo.findOne({
          where: { id: req.params.id },
          lock: { mode: 'pessimistic_write' },
        });

        if (!pedido) {
          throw errorPedido('No se encontró el pedido.', 404);
        }

        if (pedido.estado === 'CANCELADO') {
          throw errorPedido('El pedido ya está cancelado.', 409);
        }

        if (estado === 'CANCELADO') {
          const referenciaSalida = `PEDIDO:${pedido.codigoPedido}:SALIDA`;
          const referenciaDevolucion = `PEDIDO:${pedido.codigoPedido}:DEVOLUCION`;

          const devolucionExistente = await movimientoRepo.findOne({
            where: { referencia: referenciaDevolucion, tipo: 'ENTRADA' },
          });

          if (!devolucionExistente) {
            const salidas = await movimientoRepo.find({
              where: { referencia: referenciaSalida, tipo: 'SALIDA' },
            });

            for (const salida of salidas) {
              const entidad = salida.materialId ? 'material' : 'gabinete';
              const articuloId = salida.materialId || salida.gabineteId;

              if (!articuloId) continue;

              const articuloRepo =
                entidad === 'material' ? materialRepo : gabineteRepo;

              const articulo = await articuloRepo.findOne({
                where: { id: articuloId },
                lock: { mode: 'pessimistic_write' },
              });

              // Si el producto fue eliminado, no se puede reponer esa fila.
              if (!articulo) continue;

              articulo.stockActual =
                Number(articulo.stockActual) + Number(salida.cantidad);

              await articuloRepo.save(articulo);

              await movimientoRepo.save(
                movimientoRepo.create({
                  tipo: 'ENTRADA',
                  cantidad: salida.cantidad,
                  motivo: 'Cancelación de pedido',
                  referencia: referenciaDevolucion,
                  usuarioId: obtenerUsuarioId(req),
                  gabineteId: entidad === 'gabinete' ? articulo.id : null,
                  materialId: entidad === 'material' ? articulo.id : null,
                }),
              );
            }
          }
        }

        if (estado === 'ENTREGADO' && pedido.estadoPago !== 'PAGADO') {
          throw errorPedido(
            'No se puede entregar un pedido que no está pagado.',
            409,
          );
        }

        pedido.estado = estado;
        await pedidoRepo.save(pedido);

        return pedidoRepo.findOne({
          where: { id: pedido.id },
          relations: { detalles: true },
        });
      },
    );

    return res.json({
      mensaje: 'Estado del pedido actualizado.',
      pedido: pedidoActualizado,
    });
  } catch (error) {
    console.error('Error al actualizar estado del pedido:', error);

    return res.status(error.status || 500).json({
      error: error.status
        ? error.message
        : 'No se pudo actualizar el estado del pedido.',
    });
  }
}

module.exports = {
  crearPedido,
  listarPedidos,
  obtenerMisPedidos,
  obtenerPedidoPorSeguimiento,
  actualizarEstadoPedido,
};
