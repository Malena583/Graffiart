const express = require('express');
const router = express.Router();
const {
    obtenerCarrito,
    agregarItem,
    actualizarCantidadItem,
    eliminarItem,
} = require('../controllers/carrito.controller');
const { verificarToken } = require('../middleware/auth.middleware');

router.use(verificarToken);

router.get('/', obtenerCarrito);
router.post('/items', agregarItem);
router.put('/items/:id', actualizarCantidadItem);
router.delete('/items/:id', eliminarItem);

module.exports = router;