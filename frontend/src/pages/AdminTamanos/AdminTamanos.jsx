import { useState } from "react";
import Button from "../../components/Button/Button";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import DataTable from "../../components/DataTable/DataTable";
import Feedback from "../../components/Feedback/Feedback";
import { MESSAGES } from "../../constants/MESSAGES";
import { TAMANO_FORM, TAMANO_MESSAGES as M } from "../../constants/TAMANOS";
import useCrudResource from "../../hooks/useCrudResource";
import { tamanoSchema } from "../../schemas/tamano";
import tamanoService from "../../services/tamanoService";
import { formatPrice } from "../../utils/format";
import TamanoFormModal from "./TamanoFormModal";

const toFormValues = (tamano) => ({
  codigo: tamano.codigo,
  nombre: tamano.nombre,
  precioBase: tamano.precioBase,
  altoMinCm: tamano.altoMinCm,
  altoMaxCm: tamano.altoMaxCm,
  anchoMinCm: tamano.anchoMinCm,
  anchoMaxCm: tamano.anchoMaxCm,
  profundidadMinCm: tamano.profundidadMinCm,
  profundidadMaxCm: tamano.profundidadMaxCm,
  activo: String(tamano.activo),
});

const AdminTamanos = () => {
  const crud = useCrudResource({
    key: "tamanos",
    service: tamanoService,
    schema: tamanoSchema,
    initialValues: TAMANO_FORM.initialValues,
    toFormValues,
    messages: M,
  });

  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sizeToDelete, setSizeToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const openCreate = () => {
    crud.cancelEdit(); // limpia el formulario y los avisos anteriores
    setFormOpen(true);
  };

  const openEdit = (tamano) => {
    crud.startEdit(tamano);
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
    if (!deleting) setSizeToDelete(null);
  };

  const handleDelete = async () => {
    setDeleting(true);
    await crud.remove(sizeToDelete.id);
    setDeleting(false);
    setSizeToDelete(null);
  };

  const columns = [
    { header: TAMANO_FORM.columns.code, key: "codigo" },
    { header: TAMANO_FORM.columns.name, key: "nombre" },
    {
      header: TAMANO_FORM.columns.price,
      render: (t) => formatPrice(t.precioBase),
    },
    {
      header: TAMANO_FORM.columns.dimensions,
      render: (t) => (
        <div className="text-xs">
          <div>
            {TAMANO_FORM.height}: {t.altoMinCm}–{t.altoMaxCm}
          </div>
          <div>
            {TAMANO_FORM.width}: {t.anchoMinCm}–{t.anchoMaxCm}
          </div>
          <div>
            {TAMANO_FORM.depth}: {t.profundidadMinCm}–{t.profundidadMaxCm}
          </div>
        </div>
      ),
    },
    {
      header: TAMANO_FORM.columns.designs,
      render: (t) => t._count?.disenos || 0,
    },
    {
      header: TAMANO_FORM.columns.status,
      render: (t) => (
        <span
          className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
            t.activo
              ? "bg-emerald-50 text-emerald-800"
              : "bg-neutral-100 text-neutral-600"
          }`}
        >
          {t.activo ? TAMANO_FORM.statusActive : TAMANO_FORM.statusInactive}
        </span>
      ),
    },
    {
      header: TAMANO_FORM.columns.actions,
      render: (tamano) => (
        <div className="flex gap-4">
          <Button
            variant="linkEdit"
            onClick={() => openEdit(tamano)}
            aria-label={`${MESSAGES.actions.edit} ${tamano.nombre}`}
          >
            {MESSAGES.actions.edit}
          </Button>
          <Button
            variant="linkDelete"
            onClick={() => setSizeToDelete(tamano)}
            aria-label={`${MESSAGES.actions.delete} ${tamano.nombre}`}
          >
            {MESSAGES.actions.delete}
          </Button>
        </div>
      ),
    },
  ];

  const designCount = sizeToDelete?._count?.disenos || 0;

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">
            {TAMANO_FORM.pageTitle}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">{M.subtitle}</p>
        </div>
        <Button variant="compact" onClick={openCreate}>
          {TAMANO_FORM.createButton}
        </Button>
      </header>

      {!formOpen && crud.error && <Feedback type="error">{crud.error}</Feedback>}
      {crud.message && <Feedback type="success">{crud.message}</Feedback>}

      <DataTable
        columns={columns}
        rows={crud.items}
        empty={crud.loading ? MESSAGES.loading : TAMANO_FORM.emptyText}
      />

      {formOpen && (
        <TamanoFormModal
          editing={Boolean(crud.editingId)}
          values={crud.values}
          onChange={crud.onChange}
          onSubmit={handleSubmit}
          onCancel={closeForm}
          saving={saving}
          error={crud.error}
        />
      )}

      {sizeToDelete && (
        <ConfirmDialog
          title={M.confirmDeleteTitle}
          confirmLabel={MESSAGES.actions.delete}
          onConfirm={handleDelete}
          onCancel={closeDelete}
          loading={deleting}
        >
          <p>{M.confirmDeleteText(sizeToDelete.nombre)}</p>
          {designCount > 0 && (
            <p className="mt-2 font-medium text-amber-800">
              {M.withDesigns(designCount)}
            </p>
          )}
          <p className="mt-2 text-neutral-500">{M.confirmDeleteNote}</p>
        </ConfirmDialog>
      )}
    </div>
  );
};

export default AdminTamanos;