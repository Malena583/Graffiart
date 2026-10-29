// frontend/src/constants/MATERIALES.js
// Textos y configuración de la sección Materiales del panel de administración.
// Los accesorios (categoría ACCESORIO) tienen su propia sección.
import { ACCESORIO_CATEGORIA } from "./ACCESORIOS";
import { CATEGORIAS_MATERIAL, UNIDAD_MEDIDA_OPTIONS } from "./CATALOGO";
 
// Etiquetas para los mensajes de validación (schemas/materialAdmin.js).
export const MATERIAL_LABELS = {
  name: "El nombre",
  code: "El código",
  category: "El tipo",
  unit: "La unidad de medida",
  cost: "El costo unitario",
  initialStock: "El stock inicial",
  minStock: "El stock mínimo",
  quantity: "La cantidad",
};
 
export const MATERIAL_LIMITS = {
  name: 150,
  code: 50,
  description: 2000,
  reason: 191,
  maxCost: 99999999.99,
};
 
const CATEGORY_LABELS = {
  MDF: "MDF",
  MELAMINA: "Melamina",
  METAL: "Metal",
  VIDRIO: "Vidrio",
  ACERO: "Acero",
  OTRO: "Otro",
};
 
// Tipos que se pueden elegir en esta sección (sin ACCESORIO)
export const MATERIAL_TYPE_OPTIONS = CATEGORIAS_MATERIAL.filter(
  (categoria) => categoria !== ACCESORIO_CATEGORIA,
).map((value) => ({ value, label: CATEGORY_LABELS[value] ?? value }));
 
export const getMaterialTypeLabel = (value) => CATEGORY_LABELS[value] ?? value;
 
export const MATERIAL_ADMIN = {
  initialValues: {
    nombre: "",
    codigo: "",
    categoria: MATERIAL_TYPE_OPTIONS[0].value,
    unidadMedida: "UNIDAD",
    costoUnitario: "",
    stockMinimo: "",
    stockActual: "",
    activo: "true",
    descripcion: "",
  },
  // createOnly: el campo solo aparece al crear (el stock luego se mueve con "Stock")
  fields: [
    { name: "nombre", label: "Nombre", maxLength: 150, half: true },
    { name: "codigo", label: "Código", maxLength: 50, half: true },
    {
      name: "categoria",
      label: "Tipo",
      type: "select",
      options: MATERIAL_TYPE_OPTIONS,
      half: true,
    },
    {
      name: "unidadMedida",
      label: "Unidad de medida",
      type: "select",
      options: UNIDAD_MEDIDA_OPTIONS,
      half: true,
    },
    {
      name: "costoUnitario",
      label: "Costo unitario",
      type: "number",
      min: 0,
      step: "0.01",
      placeholder: "0.00",
      half: true,
    },
    {
      name: "stockMinimo",
      label: "Stock mínimo",
      type: "number",
      min: 0,
      step: 1,
      placeholder: "Ej: 5",
      half: true,
    },
    {
      name: "stockActual",
      label: "Stock inicial",
      type: "number",
      min: 0,
      step: 1,
      placeholder: "Ej: 10",
      half: true,
      createOnly: true,
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
    { name: "descripcion", label: "Descripción", type: "textarea" },
  ],
  columns: {
    code: "Código",
    name: "Nombre",
    type: "Tipo",
    unit: "Unidad",
    cost: "Costo",
    stock: "Stock",
    status: "Estado",
    actions: "Acciones",
  },
  pageTitle: "Materiales",
  createButton: "Crear material",
  createTitle: "Crear material",
  editTitle: "Editar material",
  createLabel: "Crear",
  statusActive: "Activo",
  statusInactive: "Inactivo",
  activate: "Activar",
  deactivate: "Desactivar",
  stockAction: "Stock",
  lowStockBadge: "Bajo mínimo",
  minShort: "mín.",
  emptyText: "Todavía no hay materiales registrados.",
};
 
export const STOCK_FORM = {
  title: (nombre) => `Movimiento de stock · ${nombre}`,
  fields: {
    tipo: {
      name: "tipo",
      label: "Tipo de movimiento",
      type: "select",
      options: [
        { value: "ENTRADA", label: "Entrada (suma al stock)" },
        { value: "SALIDA", label: "Salida (resta del stock)" },
        { value: "AJUSTE", label: "Ajuste (fija el stock final)" },
      ],
    },
    cantidad: {
      name: "cantidad",
      label: "Cantidad",
      type: "number",
      min: 0,
      step: 1,
      placeholder: "Ej: 10",
    },
    motivo: {
      name: "motivo",
      label: "Motivo (opcional)",
      placeholder: "Ej: Compra a proveedor",
      maxLength: 191,
    },
  },
  initialValues: { tipo: "ENTRADA", cantidad: "", motivo: "" },
  currentStock: "Stock actual",
  resultingStock: "Stock resultante",
  adjustHint: "En un ajuste, la cantidad es el stock final que querés dejar.",
  submit: "Registrar movimiento",
};
 
export const MATERIAL_MESSAGES = {
  subtitle:
    "Administrá los materiales del inventario y su costo. Los activos con stock se ofrecen en el configurador.",
  loadError: "No se pudieron cargar los materiales.",
  saveError: "No se pudo guardar el material.",
  deleteError: "No se pudo eliminar el material.",
  statusError: "No se pudo cambiar el estado del material.",
  stockError: "No se pudo registrar el movimiento de stock.",
  created: "Material creado correctamente.",
  updated: "Material actualizado correctamente.",
  deleted: "Material eliminado correctamente.",
  authError:
    "Necesitás iniciar sesión como administrador para modificar materiales.",
  activated: (nombre) => `El material «${nombre}» quedó activo.`,
  deactivated: (nombre) =>
    `El material «${nombre}» quedó inactivo y ya no se ofrece en el configurador. Se conservan sus movimientos y pedidos.`,
  stockUpdated: (nombre, stock, unidad) =>
    `Stock de «${nombre}» actualizado: ${stock} ${unidad}.`,
  insufficientStock: "No hay stock suficiente para esta salida.",
  stockInactive: "Activá el material para poder mover su stock.",
  stockNoteCreate:
    "El stock inicial se registra como un movimiento de entrada en el inventario.",
  stockNoteEdit: (stock, unidad) =>
    `Stock actual: ${stock} ${unidad}. Para modificarlo usá la acción «Stock» de la tabla: así queda registrado el movimiento.`,
};