const express = require('express');
const router = express.Router();
const {
  crearMaterial,
  listarMateriales,
  obtenerMaterial,
  editarMaterial,
  eliminarMaterial,
} = require('../controllers/material.controller');
const { verificarToken, verificarAdmin } = require('../middleware/auth.middleware');  

router.get('/', listarMateriales);
router.get('/:id', obtenerMaterial);

router.post('/', verificarToken, verificarAdmin, crearMaterial);
router.put('/:id', verificarToken, verificarAdmin, editarMaterial);
router.delete('/:id', verificarToken, verificarAdmin, eliminarMaterial);


module.exports = router;