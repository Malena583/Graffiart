CREATE TABLE IF NOT EXISTS `tamanoconfigurador` (
  `codigo` VARCHAR(30) NOT NULL,
  `nombre` VARCHAR(50) NOT NULL,
  `precioBase` DECIMAL(10, 2) NOT NULL,
  `altoMinCm` INT NOT NULL,
  `altoMaxCm` INT NOT NULL,
  `anchoMinCm` INT NOT NULL,
  `anchoMaxCm` INT NOT NULL,
  `profundidadMinCm` INT NOT NULL,
  `profundidadMaxCm` INT NOT NULL,
  `activo` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`codigo`)
);

INSERT IGNORE INTO `tamanoconfigurador`
  (`codigo`, `nombre`, `precioBase`, `altoMinCm`, `altoMaxCm`, `anchoMinCm`, `anchoMaxCm`, `profundidadMinCm`, `profundidadMaxCm`, `activo`)
VALUES
  ('MINI_TOWER', 'Mini Tower', 45000, 30, 40, 15, 20, 30, 45, 1),
  ('MID_TOWER', 'Mid Tower', 50000, 40, 50, 18, 25, 40, 50, 1),
  ('FULL_TOWER', 'Full Tower', 70000, 55, 70, 23, 30, 50, 65, 1);
