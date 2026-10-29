import {CATEGORIA_MATERIAL_OPTIONS, FORMATO_OPTIONS, MATERIAL_CHASIS_OPTIONS, PANEL_OPTIONS, TAMANO_OPTIONS, UNIDAD_MEDIDA_OPTIONS,
} from "./CATALOGO";

export const CATEGORIA_FORM = {
  initialValues: { nombre: "", descripcion: "" },
  fields: [
    {
      name: "nombre",
      label: "Nombre",
      placeholder: "Nombre de la categoría",
      maxLength: 100,
    },
    { name: "descripcion", label: "Descripción", type: "textarea" },
  ],
  columns: {
    name: "Nombre",
    description: "Descripción",
    products: "Productos",
    actions: "Acciones",
  },
  pageTitle: "Categorías",
  createButton: "Crear",
  emptyText: "Todavía no hay categorías registradas.",
  createTitle: "Crear categoría",
  editTitle: "Editar categoría",
  createLabel: "Crear",
};

export const PRODUCTO_FORM = {
  initialValues: {
    nombre: "",
    marca: "",
    costoUnitario: "",
    stockActual: 0,
    stockMinimo: 0,
    tamano: "MID_TOWER",
    formato: "ATX",
    materialChasis: "ACERO",
    panel: "VIDRIO_TEMPLADO",
    categoriaId: "",
    imagen: "",
  },
  fields: [
    { name: "nombre", label: "Nombre", placeholder: "Ej: GraffiArt Gamer X", half: true },
    { name: "marca", label: "Marca", placeholder: "Ej: GraffiArt", half: true },
    { name: "costoUnitario", label: "Costo unitario", type: "number", min: "0", step: "0.01", half: true },
    { name: "stockActual", label: "Stock actual", type: "number", min: "0", half: true },
    { name: "stockMinimo", label: "Stock mínimo", type: "number", min: "0", half: true },
    { name: "tamano", label: "Tamaño", type: "select", options: TAMANO_OPTIONS, half: true },
    { name: "formato", label: "Formato", type: "select", options: FORMATO_OPTIONS, half: true },
    { name: "materialChasis", label: "Material del chasis", type: "select", options: MATERIAL_CHASIS_OPTIONS, half: true },
    { name: "panel", label: "Tipo de panel", type: "select", options: PANEL_OPTIONS, half: true },
  ],
  categoryField: {
    name: "categoriaId",
    label: "Categoría",
    type: "select",
    placeholder: "Sin categoría",
    half: true,
  },
  columns: {
    image: "Imagen",
    product: "Producto",
    category: "Categoría",
    price: "Precio",
    stock: "Stock",
    status: "Estado",
    features: "Características",
    actions: "Acciones",
  },
  noCategory: "Sin categoría",
  noImage: "Sin imagen",
  statusActive: "Activo",
  statusInactive: "Inactivo",
  pageTitle: "Productos",
  createButton: "Crear",
  emptyText: "Todavía no hay productos registrados.",
  createTitle: "Crear producto",
  editTitle: "Editar producto",
  createLabel: "Crear",
  imageRequired: "La imagen del producto es obligatoria.",
};

export const MATERIAL_FORM = {
  initialValues: {
    nombre: "",
    codigo: "",
    categoria: "MDF",
    unidadMedida: "UNIDAD",
    stockActual: "",
    stockMinimo: "",
    costoUnitario: "",
    descripcion: "",
  },
  fields: [
    { name: "nombre", label: "Nombre", half: true },
    { name: "codigo", label: "Código", half: true },
    { name: "categoria", label: "Categoría", type: "select", options: CATEGORIA_MATERIAL_OPTIONS, half: true },
    { name: "unidadMedida", label: "Unidad de medida", type: "select", options: UNIDAD_MEDIDA_OPTIONS, half: true },
    { name: "stockActual", label: "Cantidad de stock actual", type: "number", min: "1", step: "1", placeholder: "Ej: 10", half: true },
    { name: "stockMinimo", label: "Cantidad de stock mínimo", type: "number", min: "1", step: "1", placeholder: "Ej: 5", half: true },
    { name: "costoUnitario", label: "Costo unitario", type: "number", step: "0.01", half: true },
    { name: "descripcion", label: "Descripción", half: true },
  ],
  columns: {
    name: "Nombre",
    code: "Código",
    category: "Categoría",
    stock: "Stock",
    actions: "Acciones",
  },
};

export const PERFIL_FORM = {
  fields: [
    { name: "nombre", label: "Nombre" },
    { name: "apellido", label: "Apellido" },
    { name: "telefono", label: "Teléfono" },
  ],
  emailField: { name: "email", label: "Email", disabled: true },
};
