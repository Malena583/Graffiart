// Crea las tablas de colores de personalización y diseños visuales de gabinetes.
// Solo agrega tablas nuevas: no modifica ni elimina datos existentes.
module.exports = class CrearDisenosColores1793290000000 {
  async up(queryRunner) {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS colorconfigurador (
        id VARCHAR(191) NOT NULL,
        nombre VARCHAR(50) NOT NULL,
        codigoHex VARCHAR(7) NOT NULL,
        activo TINYINT(1) NOT NULL DEFAULT 1,
        createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
          ON UPDATE CURRENT_TIMESTAMP(3),
        PRIMARY KEY (id),
        UNIQUE KEY UQ_colorconfigurador_nombre (nombre)
      ) ENGINE=InnoDB
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS disenogabinete (
        id VARCHAR(191) NOT NULL,
        nombre VARCHAR(120) NOT NULL,
        descripcion TEXT DEFAULT NULL,
        imagenFrontal LONGBLOB DEFAULT NULL,
        imagenIzquierda LONGBLOB DEFAULT NULL,
        activo TINYINT(1) NOT NULL DEFAULT 1,
        createdAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
        updatedAt DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
          ON UPDATE CURRENT_TIMESTAMP(3),
        PRIMARY KEY (id),
        UNIQUE KEY UQ_disenogabinete_nombre (nombre)
      ) ENGINE=InnoDB
    `);

    // Tamaños compatibles con cada diseño.
    // Si se borra un diseño, se borran sus relaciones.
    // Si un tamaño está en uso por un diseño, la base NO deja eliminarlo.
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS disenogabinetetamano (
        disenoId VARCHAR(191) NOT NULL,
        tamanoCodigo VARCHAR(30) NOT NULL,
        PRIMARY KEY (disenoId, tamanoCodigo),
        KEY IDX_disenogabinetetamano_tamano (tamanoCodigo),
        CONSTRAINT FK_disenogabinetetamano_diseno
          FOREIGN KEY (disenoId) REFERENCES disenogabinete(id)
          ON DELETE CASCADE,
        CONSTRAINT FK_disenogabinetetamano_tamano
          FOREIGN KEY (tamanoCodigo) REFERENCES tamanoconfigurador(codigo)
          ON DELETE RESTRICT
      ) ENGINE=InnoDB
    `);
  }

  async down(queryRunner) {
    await queryRunner.query('DROP TABLE IF EXISTS disenogabinetetamano');
    await queryRunner.query('DROP TABLE IF EXISTS disenogabinete');
    await queryRunner.query('DROP TABLE IF EXISTS colorconfigurador');
  }
};