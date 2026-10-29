const express = require('express');
const router = express.Router();
const {
  listarColores,
  crearColor,
  editarColor,
  cambiarEstadoColor,
} = require('../controllers/color.controller');
const {
  verificarToken,
  verificarAdmin,
} = require('../middleware/auth.middleware');

router.get('/', verificarToken, verificarAdmin, listarColores);
router.post('/', verificarToken, verificarAdmin, crearColor);
router.put('/:id', verificarToken, verificarAdmin, editarColor);
router.patch('/:id/estado', verificarToken, verificarAdmin, cambiarEstadoColor);

module.exports = router;