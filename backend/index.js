require('dotenv').config();
const express = require('express');
const cors = require('cors');
const materialRoutes = require('./src/routes/material.routes');
const authRoutes = require('./src/routes/auth.routes');
const usuarioRoutes = require('./src/routes/usuario.routes');
const disenoRoutes = require('./src/routes/diseno.routes');
const carritoRoutes = require('./src/routes/carrito.routes');
const gabineteRoutes = require('./src/routes/gabinete.routes');
const categoriaRoutes = require('./src/routes/categoria.routes');
const productoRoutes = require('./src/routes/producto.routes');
const { initDataSource } = require('./src/lib/data-source');
const inventarioRoutes = require('./src/routes/inventario.routes');
const pedidoRoutes = require('./src/routes/pedido.routes');
const app = express();

app.use(cors());
app.use(express.json({ limit: '7mb' }));
app.use('/api/categorias', categoriaRoutes);
app.use('/api/productos', productoRoutes);

app.get('/', (req, res) => {
  res.json({ ok: true, message: 'API GraffiArt funcionando' });
});

app.use('/api/materiales', materialRoutes);
app.use('/api/inventario', inventarioRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/disenos', disenoRoutes);
app.use('/api/carrito', carritoRoutes);
app.use('/api/gabinetes', gabineteRoutes);
app.use('/api/pedidos', pedidoRoutes);

const PORT = process.env.PORT || 3000;
initDataSource()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('No se pudo conectar a la base de datos:', error.message);
    process.exit(1);
  });
