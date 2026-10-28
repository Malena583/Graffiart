import Button from "../../components/Button/Button";
import DataTable from "../../components/DataTable/DataTable";
import EntityForm from "../../components/EntityForm/EntityForm";
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
          <Button variant="linkEdit" onClick={() => crud.startEdit(material)}>
            {MESSAGES.actions.edit}
          </Button>
          <Button
            variant="linkDelete"
            onClick={() => {
              if (window.confirm(MESSAGES.confirmDelete(M.item))) {
                crud.remove(material.id);
              }
            }}
          >
            {MESSAGES.actions.delete}
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      <header>
        <h1 className="text-xl font-semibold text-neutral-900">{M.title}</h1>
        <p className="mt-1 text-sm text-neutral-500">{M.subtitle}</p>
      </header>
      {crud.error && <Feedback type="error">{crud.error}</Feedback>}
      {crud.message && <Feedback type="success">{crud.message}</Feedback>}

      {lowStock.length > 0 && (
        <Feedback type="warning">
          <h2 className="mb-2 font-semibold">{M.lowStock}</h2>
          <ul className="space-y-1">
            {lowStock.map((material) => (
              <li key={material.id}>
                <strong>{material.nombre}</strong>: stock actual{" "}
                {material.stockActual} {material.unidadMedida}, mínimo{" "}
                {material.stockMinimo} {material.unidadMedida}.
              </li>
            ))}
          </ul>
        </Feedback>
      )}

      <EntityForm
        fields={MATERIAL_FORM.fields}
        values={crud.values}
        onChange={crud.onChange}
        onSubmit={crud.onSubmit}
        onCancel={crud.cancelEdit}
        editing={Boolean(crud.editingId)}
        submitLabel={MATERIAL_FORM.createLabel}
        editLabel={MESSAGES.actions.saveChanges}
      />

      <DataTable columns={columns} rows={crud.items} empty={M.empty} />
    </div>
  );
};

export default Inventario;