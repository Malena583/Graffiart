// frontend/src/constants/TAMANOS.js
// Textos y configuración del formulario de Tamaños del configurador.
 
// Etiquetas para los mensajes de validación (schemas/tamano.js).
// Llevan artículo porque se usan en frases como "El código es obligatorio."
export const TAMANO_LABELS = {
  code: "El código",
  name: "El nombre",
  basePrice: "El precio base",
  heightMin: "El alto mínimo",
  heightMax: "El alto máximo",
  widthMin: "El ancho mínimo",
  widthMax: "El ancho máximo",
  depthMin: "La profundidad mínima",
  depthMax: "La profundidad máxima",
};
 
const cmField = (name, label, placeholder) => ({
  name,
  label,
  type: "number",
  min: 1,
  max: 1000,
  step: 1,
  placeholder,
  half: true,
});
 
export const TAMANO_FORM = {
  initialValues: {
    codigo: "",
    nombre: "",
    precioBase: "",
    altoMinCm: "",
    altoMaxCm: "",
    anchoMinCm: "",
    anchoMaxCm: "",
    profundidadMinCm: "",
    profundidadMaxCm: "",
    activo: "true",
  },
  fields: [
    {
      name: "codigo",
      label: "Código",
      placeholder: "MID_TOWER",
      maxLength: 30,
      half: true,
    },
    {
      name: "nombre",
      label: "Nombre",
      placeholder: "Mid Tower",
      maxLength: 50,
      half: true,
    },
    {
      name: "precioBase",
      label: "Precio base",
      type: "number",
      min: 0,
      step: "0.01",
      placeholder: "0.00",
      half: true,
    },
    {
      name: "activo",
      label: "Estado",
      type: "select",
      options: [
        { value: "true", label: "Activo" },
        { value: "false", label: "Inactivo" },
      ],
      half: true,
    },
    cmField("altoMinCm", "Alto mínimo (cm)", "Ej: 40"),
    cmField("altoMaxCm", "Alto máximo (cm)", "Ej: 50"),
    cmField("anchoMinCm", "Ancho mínimo (cm)", "Ej: 18"),
    cmField("anchoMaxCm", "Ancho máximo (cm)", "Ej: 25"),
    cmField("profundidadMinCm", "Profundidad mínima (cm)", "Ej: 40"),
    cmField("profundidadMaxCm", "Profundidad máxima (cm)", "Ej: 50"),
  ],
  columns: {
    code: "Código",
    name: "Nombre",
    price: "Precio base",
    dimensions: "Medidas (cm)",
    designs: "Diseños",
    status: "Estado",
    actions: "Acciones",
  },
  // Etiquetas cortas para la columna de medidas de la tabla
  height: "Alto",
  width: "Ancho",
  depth: "Prof.",
  statusActive: "Activo",
  statusInactive: "Inactivo",
  pageTitle: "Tamaños",
  createButton: "Crear tamaño",
  createTitle: "Crear tamaño",
  editTitle: "Editar tamaño",
  createLabel: "Crear",
  emptyText: "Todavía no hay tamaños registrados.",
};
 
export const TAMANO_MESSAGES = {
  subtitle:
    "Administrá los tamaños de gabinete disponibles en el configurador.",
  loadError: "No se pudieron cargar los tamaños.",
  saveError: "No se pudo guardar el tamaño.",
  deleteError: "No se pudo eliminar el tamaño.",
  created: "Tamaño creado correctamente.",
  updated: "Tamaño actualizado correctamente.",
  deleted: "Tamaño eliminado correctamente.",
  confirmDeleteTitle: "Eliminar tamaño",
  confirmDeleteText: (nombre) =>
    `¿Seguro que querés eliminar el tamaño «${nombre}»?`,
  withDesigns: (cantidad) =>
    cantidad === 1
      ? "Está asignado a 1 diseño, por lo que no se podrá eliminar."
      : `Está asignado a ${cantidad} diseños, por lo que no se podrá eliminar.`,
  confirmDeleteNote:
    "Si solo querés ocultarlo del configurador, editalo y marcalo como inactivo.",
  codeLockedNote:
    "El código identifica al tamaño y no se puede modificar una vez creado.",
};
 