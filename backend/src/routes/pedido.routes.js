
const express = require('express');
const router = express.Router();

const {
  crearPedido,
  listarPedidos,
  obtenerMisPedidos,
  obtenerPedidoPorSeguimiento,
  actualizarEstadoPedido,
} = require('../controllers/pedido.controller');

const {
  verificarToken,
  verificarTokenOpcional,
  verificarAdmin,
} = require('../middleware/auth.middleware');

// Crear pedido: permite clientes registrados e invitados
router.post('/', verificarTokenOpcional, crearPedido);

// Seguimiento de pedidos para invitados
router.get('/seguimiento', obtenerPedidoPorSeguimiento);

// Pedidos del cliente que inició sesión
router.get('/mis-pedidos', verificarToken, obtenerMisPedidos);

// Administración de pedidos
router.get('/', verificarToken, verificarAdmin, listarPedidos);
router.patch(
  '/:id/estado',
  verificarToken,
  verificarAdmin,
  actualizarEstadoPedido
);

module.exports = router;
