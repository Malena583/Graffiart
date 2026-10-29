const express = require('express');
const router = express.Router();
const {
  listarTamanos,
  crearTamano,
  editarTamano,
  eliminarTamano,
} = require('../controllers/tamano.controller');
const {
  verificarToken,
  verificarAdmin,
} = require('../middleware/auth.middleware');
 
router.get('/', verificarToken, verificarAdmin, listarTamanos);
router.post('/', verificarToken, verificarAdmin, crearTamano);
router.put('/:codigo', verificarToken, verificarAdmin, editarTamano);
router.delete('/:codigo', verificarToken, verificarAdmin, eliminarTamano);
 
module.exports = router;