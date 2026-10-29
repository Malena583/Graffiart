
import { useState } from "react";
import AdminPage from "../../components/AdminPage/AdminPage";
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

const IN_USE_ERROR = /foreign key|constraint|referenc|cannot delete/i;

const mapError = (error, fallback) => {
  const backendMessage = error?.response?.data?.error;

  if (backendMessage && IN_USE_ERROR.test(backendMessage)) {
    return M.inUseError;
  }

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
    crud.cancelEdit();
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
    if (!categoryToDelete) return;

    setDeleting(true);
    await crud.remove(categoryToDelete.id);
    setDeleting(false);
    setCategoryToDelete(null);
  };

  const columns = [
    { header: CATEGORIA_FORM.columns.name, key: "nombre" },
    {
      header: CATEGORIA_FORM.columns.description,
      render: (categoria) => (
        <span className="line-clamp-2 max-w-md">
          {categoria.descripcion || "-"}
        </span>
      ),
    },
    {
      header: CATEGORIA_FORM.columns.products,
      render: (categoria) => categoria._count?.productos || 0,
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
    <AdminPage
      title={CATEGORIA_FORM.pageTitle}
      subtitle={M.subtitle}
      actionLabel={CATEGORIA_FORM.createButton}
      onAction={openCreate}
    >
      {!formOpen && crud.error && (
        <Feedback type="error">{crud.error}</Feedback>
      )}

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
    </AdminPage>
  );
};

export default AdminCategorias;
