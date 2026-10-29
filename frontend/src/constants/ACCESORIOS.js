import { MATERIAL_FORM } from "./FORMS";

// Un accesorio es un material del inventario cuya categoría es ACCESORIO.
// Es la misma condición que usan el Configurador y el backend.
export const ACCESORIO_CATEGORIA = "ACCESORIO";

// Campos del material que se editan desde la sección Accesorios.
// El stock NO está aquí: se gestiona únicamente desde Inventario.
const FIELD_NAMES = [
  "nombre",
  "codigo",
  "unidadMedida",
  "costoUnitario",
  "descripcion",
];

export const ACCESORIO_FORM = {
  initialValues: {
    nombre: "",
    codigo: "",
    unidadMedida: MATERIAL_FORM.initialValues.unidadMedida,
    costoUnitario: "",
    descripcion: "",
  },
  // Se reutilizan los campos, etiquetas y opciones que ya usa Inventario
  fields: MATERIAL_FORM.fields
    .filter((field) => FIELD_NAMES.includes(field.name))
    .map((field) =>
      field.name === "descripcion" ? { ...field, half: false } : field,
    ),
  columns: {
    name: "Nombre",
    code: "Código",
    cost: "Costo unitario",
    stock: "Stock",
    actions: "Acciones",
  },
  pageTitle: "Accesorios",
  createButton: "Crear accesorio",
  createTitle: "Crear accesorio",
  editTitle: "Editar accesorio",
  createLabel: "Crear",
  emptyText: "Todavía no hay accesorios registrados.",
};

export const ACCESORIO_MESSAGES = {
  subtitle:
    "Administrá los accesorios del inventario. El stock se controla desde Inventario.",
  loadError: "No se pudieron cargar los accesorios.",
  saveError: "No se pudo guardar el accesorio.",
  deleteError: "No se pudo eliminar el accesorio.",
  created: "Accesorio creado correctamente.",
  updated: "Accesorio actualizado correctamente.",
  deleted: "Accesorio eliminado correctamente.",
  authError:
    "Necesitás iniciar sesión como administrador para modificar accesorios.",
  duplicateCode: "Ya existe un artículo del inventario con ese código.",
  confirmDeleteTitle: "Eliminar accesorio",
  confirmDeleteText: (nombre) =>
    `¿Seguro que querés eliminar el accesorio «${nombre}»?`,
  confirmDeleteNote:
    "Si tiene movimientos de inventario asociados, no se podrá eliminar.",
  stockNoteCreate:
    "El stock se carga desde Inventario. Al crear el accesorio comienza en 0.",
  stockNoteEdit: "El stock solo se modifica desde Inventario.",
  inventoryLink: "Ir a Inventario",
  currentStock: "Stock actual",
  minStock: "Stock mínimo",
};