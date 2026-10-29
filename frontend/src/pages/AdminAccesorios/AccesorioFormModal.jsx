import { Link } from "react-router";
import Button from "../../components/Button/Button";
import Feedback from "../../components/Feedback/Feedback";
import Modal from "../../components/Modal/Modal";
import TextField from "../../components/TextField/TextField";
import {
  ACCESORIO_FORM,
  ACCESORIO_MESSAGES as M,
} from "../../constants/ACCESORIOS";
import { MESSAGES } from "../../constants/MESSAGES";
import { ROUTES } from "../../constants/ROUTES";

// Ventana con el formulario para crear o editar un accesorio.
// Props:
//   editing: true si se está editando un accesorio existente
//   values: valores actuales de los campos
//   onChange: se ejecuta cuando el usuario escribe o elige algo
//   onSubmit: se ejecuta al guardar
//   onCancel: cierra la ventana sin guardar
//   saving: true mientras se guarda (desactiva los botones)
//   error: mensaje de error a mostrar dentro de la ventana
//   stock: stock del inventario del accesorio editado (solo lectura)
const AccesorioFormModal = ({
  editing,
  values,
  onChange,
  onSubmit,
  onCancel,
  saving,
  error,
  stock,
}) => {
  return (
    <Modal
      title={editing ? ACCESORIO_FORM.editTitle : ACCESORIO_FORM.createTitle}
      onClose={onCancel}
      closeOnBackdrop={false}
      size="lg"
    >
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {ACCESORIO_FORM.fields.map(({ half, ...field }, index) => (
            <div key={field.name} className={half ? "" : "sm:col-span-2"}>
              <TextField
                id={field.name}
                value={values[field.name] ?? ""}
                onChange={onChange}
                autoFocus={index === 0}
                {...field}
              />
            </div>
          ))}
        </div>

        {/* El stock viene del inventario y no se edita aquí */}
        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm text-neutral-700">
          {editing && stock && (
            <p className="mb-1">
              <strong>{M.currentStock}:</strong> {stock.stockActual}{" "}
              {stock.unidadMedida} · <strong>{M.minStock}:</strong>{" "}
              {stock.stockMinimo} {stock.unidadMedida}
            </p>
          )}
          <p>
            {editing ? M.stockNoteEdit : M.stockNoteCreate}{" "}
            <Link
              to={ROUTES.inventory}
              className="font-semibold underline hover:text-neutral-900"
            >
              {M.inventoryLink}
            </Link>
          </p>
        </div>

        {/* El error va junto a los botones para que se vea sin hacer scroll */}
        {error && <Feedback type="error">{error}</Feedback>}

        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel} disabled={saving}>
            {MESSAGES.actions.cancel}
          </Button>
          <Button type="submit" variant="compact" disabled={saving}>
            {editing ? MESSAGES.actions.saveChanges : ACCESORIO_FORM.createLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AccesorioFormModal;