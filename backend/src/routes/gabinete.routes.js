const express = require('express');
const router = express.Router();
const {
  obtenerGabinetes,
  obtenerGabinetePorId,
  listarTamanosConfigurador,
  validarConfiguracion,
} = require('../controllers/gabinete.controller');
const { listarColoresConfigurador } = require('../controllers/color.controller');
 
router.get('/', obtenerGabinetes);
router.get('/tamanos-configuracion', listarTamanosConfigurador);
router.get('/colores-configuracion', listarColoresConfigurador);
router.post('/validar-configuracion', validarConfiguracion);
 
router.get('/:id', obtenerGabinetePorId);
 
module.exports = router;