const { EntitySchema } = require('typeorm');

const id = { type: 'varchar', length: 191, primary: true, generated: 'uuid' };
const createdAt = { type: 'datetime', precision: 3, createDate: true, default: () => 'CURRENT_TIMESTAMP(3)' };
const updatedAt = { type: 'datetime', precision: 3, updateDate: true, default: () => 'CURRENT_TIMESTAMP(3)', onUpdate: 'CURRENT_TIMESTAMP(3)' };
const dinero = { type: 'decimal', precision: 10, scale: 2 };

const Usuario = new EntitySchema({
  name: 'usuario',
  tableName: 'usuario',
  columns: {
    id,
    nombre: { type: 'varchar', length: 191 },
    apellido: { type: 'varchar', length: 191 },
    email: { type: 'varchar', length: 191, unique: true },
    passwordHash: { type: 'varchar', length: 191 },
    telefono: { type: 'varchar', length: 191, nullable: true },
    fechaRegistro: { type: 'datetime', precision: 3, createDate: true, default: () => 'CURRENT_TIMESTAMP(3)' },
    emailVerificado: { type: 'boolean', default: false },
    rol: { type: 'enum', enum: ['CLIENTE', 'ADMIN'], default: 'CLIENTE' },
  },
  relations: {
    carrito: { type: 'one-to-one', target: 'carrito', inverseSide: 'usuario' },
    disenoguardado: { type: 'one-to-many', target: 'disenoguardado', inverseSide: 'usuario' },
    inventariomovimiento: { type: 'one-to-many', target: 'inventariomovimiento', inverseSide: 'usuario' },
    pedidos: { type: 'one-to-many', target: 'pedido', inverseSide: 'usuario' },
  },
});

const Carrito = new EntitySchema({
  name: 'carrito',
  tableName: 'carrito',
  columns: {
    id,
    usuarioId: { type: 'varchar', length: 191, unique: true },
    createdAt,
    updatedAt,
  },
  relations: {
    usuario: {
      type: 'one-to-one',
      target: 'usuario',
      joinColumn: { name: 'usuarioId' },
      onDelete: 'CASCADE',
      inverseSide: 'carrito',
    },
    itemcarrito: { type: 'one-to-many', target: 'itemcarrito', inverseSide: 'carrito' },
  },
});

const ItemCarrito = new EntitySchema({
  name: 'itemcarrito',
  tableName: 'itemcarrito',
  columns: {
    id,
    carritoId: { type: 'varchar', length: 191 },
    gabineteId: { type: 'varchar', length: 191, nullable: true },
    disenoGuardadoId: { type: 'varchar', length: 191, nullable: true },
    cantidad: { type: 'int', default: 1 },
    precioUnitario: dinero,
    createdAt,
    updatedAt,
  },
  relations: {
    carrito: {
      type: 'many-to-one',
      target: 'carrito',
      joinColumn: { name: 'carritoId' },
      onDelete: 'CASCADE',
      inverseSide: 'itemcarrito',
    },
    disenoguardado: {
      type: 'many-to-one',
      target: 'disenoguardado',
      joinColumn: { name: 'disenoGuardadoId' },
      nullable: true,
      inverseSide: 'itemcarrito',
    },
    gabinete: {
      type: 'many-to-one',
      target: 'gabinete',
      joinColumn: { name: 'gabineteId' },
      nullable: true,
      inverseSide: 'itemcarrito',
    },
  },
});

// Diseños PERSONALES guardados por cada cliente (no es el catálogo de diseños visuales).
const DisenoGuardado = new EntitySchema({
  name: 'disenoguardado',
  tableName: 'disenoguardado',
  columns: {
    id,
    nombre: { type: 'varchar', length: 120 },
    descripcion: { type: 'text', nullable: true },
    configuracion: { type: 'longtext' },
    createdAt,
    updatedAt,
    usuarioId: { type: 'varchar', length: 191 },
  },
  relations: {
    usuario: {
      type: 'many-to-one',
      target: 'usuario',
      joinColumn: { name: 'usuarioId' },
      onDelete: 'CASCADE',
      inverseSide: 'disenoguardado',
    },
    itemcarrito: { type: 'one-to-many', target: 'itemcarrito', inverseSide: 'disenoguardado' },
  },
});

const Gabinete = new EntitySchema({
  name: 'gabinete',
  tableName: 'gabinete',
  columns: {
    id,
    nombre: { type: 'varchar', length: 150 },
    marca: { type: 'varchar', length: 150 },
    costoUnitario: dinero,
    stockActual: { type: 'int', default: 0 },
    stockMinimo: { type: 'int', default: 0 },
    createdAt,
    updatedAt,
    activo: { type: 'boolean', default: true },
    formato: { type: 'enum', enum: ['ATX', 'MICRO_ATX', 'ITX'] },
    materialChasis: { type: 'enum', enum: ['ACERO', 'ALUMINIO'] },
    panel: { type: 'enum', enum: ['VIDRIO_TEMPLADO', 'ACRILICO', 'MALLADO'] },
    tamano: { type: 'enum', enum: ['FULL_TOWER', 'MID_TOWER', 'MINI_TOWER'] },
    categoriaId: { type: 'varchar', length: 191, nullable: true },
    imagen: { type: 'longblob', nullable: true },
  },
  relations: {
    categoria: {
      type: 'many-to-one',
      target: 'CategoriaProducto',
      joinColumn: { name: 'categoriaId' },
      onDelete: 'SET NULL',
      nullable: true,
      inverseSide: 'productos',
    },
    inventariomovimiento: { type: 'one-to-many', target: 'inventariomovimiento', inverseSide: 'gabinete' },
    itemcarrito: { type: 'one-to-many', target: 'itemcarrito', inverseSide: 'gabinete' },
  },
});

const CategoriaProducto = new EntitySchema({
  name: 'CategoriaProducto',
  tableName: 'CategoriaProducto',
  columns: {
    id,
    nombre: { type: 'varchar', length: 100, unique: true },
    descripcion: { type: 'text', nullable: true },
    activo: { type: 'boolean', default: true },
    createdAt,
    updatedAt,
  },
  relations: {
    productos: { type: 'one-to-many', target: 'gabinete', inverseSide: 'categoria' },
  },
});

const Material = new EntitySchema({
  name: 'material',
  tableName: 'material',
  columns: {
    id,
    nombre: { type: 'varchar', length: 150 },
    codigo: { type: 'varchar', length: 50, unique: true },
    categoria: { type: 'enum', enum: ['MDF', 'MELAMINA', 'METAL', 'VIDRIO', 'ACERO', 'ACCESORIO', 'OTRO'] },
    unidadMedida: { type: 'enum', enum: ['UNIDAD', 'KG', 'M', 'M2', 'CM', 'LATA', 'BOLSA'] },
    stockActual: { type: 'int', default: 0 },
    stockMinimo: { type: 'int', default: 0 },
    costoUnitario: { ...dinero, nullable: true },
    descripcion: { type: 'text', nullable: true },
    activo: { type: 'boolean', default: true },
    createdAt,
    updatedAt,
  },
  relations: {
    inventariomovimiento: { type: 'one-to-many', target: 'inventariomovimiento', inverseSide: 'material' },
  },
});

const TamanoConfigurador = new EntitySchema({
  name: 'tamanoconfigurador',
  tableName: 'tamanoconfigurador',
  columns: {
    codigo: { type: 'varchar', length: 30, primary: true },
    nombre: { type: 'varchar', length: 50 },
    precioBase: dinero,
    altoMinCm: { type: 'int' },
    altoMaxCm: { type: 'int' },
    anchoMinCm: { type: 'int' },
    anchoMaxCm: { type: 'int' },
    profundidadMinCm: { type: 'int' },
    profundidadMaxCm: { type: 'int' },
    activo: { type: 'boolean', default: true },
  },
});

// Colores de PERSONALIZACIÓN del configurador (distintos de los atributos de los productos del catálogo).
const ColorConfigurador = new EntitySchema({
  name: 'colorconfigurador',
  tableName: 'colorconfigurador',
  columns: {
    id,
    nombre: { type: 'varchar', length: 50, unique: true },
    codigoHex: { type: 'varchar', length: 7 },
    activo: { type: 'boolean', default: true },
    createdAt,
    updatedAt,
  },
});

// Diseños VISUALES de gabinetes administrados desde el panel (no son los diseños personales de los clientes).
const DisenoGabinete = new EntitySchema({
  name: 'disenogabinete',
  tableName: 'disenogabinete',
  columns: {
    id,
    nombre: { type: 'varchar', length: 120, unique: true },
    descripcion: { type: 'text', nullable: true },
    imagenFrontal: { type: 'longblob', nullable: true },
    imagenIzquierda: { type: 'longblob', nullable: true },
    activo: { type: 'boolean', default: true },
    createdAt,
    updatedAt,
  },
  relations: {
    tamanos: {
      type: 'many-to-many',
      target: 'tamanoconfigurador',
      joinTable: {
        name: 'disenogabinetetamano',
        joinColumn: { name: 'disenoId', referencedColumnName: 'id' },
        inverseJoinColumn: { name: 'tamanoCodigo', referencedColumnName: 'codigo' },
      },
    },
  },
});

const InventarioMovimiento = new EntitySchema({
  name: 'inventariomovimiento',
  tableName: 'inventariomovimiento',
  columns: {
    id,
    materialId: { type: 'varchar', length: 191, nullable: true },
    tipo: { type: 'enum', enum: ['ENTRADA', 'SALIDA', 'AJUSTE'] },
    cantidad: { type: 'int' },
    motivo: { type: 'varchar', length: 191, nullable: true },
    referencia: { type: 'varchar', length: 191, nullable: true },
    fecha: { type: 'datetime', precision: 3, default: () => 'CURRENT_TIMESTAMP(3)' },
    usuarioId: { type: 'varchar', length: 191, nullable: true },
    createdAt,
    gabineteId: { type: 'varchar', length: 191, nullable: true },
  },
  relations: {
    gabinete: {
      type: 'many-to-one',
      target: 'gabinete',
      joinColumn: { name: 'gabineteId' },
      nullable: true,
      inverseSide: 'inventariomovimiento',
    },
    material: {
      type: 'many-to-one',
      target: 'material',
      joinColumn: { name: 'materialId' },
      onDelete: 'CASCADE',
      nullable: true,
      inverseSide: 'inventariomovimiento',
    },
    usuario: {
      type: 'many-to-one',
      target: 'usuario',
      joinColumn: { name: 'usuarioId' },
      nullable: true,
      inverseSide: 'inventariomovimiento',
    },
  },
});

const Pedido = new EntitySchema({
  name: 'pedido',
  tableName: 'pedido',
  columns: {
    id,
    codigoPedido: { type: 'varchar', length: 30, unique: true },
    usuarioId: { type: 'varchar', length: 191, nullable: true },

    // Datos del cliente guardados al realizar la compra
    clienteNombre: { type: 'varchar', length: 191 },
    clienteEmail: { type: 'varchar', length: 191 },
    clienteTelefono: { type: 'varchar', length: 50, nullable: true },

    // Datos de envío
    direccionEnvio: { type: 'varchar', length: 191 },
    localidad: { type: 'varchar', length: 100 },
    provincia: { type: 'varchar', length: 100 },
    codigoPostal: { type: 'varchar', length: 20, nullable: true },

    subtotal: dinero,
    costoEnvio: { ...dinero, default: 0 },
    total: dinero,

    estado: {
      type: 'enum',
      enum: [
        'PENDIENTE',
        'CONFIRMADO',
        'EN_PREPARACION',
        'ENVIADO',
        'ENTREGADO',
        'CANCELADO',
      ],
      default: 'PENDIENTE',
    },

    estadoPago: {
      type: 'enum',
      enum: ['PENDIENTE', 'PAGADO', 'RECHAZADO', 'REEMBOLSADO'],
      default: 'PENDIENTE',
    },

    metodoPago: { type: 'varchar', length: 50, nullable: true },

    // Se guarda el hash, nunca el código privado en texto plano
    codigoSeguimientoHash: {
      type: 'varchar',
      length: 191,
      nullable: true,
      unique: true,
    },

    createdAt,
    updatedAt,
  },
  relations: {
    usuario: {
      type: 'many-to-one',
      target: 'usuario',
      joinColumn: { name: 'usuarioId' },
      nullable: true,
      onDelete: 'SET NULL',
      inverseSide: 'pedidos',
    },
    detalles: {
      type: 'one-to-many',
      target: 'detallepedido',
      inverseSide: 'pedido',
    },
  },
});

const DetallePedido = new EntitySchema({
  name: 'detallepedido',
  tableName: 'detallepedido',
  columns: {
    id,
    pedidoId: { type: 'varchar', length: 191 },
    gabineteId: { type: 'varchar', length: 191, nullable: true },

    tipo: {
      type: 'enum',
      enum: ['GABINETE', 'PERSONALIZADO'],
    },

    // Copia de los datos del artículo al momento de comprar
    nombreArticulo: { type: 'varchar', length: 191 },
    cantidad: { type: 'int' },
    precioUnitario: dinero,
    subtotal: dinero,

    // Configuración del gabinete personalizado en formato JSON
    configuracion: { type: 'longtext', nullable: true },
  },
  relations: {
    pedido: {
      type: 'many-to-one',
      target: 'pedido',
      joinColumn: { name: 'pedidoId' },
      onDelete: 'CASCADE',
      inverseSide: 'detalles',
    },
    gabinete: {
      type: 'many-to-one',
      target: 'gabinete',
      joinColumn: { name: 'gabineteId' },
      nullable: true,
      onDelete: 'SET NULL',
    },
  },
});

module.exports = [
  Usuario,
  Carrito,
  ItemCarrito,
  DisenoGuardado,
  Gabinete,
  CategoriaProducto,
  Material,
  TamanoConfigurador,
  ColorConfigurador,
  DisenoGabinete,
  InventarioMovimiento,
  Pedido,
  DetallePedido,
];
