
// frontend/src/constants/COLORES.js
// Textos y configuración del CRUD de colores de personalización.
 
// Etiquetas para los mensajes de validación (schemas/color.js).
export const COLOR_LABELS = {
  name: "El nombre",
  hex: "El código hexadecimal",
};
 
export const COLOR_HEX_PATTERN = /^#[0-9A-F]{6}$/;
export const COLOR_DEFAULT_HEX = "#000000";
 
export const COLOR_FORM = {
  initialValues: {
    nombre: "",
    codigoHex: "",
    activo: "true",
  },
  fields: {
    nombre: {
      name: "nombre",
      label: "Nombre",
      placeholder: "Rojo intenso",
      maxLength: 50,
    },
    codigoHex: {
      name: "codigoHex",
      label: "Código hexadecimal",
      placeholder: "#FF0000",
      maxLength: 7,
    },
    activo: {
      name: "activo",
      label: "Estado",
      type: "select",
      options: [
        { value: "true", label: "Activo" },
        { value: "false", label: "Inactivo" },
      ],
    },
  },
  pickerLabel: "Elegir color",
  columns: {
    name: "Nombre",
    sample: "Muestra",
    hex: "Código",
    status: "Estado",
    actions: "Acciones",
  },
  pageTitle: "Colores",
  createButton: "Crear color",
  createTitle: "Crear color",
  editTitle: "Editar color",
  createLabel: "Guardar",
  statusActive: "Activo",
  statusInactive: "Inactivo",
  activate: "Activar",
  deactivate: "Desactivar",
  emptyText: "Todavía no hay colores registrados.",
};
 
export const COLOR_MESSAGES = {
  subtitle:
    "Administrá los colores disponibles en el configurador. Los colores desactivados dejan de ofrecerse, pero se conservan en los diseños y pedidos existentes.",
  loadError: "No se pudieron cargar los colores.",
  saveError: "No se pudo guardar el color.",
  deleteError: "No se pudo eliminar el color.",
  statusError: "No se pudo cambiar el estado del color.",
  created: "Color creado correctamente.",
  updated: "Color actualizado correctamente.",
  deleted: "Color eliminado correctamente.",
  activated: (nombre) => `El color «${nombre}» quedó activo.`,
  deactivated: (nombre) =>
    `El color «${nombre}» quedó inactivo y ya no se ofrece en el configurador.`,
  authError:
    "Necesitás iniciar sesión como administrador para modificar colores.",
};