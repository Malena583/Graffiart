const toOptions = (labels) =>
  Object.entries(labels).map(([value, label]) => ({ value, label }));

export const TAMANOS = {
  FULL_TOWER: "Full Tower",
  MID_TOWER: "Mid Tower",
  MINI_TOWER: "Mini Tower",
};

export const FORMATOS = {
  ATX: "ATX",
  MICRO_ATX: "Micro ATX",
  ITX: "ITX",
};

export const MATERIALES_CHASIS = {
  ACERO: "Acero",
  ALUMINIO: "Aluminio",
};

export const PANELES = {
  VIDRIO_TEMPLADO: "Vidrio templado",
  ACRILICO: "Acrílico",
  MALLADO: "Mallado",
};

export const SPEC_LABELS = {
  format: "Formato",
  size: "Tamaño",
  panel: "Panel",
  sidePanel: "Panel lateral",
};

export const CATEGORIAS_MATERIAL = [
  "MDF",
  "MELAMINA",
  "METAL",
  "VIDRIO",
  "ACERO",
  "ACCESORIO",
  "OTRO",
];

export const UNIDADES_MEDIDA = [
  "UNIDAD",
  "KG",
  "M",
  "M2",
  "CM",
  "LATA",
  "BOLSA",
];

export const TAMANO_OPTIONS = toOptions(TAMANOS);
export const FORMATO_OPTIONS = toOptions(FORMATOS);
export const MATERIAL_CHASIS_OPTIONS = toOptions(MATERIALES_CHASIS);
export const PANEL_OPTIONS = toOptions(PANELES);
export const CATEGORIA_MATERIAL_OPTIONS = CATEGORIAS_MATERIAL.map((value) => ({
  value,
  label: value,
}));
export const UNIDAD_MEDIDA_OPTIONS = UNIDADES_MEDIDA.map((value) => ({
  value,
  label: value,
}));
