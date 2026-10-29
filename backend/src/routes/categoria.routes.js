const express = require('express');
const router = express.Router();
const {
  listarCategorias,
  crearCategoria,
  editarCategoria,
  eliminarCategoria,
} = require('../controllers/categoria.controller');
const {
  verificarToken,
  verificarAdmin,
} = require('../middleware/auth.middleware');

router.get('/', listarCategorias);
router.post('/', verificarToken, verificarAdmin, crearCategoria);
router.put('/:id', verificarToken, verificarAdmin, editarCategoria);
router.delete('/:id', verificarToken, verificarAdmin, eliminarCategoria);

module.exports = router;
