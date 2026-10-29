import { useState } from "react";
import Button from "../../components/Button/Button";
import DataTable from "../../components/DataTable/DataTable";
import Feedback from "../../components/Feedback/Feedback";
import { COLOR_FORM, COLOR_MESSAGES as M } from "../../constants/COLORES";
import { MESSAGES } from "../../constants/MESSAGES";
import useCrudResource from "../../hooks/useCrudResource";
import { colorSchema } from "../../schemas/color";
import colorService from "../../services/colorService";
import { getErrorMessage } from "../../utils/errors";
import ColorFormModal from "./ColorFormModal";

const toFormValues = (color) => ({
  nombre: color.nombre,
  codigoHex: color.codigoHex,
  activo: String(color.activo),
});

const mapError = (error, fallback) => {
  if ([401, 403].includes(error?.response?.status)) return M.authError;
  return getErrorMessage(error, fallback);
};

const AdminColores = () => {
  const crud = useCrudResource({
    key: "colores",
    service: colorService,
    schema: colorSchema,
    initialValues: COLOR_FORM.initialValues,
    toFormValues,
    messages: M,
    mapError,
  });

  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [togglingId, setTogglingId] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");
  const [statusError, setStatusError] = useState("");

  const clearStatus = () => {
    setStatusMessage("");
    setStatusError("");
  };

  const openCreate = () => {
    clearStatus();
    crud.cancelEdit(); // limpia el formulario y los avisos anteriores
    setFormOpen(true);
  };

  const openEdit = (color) => {
    clearStatus();
    crud.startEdit(color);
    setFormOpen(true);
  };

  const closeForm = () => {
    if (saving) return;
    crud.cancelEdit();
    setFormOpen(false);
  };

  const handleSubmit = async (event) => {
    clearStatus();
    setSaving(true);
    const saved = await crud.onSubmit(event);
    setSaving(false);
    // Si falla, el modal queda abierto con los datos que el usuario escribió
    if (saved) setFormOpen(false);
  };

  // Activa o desactiva sin eliminar: las referencias existentes se conservan.
  const handleToggle = async (color) => {
    clearStatus();
    setTogglingId(color.id);
    try {
      await colorService.cambiarEstado(color.id, !color.activo);
      setStatusMessage(
        color.activo ? M.deactivated(color.nombre) : M.activated(color.nombre),
      );
      crud.reload();
    } catch (error) {
      setStatusError(mapError(error, M.statusError));
    } finally {
      setTogglingId(null);
    }
  };

  const columns = [
    { header: COLOR_FORM.columns.name, key: "nombre" },
    {
      header: COLOR_FORM.columns.sample,
      render: (color) => (
        <span
          role="img"
          aria-label={`${COLOR_FORM.columns.sample}: ${color.nombre}`}
          className="inline-block h-6 w-10 rounded border border-neutral-300"
          style={{ backgroundColor: color.codigoHex }}
        />
      ),
    },
    {
      header: COLOR_FORM.columns.hex,
      render: (color) => <code className="text-xs">{color.codigoHex}</code>,
    },
    {
      header: COLOR_FORM.columns.status,
      render: (color) => (
        <span
          className={`inline-block rounded-full px-2 py-0.5 text-xs font-semibold ${
            color.activo
              ? "bg-emerald-50 text-emerald-800"
              : "bg-neutral-100 text-neutral-600"
          }`}
        >
          {color.activo ? COLOR_FORM.statusActive : COLOR_FORM.statusInactive}
        </span>
      ),
    },
    {
      header: COLOR_FORM.columns.actions,
      render: (color) => (
        <div className="flex gap-4">
          <Button
            variant="linkEdit"
            onClick={() => openEdit(color)}
            aria-label={`${MESSAGES.actions.edit} ${color.nombre}`}
          >
            {MESSAGES.actions.edit}
          </Button>
          <Button
            variant={color.activo ? "linkDelete" : "linkEdit"}
            onClick={() => handleToggle(color)}
            disabled={togglingId === color.id}
            aria-label={`${
              color.activo ? COLOR_FORM.deactivate : COLOR_FORM.activate
            } ${color.nombre}`}
          >
            {color.activo ? COLOR_FORM.deactivate : COLOR_FORM.activate}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">
            {COLOR_FORM.pageTitle}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">{M.subtitle}</p>
        </div>
        <Button variant="compact" onClick={openCreate}>
          {COLOR_FORM.createButton}
        </Button>
      </header>

      {!formOpen && crud.error && <Feedback type="error">{crud.error}</Feedback>}
      {statusError && <Feedback type="error">{statusError}</Feedback>}
      {crud.message && <Feedback type="success">{crud.message}</Feedback>}
      {statusMessage && <Feedback type="success">{statusMessage}</Feedback>}

      <DataTable
        columns={columns}
        rows={crud.items}
        empty={crud.loading ? MESSAGES.loading : COLOR_FORM.emptyText}
      />

      {formOpen && (
        <ColorFormModal
          editing={Boolean(crud.editingId)}
          values={crud.values}
          onChange={crud.onChange}
          onSubmit={handleSubmit}
          onCancel={closeForm}
          saving={saving}
          error={crud.error}
        />
      )}
    </div>
  );
};

export default AdminColores;
