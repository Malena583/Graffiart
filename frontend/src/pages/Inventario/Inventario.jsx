import { useState } from "react";
import AdminPage from "../../components/AdminPage/AdminPage";
import Button from "../../components/Button/Button";
import ConfirmDialog from "../../components/ConfirmDialog/ConfirmDialog";
import DataTable from "../../components/DataTable/DataTable";
import EntityFormModal from "../../components/EntityFormModal/EntityFormModal";
import Feedback from "../../components/Feedback/Feedback";
import { MATERIAL_FORM } from "../../constants/FORMS";
import { MESSAGES } from "../../constants/MESSAGES";
import useCrudResource from "../../hooks/useCrudResource";
import { materialSchema } from "../../schemas/entities";
import materialService from "../../services/materialService";
import { getErrorMessage } from "../../utils/errors";

const M = MESSAGES.admin.materiales;

const mapError = (error, fallback) =>
  [401, 403].includes(error.response?.status)
    ? M.authError
    : getErrorMessage(error, fallback);

const Inventario = () => {
  const crud = useCrudResource({
    key: "materiales",
    service: materialService,
    schema: materialSchema,
    initialValues: MATERIAL_FORM.initialValues,
    toFormValues: (material) => ({
      nombre: material.nombre,
      codigo: material.codigo,
      categoria: material.categoria,
      unidadMedida: material.unidadMedida,
      stockActual: material.stockActual,
      stockMinimo: material.stockMinimo,
      costoUnitario: material.costoUnitario ?? "",
      descripcion: material.descripcion ?? "",
    }),
    messages: M,
    mapError,
  });

  const [formOpen, setFormOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [materialToDelete, setMaterialToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const openCreate = () => {
    crud.cancelEdit(); // limpia el formulario y los avisos anteriores
    setFormOpen(true);
  };

  const openEdit = (material) => {
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
    // Si falla, el modal queda abierto con los datos que el usuario escribió
    if (saved) setFormOpen(false);
  };

  const closeDelete = () => {
    if (!deleting) setMaterialToDelete(null);
  };

  const handleDelete = async () => {
    setDeleting(true);
    await crud.remove(materialToDelete.id);
    setDeleting(false);
    setMaterialToDelete(null);
  };

  const lowStock = crud.items.filter(
    (material) => material.stockActual < material.stockMinimo,
  );

  const columns = [
    { header: MATERIAL_FORM.columns.name, key: "nombre" },
    { header: MATERIAL_FORM.columns.code, key: "codigo" },
    {
      header: MATERIAL_FORM.columns.category,
      render: (m) => (
        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs text-blue-700">
          {m.categoria}
        </span>
      ),
    },
    { header: MATERIAL_FORM.columns.stock, render: (m) => `${m.stockActual} ${m.unidadMedida}` },
    {
      header: MATERIAL_FORM.columns.actions,
      render: (material) => (
        <div className="flex gap-4">
          <Button
            variant="linkEdit"
            onClick={() => openEdit(material)}
            aria-label={`${MESSAGES.actions.edit} ${material.nombre}`}
          >
            {MESSAGES.actions.edit}
          </Button>
          <Button
            variant="linkDelete"
            onClick={() => setMaterialToDelete(material)}
            aria-label={`${MESSAGES.actions.delete} ${material.nombre}`}
          >
            {MESSAGES.actions.delete}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <AdminPage
      title={M.title}
      subtitle={M.subtitle}
      actionLabel={MATERIAL_FORM.createButton}
      onAction={openCreate}
    >
      {!formOpen && crud.error && <Feedback type="error">{crud.error}</Feedback>}
      {crud.message && <Feedback type="success">{crud.message}</Feedback>}

      {lowStock.length > 0 && (
        <Feedback type="warning">
          <h2 className="mb-2 font-semibold">{M.lowStock}</h2>
          <ul className="space-y-1">
            {lowStock.map((material) => (
              <li key={material.id}>
                <strong>{material.nombre}</strong>: {M.currentStock}{" "}
                {material.stockActual} {material.unidadMedida}, {M.minStock}{" "}
                {material.stockMinimo} {material.unidadMedida}.
              </li>
            ))}
          </ul>
        </Feedback>
      )}

      <DataTable
        columns={columns}
        rows={crud.items}
        empty={crud.loading ? MESSAGES.loading : M.empty}
      />

      {formOpen && (
        <EntityFormModal
          title={crud.editingId ? MATERIAL_FORM.editTitle : MATERIAL_FORM.createTitle}
          fields={MATERIAL_FORM.fields}
          values={crud.values}
          onChange={crud.onChange}
          onSubmit={handleSubmit}
          onCancel={closeForm}
          editing={Boolean(crud.editingId)}
          createLabel={MATERIAL_FORM.createLabel}
          saving={saving}
          error={crud.error}
        />
      )}

      {materialToDelete && (
        <ConfirmDialog
          title={M.confirmDeleteTitle}
          confirmLabel={MESSAGES.actions.delete}
          onConfirm={handleDelete}
          onCancel={closeDelete}
          loading={deleting}
        >
          <p>{M.confirmDeleteText(materialToDelete.nombre)}</p>
        </ConfirmDialog>
      )}
    </AdminPage>
  );
};

export default Inventario;