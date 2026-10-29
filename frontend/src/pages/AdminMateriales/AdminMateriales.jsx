import { useState } from "react";
import Button from "../../components/Button/Button";
import DataTable from "../../components/DataTable/DataTable";
import Feedback from "../../components/Feedback/Feedback";
import MaterialFormModal from "../../components/Material/MaterialFormModal";
import StockMovementModal from "../../components/StockMovementModal/StockMovementModal";
import {
  MATERIAL_ADMIN,
  MATERIAL_MESSAGES as M,
  getMaterialTypeLabel,
} from "../../constants/MATERIALES";
import { MESSAGES } from "../../constants/MESSAGES";
import useCrudResource from "../../hooks/useCrudResource";
import { materialAdminSchema } from "../../schemas/Materialadmin";
import materialAdminService from "../../services/Materialadminservice";
import { getErrorMessage } from "../../utils/errors";
import { formatPrice } from "../../utils/format";

const mapError = (error, fallback) =>
  [401, 403].includes(error?.response?.status)
    ? M.authError
    : getErrorMessage(error, fallback);

// stockActual no va: al editar el stock se mueve desde el botón "Stock"
const toFormValues = (material) => ({
  nombre: material.nombre,
  codigo: material.codigo,
  categoria: material.categoria,
  unidadMedida: material.unidadMedida,
  costoUnitario: material.costoUnitario ?? "",
  stockMinimo: material.stockMinimo ?? "",
  activo: String(material.activo),
  descripcion: material.descripcion ?? "",
});

const AdminMateriales = () => {
  const crud = useCrudResource({
    key: "materiales-admin",
    service: materialAdminService,
    schema: materialAdminSchema,
    initialValues: MATERIAL_ADMIN.initialValues,
    toFormValues,
    messages: M,
    mapError,
  });

  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [stockTarget, setStockTarget] = useState(null);
  const [notice, setNotice] = useState(null); // { type, text }

  const editingItem = crud.items.find((item) => item.id === crud.editingId);

  const openCreate = () => {
    setNotice(null);
    crud.cancelEdit();
    setFormOpen(true);
  };

  const openEdit = (material) => {
    setNotice(null);
    crud.startEdit(material);
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

  const handleToggle = async (material) => {
    setNotice(null);
    crud.cancelEdit();
    try {
      await materialAdminService.cambiarEstado(material.id, !material.activo);
      setNotice({
        type: "success",
        text: material.activo
          ? M.deactivated(material.nombre)
          : M.activated(material.nombre),
      });
      crud.reload();
    } catch (error) {
      setNotice({ type: "error", text: mapError(error, M.statusError) });
    }
  };

  const handleStockSaved = (nuevoStock) => {
    setNotice({
      type: "success",
      text: M.stockUpdated(
        stockTarget.nombre,
        nuevoStock,
        stockTarget.unidadMedida,
      ),
    });
    setStockTarget(null);
    crud.reload();
  };

  const C = MATERIAL_ADMIN.columns;

  const columns = [
    { header: C.code, key: "codigo" },
    {
      header: C.name,
      render: (m) => (
        <div>
          <div className="font-medium text-neutral-900">{m.nombre}</div>
          {m.descripcion && (
            <div className="line-clamp-1 max-w-xs text-xs text-neutral-500">
              {m.descripcion}
            </div>
          )}
        </div>
      ),
    },
    { header: C.type, render: (m) => getMaterialTypeLabel(m.categoria) },
    { header: C.unit, key: "unidadMedida" },
    {
      header: C.cost,
      render: (m) =>
        m.costoUnitario == null ? "-" : formatPrice(m.costoUnitario),
    },
    {
      header: C.stock,
      render: (m) => {
        const bajo = m.stockActual < m.stockMinimo;
        return (
          <div>
            <span className={bajo ? "font-medium text-red-700" : undefined}>
              {m.stockActual} {m.unidadMedida}
            </span>
            <div className="text-xs text-neutral-500">
              {MATERIAL_ADMIN.minShort} {m.stockMinimo}
              {bajo && (
                <span className="ml-2 rounded-full bg-red-100 px-2 py-0.5 font-medium text-red-700">
                  {MATERIAL_ADMIN.lowStockBadge}
                </span>
              )}
            </div>
          </div>
        );
      },
    },
    {
      header: C.status,
      render: (m) => (
        <span
          className={`rounded-full px-2 py-0.5 text-xs font-medium ${
            m.activo
              ? "bg-green-100 text-green-800"
              : "bg-neutral-200 text-neutral-600"
          }`}
        >
          {m.activo
            ? MATERIAL_ADMIN.statusActive
            : MATERIAL_ADMIN.statusInactive}
        </span>
      ),
    },
    {
      header: C.actions,
      render: (m) => (
        <div className="flex flex-wrap gap-4">
          <Button
            variant="linkEdit"
            onClick={() => openEdit(m)}
            aria-label={`${MESSAGES.actions.edit} ${m.nombre}`}
          >
            {MESSAGES.actions.edit}
          </Button>
          <Button
            variant="linkEdit"
            onClick={() => setStockTarget(m)}
            disabled={!m.activo}
            title={!m.activo ? M.stockInactive : undefined}
          >
            {MATERIAL_ADMIN.stockAction}
          </Button>
          <Button
            variant={m.activo ? "linkDelete" : "linkEdit"}
            onClick={() => handleToggle(m)}
          >
            {m.activo ? MATERIAL_ADMIN.deactivate : MATERIAL_ADMIN.activate}
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
            {MATERIAL_ADMIN.pageTitle}
          </h1>
          <p className="mt-1 text-sm text-neutral-500">{M.subtitle}</p>
        </div>
        <Button variant="compact" onClick={openCreate}>
          {MATERIAL_ADMIN.createButton}
        </Button>
      </header>

      {!formOpen && crud.error && <Feedback type="error">{crud.error}</Feedback>}
      {crud.message && <Feedback type="success">{crud.message}</Feedback>}
      {notice && <Feedback type={notice.type}>{notice.text}</Feedback>}

      <DataTable
        columns={columns}
        rows={crud.items}
        empty={crud.loading ? MESSAGES.loading : MATERIAL_ADMIN.emptyText}
      />

      {formOpen && (
        <MaterialFormModal
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

      {stockTarget && (
        <StockMovementModal
          material={stockTarget}
          onClose={() => setStockTarget(null)}
          onSaved={handleStockSaved}
        />
      )}
    </div>
  );
};

export default AdminMateriales;