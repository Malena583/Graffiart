const express = require('express');
const router = express.Router();
const {
  listarProductos,
  obtenerProducto,
  obtenerImagenProducto,
  crearProducto,
  editarProducto,
  eliminarProducto,
} = require('../controllers/producto.controller');
const {
  verificarToken,
  verificarAdmin,
} = require('../middleware/auth.middleware');

router.get('/:id/imagen', obtenerImagenProducto);

router.use(verificarToken, verificarAdmin);

router.get('/', listarProductos);
router.get('/:id', obtenerProducto);
router.post('/', crearProducto);
router.put('/:id', editarProducto);
router.delete('/:id', eliminarProducto);

module.exports = router;
