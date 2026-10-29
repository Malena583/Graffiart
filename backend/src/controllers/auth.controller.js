
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { repo } = require('../lib/data-source');

const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
async function login(req, res) {
  try {
    const { email, password } = req.body || {};
    if (typeof email !== 'string' || !email.trim() || typeof password !== 'string' || !password) {
      return res.status(400).json({ error: 'Debés ingresar email y contraseña' });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const usuario = await repo('usuario').findOneBy({ email: normalizedEmail });
    if (!usuario || !(await bcrypt.compare(password, usuario.passwordHash))) {
      return res.status(401).json({ error: 'Credenciales inválidas. Verificá tu email y contraseña.' });
    }
    const token = jwt.sign(
      { id: usuario.id, email: usuario.email, rol: usuario.rol },
      process.env.JWT_SECRET || 'graffiart-dev-secret',
      { expiresIn: '8h' }
    );
    res.json({
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellido: usuario.apellido,
        email: usuario.email,
        telefono: usuario.telefono,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error interno del servidor' });
  }
}

async function register(req, res) {
  try {
    const { nombre, apellido, email, password, telefono } = req.body || {};
    if (!nombre?.trim()) return res.status(400).json({ error: 'El nombre es obligatorio' });
    if (!apellido?.trim()) return res.status(400).json({ error: 'El apellido es obligatorio' });
    if (!email?.trim()) return res.status(400).json({ error: 'El email es obligatorio' });
    if (!password || password.length < 8) {
      return res.status(400).json({ error: 'La contraseña debe tener al menos 8 caracteres' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existente = await repo('usuario').findOneBy({ email: normalizedEmail });
    if (existente) return res.status(409).json({ error: 'Ya existe una cuenta con ese email' });

    const usuario = await repo('usuario').save(
      repo('usuario').create({
        nombre: nombre.trim(),
        apellido: apellido.trim(),
        email: normalizedEmail,
        passwordHash: await bcrypt.hash(password, 10),
        telefono: telefono?.trim() || null,
        emailVerificado: true,
      })
    );

    res.status(201).json({ message: 'Registro exitoso. Ya podés iniciar sesión.' });
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error al procesar el registro' });
  }
}

module.exports = {
  login,
  register,
};
