
const express = require('express');
const router = express.Router();

const {
  listarMovimientos,
  crearMovimiento,
} = require('../controllers/inventarioMovimiento.controller');

const {
  verificarToken,
  verificarAdmin,
} = require('../middleware/auth.middleware');

router.use(verificarToken, verificarAdmin);

router.get('/movimientos', listarMovimientos);
router.post('/movimientos', crearMovimiento);

module.exports = router;
