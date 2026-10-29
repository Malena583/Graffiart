
const { MigrationInterface } = require('typeorm');

module.exports = class CrearTablasPedidos1793285941389 {
  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TABLE pedido (
        id VARCHAR(191) NOT NULL,
        codigoPedido VARCHAR(30) NOT NULL,
        usuarioId VARCHAR(191) DEFAULT NULL,
        clienteNombre VARCHAR(191) NOT NULL,
        clienteEmail VARCHAR(191) NOT NULL,
        clienteTelefono VARCHAR(50) DEFAULT NULL,
        direccionEnvio VARCHAR(191) NOT NULL,
        localidad VARCHAR(100) NOT NULL,
        provincia VARCHAR(100) NOT NULL,
        codigoPostal VARCHAR(20) DEFAULT NULL,
        subtotal DECIMAL(10,2) NOT NULL,
        costoEnvio DECIMAL(10,2) NOT NULL DEFAULT 0.00,
        total DECIMAL(10,2) NOT NULL,
        estado ENUM(
          'PENDIENTE', 'CONFIRMADO', 'EN_PREPARACION',
          'ENVIADO', 'ENTREGADO', 'CANCELADO'
        ) NOT NULL DEFAULT 'PENDIENTE',
        estadoPago ENUM(
          'PENDIENTE', 'PAGADO', 'RECHAZADO', 'REEMBOLSADO'
        ) NOT NULL DEFAULT 'PENDIENTE',
        metodoPago VARCHAR(50) DEFAULT NULL,
        codigoSeguimientoHash VARCHAR(191) DEFAULT NULL,
        createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
          ON UPDATE CURRENT_TIMESTAMP(3),
        PRIMARY KEY (id),
        UNIQUE KEY UQ_pedido_codigoPedido (codigoPedido),
        UNIQUE KEY UQ_pedido_codigoSeguimientoHash (codigoSeguimientoHash),
        KEY IDX_pedido_usuarioId (usuarioId),
        CONSTRAINT FK_pedido_usuario
          FOREIGN KEY (usuarioId) REFERENCES usuario(id)
          ON DELETE SET NULL
      ) ENGINE=InnoDB
        DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
    `);

    await queryRunner.query(`
      CREATE TABLE detallepedido (
        id VARCHAR(191) NOT NULL,
        pedidoId VARCHAR(191) NOT NULL,
        gabineteId VARCHAR(191) DEFAULT NULL,
        tipo ENUM('GABINETE', 'PERSONALIZADO') NOT NULL,
        nombreArticulo VARCHAR(191) NOT NULL,
        cantidad INT NOT NULL,
        precioUnitario DECIMAL(10,2) NOT NULL,
        subtotal DECIMAL(10,2) NOT NULL,
        configuracion LONGTEXT DEFAULT NULL,
        PRIMARY KEY (id),
        KEY IDX_detallepedido_pedidoId (pedidoId),
        KEY IDX_detallepedido_gabineteId (gabineteId),
        CONSTRAINT FK_detallepedido_pedido
          FOREIGN KEY (pedidoId) REFERENCES pedido(id)
          ON DELETE CASCADE,
        CONSTRAINT FK_detallepedido_gabinete
          FOREIGN KEY (gabineteId) REFERENCES gabinete(id)
          ON DELETE SET NULL
      ) ENGINE=InnoDB
        DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci
    `);
  }

  async down(queryRunner) {
    await queryRunner.query('DROP TABLE IF EXISTS detallepedido');
    await queryRunner.query('DROP TABLE IF EXISTS pedido');
  }
};
