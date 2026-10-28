const jwt = require('jsonwebtoken');

function verificarToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token requerido' });
  }
  try {
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'graffiart-dev-secret');
    req.usuario = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
}

function verificarAdmin(req, res, next) {
  if (req.usuario?.rol !== 'ADMIN') {
    return res.status(403).json({
      error: 'Acceso denegado. Se requieren permisos de administrador.',
    });
  }

  next();
}

module.exports = { verificarToken, verificarAdmin };