export const FIELD_LABELS = {
  name: "El nombre",
  brand: "La marca",
  unitCost: "El costo unitario",
  currentStock: "El stock actual",
  minStock: "El stock mínimo",
  size: "El tamaño",
  format: "El formato",
  chassisMaterial: "El material del chasis",
  panel: "El tipo de panel",
  code: "El código",
  category: "La categoría",
  unit: "La unidad de medida",
};

export const VALIDATION = {
  required: (label) => `${label} es obligatorio.`,
  number: (label) => `${label} debe ser un número.`,
  nonNegative: (label) => `${label} no puede ser negativo.`,
  integer: (label) => `${label} debe ser un número entero.`,
  greaterThanZero: (label) => `${label} tiene que ser mayor a 0.`,
  designName: "El nombre del diseño es obligatorio.",
};
