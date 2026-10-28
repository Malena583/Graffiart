const express = require('express');
const router = express.Router();
const {
  obtenerGabinetes,
  obtenerGabinetePorId,
  listarTamanosConfigurador,
  validarConfiguracion,
} = require('../controllers/gabinete.controller');

router.get('/', obtenerGabinetes);
router.get('/tamanos-configuracion', listarTamanosConfigurador);
router.post('/validar-configuracion', validarConfiguracion);

router.get('/:id', obtenerGabinetePorId);

module.exports = router;