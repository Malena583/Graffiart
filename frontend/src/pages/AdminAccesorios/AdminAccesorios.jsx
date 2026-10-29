import { useState } from "react";
import Button from "../../components/Button/Button";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import DataTable from "../../components/DataTable/DataTable";
import Feedback from "../../components/Feedback/Feedback";
import {
  ACCESORIO_FORM,
  ACCESORIO_MESSAGES as M,
} from "../../constants/ACCESORIOS";
import { MESSAGES } from "../../constants/MESSAGES";
import useCrudResource from "../../hooks/useCrudResource";
import { accesorioSchema } from "../../schemas/accesorio";
import accesorioService from "../../services/accesorioService";
import { getErrorMessage } from "../../utils/errors";
import { formatPrice } from "../../utils/format";
import AccesorioFormModal from "./AccesorioFormModal";

// Error de MySQL cuando el código ya existe en el inventario
const DUPLICATE_ERROR = /duplicate entry/i;

const mapError = (error, fallback) => {
  if ([401, 403].includes(error?.response?.status)) return M.authError;
  const backendMessage = error?.response?.data?.error;
  if (backendMessage && DUPLICATE_ERROR.test(backendMessage)) {
    return M.duplicateCode;
  }
  return getErrorMessage(error, fallback);
};

const toFormValues = (accesorio) => ({
  nombre: accesorio.nombre,
  codigo: accesorio.codigo,
  unidadMedida: accesorio.unidadMedida,
  costoUnitario: accesorio.costoUnitario ?? "",
  descripcion: accesorio.descripcion ?? "",
});

const AdminAccesorios = () => {
  const crud = useCrudResource({
    key: "accesorios",
    service: accesorioService,
    schema: accesorioSchema,
    initialValues: ACCESORIO_FORM.initialValues,
    toFormValues,
    messages: M,
    mapError,
  });

  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [accessoryToDelete, setAccessoryToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Accesorio que se está editando (para mostrar su stock del inventario)
  const editingItem = crud.items.find((item) => item.id === crud.editingId);

  const openCreate = () => {
    crud.cancelEdit(); // limpia el formulario y los avisos anteriores
    setFormOpen(true);
  };

  const openEdit = (accesorio) => {
    crud.startEdit(accesorio);
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
    // Si falla, el modal queda abierto con los datos que el usuario escribió
    if (saved) setFormOpen(false);
  };

  const closeDelete = () => {
    if (!deleting) setAccessoryToDelete(null);
  };

  const handleDelete = async () => {
    setDeleting(true);
    await crud.remove(accessoryToDelete.id);
    setDeleting(false);
    setAccessoryToDelete(null);
  };

  const columns = [
    {
      header: ACCESORIO_FORM.columns.name,
      render: (a) => (
        <div>
          <div className="font-medium text-neutral-900">{a.nombre}</div>
          {a.descripcion && (
            <div className="line-clamp-1 max-w-xs text-xs text-neutral-500">
              {a.descripcion}
            </div>
          )}
        </div>
      ),
    },
    { header: ACCESORIO_FORM.columns.code, key: "codigo" },
    {
      header: ACCESORIO_FORM.columns.cost,
      render: (a) =>
        a.costoUnitario == null ? "-" : formatPrice(a.costoUnitario),
    },
    {
      header: ACCESORIO_FORM.columns.stock,
      render: (a) => `${a.stockActual} ${a.unidadMedida}`,
    },
    {
      header: ACCESORIO_FORM.columns.actions,
      render: (accesorio) => (
        <div className="flex gap-4">
          <Button
            variant="linkEdit"
            onClick={() => openEdit(accesorio)}
            aria-label={`${MESSAGES.actions.edit} ${accesorio.nombre}`}
          >
            {MESSAGES.actions.edit}
          </Button>
          <Button
            variant="linkDelete"
            onClick={() => setAccessoryToDelete(accesorio)}
            aria-label={`${MESSAGES.actions.delete} ${accesorio.nombre}`}
          >
            {MESSAGES.actions.delete}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">
            {ACCESORIO_FORM.pageTitle}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">{M.subtitle}</p>
        </div>
        <Button variant="compact" onClick={openCreate}>
          {ACCESORIO_FORM.createButton}
        </Button>
      </header>

      {!formOpen && crud.error && <Feedback type="error">{crud.error}</Feedback>}
      {crud.message && <Feedback type="success">{crud.message}</Feedback>}

      <DataTable
        columns={columns}
        rows={crud.items}
        empty={crud.loading ? MESSAGES.loading : ACCESORIO_FORM.emptyText}
      />

      {formOpen && (
        <AccesorioFormModal
          editing={Boolean(crud.editingId)}
          values={crud.values}
          onChange={crud.onChange}
          onSubmit={handleSubmit}
          onCancel={closeForm}
          saving={saving}
          error={crud.error}
          stock={editingItem}
        />
      )}

      {accessoryToDelete && (
        <ConfirmDialog
          title={M.confirmDeleteTitle}
          confirmLabel={MESSAGES.actions.delete}
          onConfirm={handleDelete}
          onCancel={closeDelete}
          loading={deleting}
        >
          <p>{M.confirmDeleteText(accessoryToDelete.nombre)}</p>
          <p className="mt-2 text-neutral-500">{M.confirmDeleteNote}</p>
        </ConfirmDialog>
      )}
    </div>
  );
};

export default AdminAccesorios;