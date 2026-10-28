const express = require('express');
const router = express.Router();
const { getPerfil, updatePerfil } = require('../controllers/usuario.controller');
const { verificarToken } = require('../middleware/auth.middleware');

router.get('/perfil', verificarToken, getPerfil);
router.put('/perfil', verificarToken, updatePerfil);

module.exports = router;