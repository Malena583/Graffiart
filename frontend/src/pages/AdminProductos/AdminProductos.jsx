import { useState } from "react";
import AdminPage from "../../components/AdminPage/AdminPage";
import Button from "../../components/Button/Button";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import DataTable from "../../components/DataTable/DataTable";
import Feedback from "../../components/Feedback/Feedback";
import {
  FORMATOS,
  MATERIALES_CHASIS,
  PANELES,
  TAMANOS,
} from "../../constants/CATALOGO";
import { PRODUCTO_FORM } from "../../constants/FORMS";
import { MESSAGES } from "../../constants/MESSAGES";
import useCrudResource from "../../hooks/useCrudResource";
import useFetch from "../../hooks/useFetch";
import { productoSchema } from "../../schemas/entities";
import { listarCategorias } from "../../services/categoriaService";
import productoService from "../../services/productoService";
import { getErrorMessage } from "../../utils/errors";
import { formatPrice } from "../../utils/format";
import { productoImageUrl } from "../../utils/gabinete";
import ProductoFormModal from "./ProductoFormModal";

const M = MESSAGES.admin.productos;

// Errores de la base de datos que indican que el producto está en uso.
const IN_USE_ERROR = /foreign key|constraint|referenc|cannot delete/i;

const mapError = (error, fallback) => {
  const backendMessage = error?.response?.data?.error;

  if (backendMessage && IN_USE_ERROR.test(backendMessage)) {
    return M.inUseError;
  }

  return getErrorMessage(error, fallback);
};

const toFormValues = (producto) => ({
  nombre: producto.nombre || "",
  marca: producto.marca || "",
  costoUnitario: producto.costoUnitario || "",
  stockActual: producto.stockActual ?? 0,
  stockMinimo: producto.stockMinimo ?? 0,
  tamano: producto.tamano || PRODUCTO_FORM.initialValues.tamano,
  formato: producto.formato || PRODUCTO_FORM.initialValues.formato,
  materialChasis:
    producto.materialChasis ||
    PRODUCTO_FORM.initialValues.materialChasis,
  panel: producto.panel || PRODUCTO_FORM.initialValues.panel,
  categoriaId: producto.categoriaId || "",
  imagen: "",
  imagenUrl: producto.imagenUrl || "",
});

const AdminProductos = () => {
  const crud = useCrudResource({
    key: "productos",
    service: productoService,
    schema: productoSchema,
    initialValues: PRODUCTO_FORM.initialValues,
    toFormValues,
    messages: M,
    mapError,
  });

  const {
    data: categorias,
    error: categoriasError,
  } = useFetch("categorias", listarCategorias, M.loadError);

  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [imageError, setImageError] = useState("");
  const [productToDelete, setProductToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const openCreate = () => {
    crud.cancelEdit();
    setImageError("");
    setFormOpen(true);
  };

  const openEdit = (producto) => {
    crud.startEdit(producto);
    setImageError("");
    setFormOpen(true);
  };

  const closeForm = () => {
    if (saving) return;

    crud.cancelEdit();
    setImageError("");
    setFormOpen(false);
  };

  const handleSubmit = async (event) => {
    // Al crear, la imagen es obligatoria.
    // Al editar, se conserva la imagen actual si no se cambia.
    if (!crud.editingId && !crud.values.imagen) {
      event.preventDefault();
      setImageError(PRODUCTO_FORM.imageRequired);
      return;
    }

    setImageError("");
    setSaving(true);

    const saved = await crud.onSubmit(event);

    setSaving(false);

    // Si falla, el modal queda abierto con los datos ingresados.
    if (saved) {
      setFormOpen(false);
    }
  };

  const closeDelete = () => {
    if (!deleting) {
      setProductToDelete(null);
    }
  };

  const handleDelete = async () => {
    if (!productToDelete) return;

    setDeleting(true);
    await crud.remove(productToDelete.id);
    setDeleting(false);
    setProductToDelete(null);
  };

  const columns = [
    {
      header: PRODUCTO_FORM.columns.image,
      render: (producto) =>
        producto.imagenUrl ? (
          <img
            src={productoImageUrl(producto.imagenUrl)}
            alt={producto.nombre}
            className="h-12 w-16 rounded object-cover"
            onError={(event) => {
              event.currentTarget.hidden = true;
            }}
          />
        ) : (
          <span className="text-xs text-neutral-500">
            {PRODUCTO_FORM.noImage}
          </span>
        ),
    },
    {
      header: PRODUCTO_FORM.columns.product,
      render: (producto) => (
        <div>
          <div className="font-medium text-neutral-900">
            {producto.nombre}
          </div>
          <div className="text-xs text-neutral-500">
            {producto.marca}
          </div>
        </div>
      ),
    },
    {
      header: PRODUCTO_FORM.columns.category,
      render: (producto) =>
        producto.categoria?.nombre || PRODUCTO_FORM.noCategory,
    },
    {
      header: PRODUCTO_FORM.columns.price,
      render: (producto) => formatPrice(producto.costoUnitario),
    },
    {
      header: PRODUCTO_FORM.columns.stock,
      key: "stockActual",
    },
    {
      header: PRODUCTO_FORM.columns.status,
      render: (producto) => (
        <span
          className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
            producto.activo
              ? "bg-emerald-50 text-emerald-800"
              : "bg-neutral-100 text-neutral-600"
          }`}
        >
          {producto.activo
            ? PRODUCTO_FORM.statusActive
            : PRODUCTO_FORM.statusInactive}
        </span>
      ),
    },
    {
      header: PRODUCTO_FORM.columns.features,
      render: (producto) => (
        <div className="text-xs">
          <div>{TAMANOS[producto.tamano] || producto.tamano}</div>
          <div>{FORMATOS[producto.formato] || producto.formato}</div>
          <div>
            {MATERIALES_CHASIS[producto.materialChasis] ||
              producto.materialChasis}
          </div>
          <div>{PANELES[producto.panel] || producto.panel}</div>
        </div>
      ),
    },
    {
      header: PRODUCTO_FORM.columns.actions,
      render: (producto) => (
        <div className="flex gap-4">
          <Button
            variant="linkEdit"
            onClick={() => openEdit(producto)}
            aria-label={`${MESSAGES.actions.edit} ${producto.nombre}`}
          >
            {MESSAGES.actions.edit}
          </Button>

          <Button
            variant="linkDelete"
            onClick={() => setProductToDelete(producto)}
            aria-label={`${MESSAGES.actions.delete} ${producto.nombre}`}
          >
            {MESSAGES.actions.delete}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AdminPage
      title={PRODUCTO_FORM.pageTitle}
      subtitle={M.subtitle}
      actionLabel={PRODUCTO_FORM.createButton}
      onAction={openCreate}
    >
      {!formOpen && crud.error && (
        <Feedback type="error">{crud.error}</Feedback>
      )}

      {crud.message && (
        <Feedback type="success">{crud.message}</Feedback>
      )}

      <DataTable
        columns={columns}
        rows={crud.items}
        empty={crud.loading ? M.loading : PRODUCTO_FORM.emptyText}
      />

      {formOpen && (
        <ProductoFormModal
          editing={Boolean(crud.editingId)}
          values={crud.values}
          onChange={crud.onChange}
          onSubmit={handleSubmit}
          onCancel={closeForm}
          saving={saving}
          error={crud.error}
          categorias={categorias}
          categoriasError={Boolean(categoriasError)}
          imageError={imageError}
          onImageError={setImageError}
        />
      )}

      {productToDelete && (
        <ConfirmDialog
          title={M.confirmDeleteTitle}
          confirmLabel={MESSAGES.actions.delete}
          onConfirm={handleDelete}
          onCancel={closeDelete}
          loading={deleting}
        >
          <p>{M.confirmDeleteText(productToDelete.nombre)}</p>
        </ConfirmDialog>
      )}
    </AdminPage>
  );
};

export default AdminProductos;