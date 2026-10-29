//frontend/src/pages/AdminCategorias/AdminCategorias.jsx
import { useState } from "react";
import Button from "../../components/Button/Button";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import DataTable from "../../components/DataTable/DataTable";
import Feedback from "../../components/Feedback/Feedback";
import { CATEGORIA_FORM } from "../../constants/FORMS";
import { MESSAGES } from "../../constants/MESSAGES";
import useCrudResource from "../../hooks/useCrudResource";
import { categoriaSchema } from "../../schemas/entities";
import categoriaService from "../../services/categoriaService";
import { getErrorMessage } from "../../utils/errors";
import CategoriaFormModal from "./CategoriaFormModal";

const M = MESSAGES.admin.categorias;

// Errores de la base de datos que indican que la categoría está en uso
const IN_USE_ERROR = /foreign key|constraint|referenc|cannot delete/i;

const mapError = (error, fallback) => {
  const backendMessage = error?.response?.data?.error;
  if (backendMessage && IN_USE_ERROR.test(backendMessage)) return M.inUseError;
  return getErrorMessage(error, fallback);
};

const AdminCategorias = () => {
  const crud = useCrudResource({
    key: "categorias",
    service: categoriaService,
    schema: categoriaSchema,
    initialValues: CATEGORIA_FORM.initialValues,
    toFormValues: (categoria) => ({
      nombre: categoria.nombre,
      descripcion: categoria.descripcion || "",
    }),
    messages: M,
    mapError,
  });

  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const openCreate = () => {
    crud.cancelEdit(); // limpia el formulario y los avisos anteriores
    setFormOpen(true);
  };

  const openEdit = (categoria) => {
    crud.startEdit(categoria);
    setFormOpen(true);
  };

  const closeForm = () => {
    if (saving) return;
    crud.cancelEdit();
    setFormOpen(false);
  };

  const handleSubmit = async (event) => {
    setSaving(true);
    const saved = await crud.onSubmit(event);
    setSaving(false);
    if (saved) setFormOpen(false);
  };

  const closeDelete = () => {
    if (!deleting) setCategoryToDelete(null);
  };

  const handleDelete = async () => {
    setDeleting(true);
    await crud.remove(categoryToDelete.id);
    setDeleting(false);
    setCategoryToDelete(null);
  };

  const columns = [
    { header: CATEGORIA_FORM.columns.name, key: "nombre" },
    {
      header: CATEGORIA_FORM.columns.description,
      render: (c) => (
        <span className="line-clamp-2 max-w-md">{c.descripcion || "-"}</span>
      ),
    },
    {
      header: CATEGORIA_FORM.columns.products,
      render: (c) => c._count?.productos || 0,
    },
    {
      header: CATEGORIA_FORM.columns.actions,
      render: (categoria) => (
        <div className="flex gap-4">
          <Button
            variant="linkEdit"
            onClick={() => openEdit(categoria)}
            aria-label={`${MESSAGES.actions.edit} ${categoria.nombre}`}
          >
            {MESSAGES.actions.edit}
          </Button>
          <Button
            variant="linkDelete"
            onClick={() => setCategoryToDelete(categoria)}
            aria-label={`${MESSAGES.actions.delete} ${categoria.nombre}`}
          >
            {MESSAGES.actions.delete}
          </Button>
        </div>
      ),
    },
  ];

  const productCount = categoryToDelete?._count?.productos || 0;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">
            {CATEGORIA_FORM.pageTitle}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">{M.subtitle}</p>
        </div>
        <Button variant="compact" onClick={openCreate}>
          {CATEGORIA_FORM.createButton}
        </Button>
      </header>

      {!formOpen && crud.error && <Feedback type="error">{crud.error}</Feedback>}
      {crud.message && <Feedback type="success">{crud.message}</Feedback>}

      <DataTable
        columns={columns}
        rows={crud.items}
        empty={crud.loading ? MESSAGES.loading : CATEGORIA_FORM.emptyText}
      />

      {formOpen && (
        <CategoriaFormModal
          editing={Boolean(crud.editingId)}
          values={crud.values}
          onChange={crud.onChange}
          onSubmit={handleSubmit}
          onCancel={closeForm}
          saving={saving}
          error={crud.error}
        />
      )}

      {categoryToDelete && (
        <ConfirmDialog
          title={M.confirmDeleteTitle}
          confirmLabel={MESSAGES.actions.delete}
          onConfirm={handleDelete}
          onCancel={closeDelete}
          loading={deleting}
        >
          <p>{M.confirmDeleteText(categoryToDelete.nombre)}</p>
          {productCount > 0 && (
            <p className="mt-2 font-medium text-amber-800">
              {M.withProducts(productCount)}
            </p>
          )}
        </ConfirmDialog>
      )}
    </div>
  );
};

export default AdminCategorias;
