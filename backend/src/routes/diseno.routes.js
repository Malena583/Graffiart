const express = require('express');
const router = express.Router();
const { listarDisenos, crearDiseno, actualizarDiseno, eliminarDiseno } = require('../controllers/diseno.controller');
const { verificarToken } = require('../middleware/auth.middleware');

router.use(verificarToken);
router.get('/', listarDisenos);
router.post('/', crearDiseno);
router.put('/:id', actualizarDiseno);
router.delete('/:id', eliminarDiseno);

module.exports = router;
