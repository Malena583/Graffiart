import Button from "../../components/Button/Button";
import Feedback from "../../components/Feedback/Feedback";
import Modal from "../../components/Modal/Modal";
import TextField from "../../components/TextField/TextField";
import { MESSAGES } from "../../constants/MESSAGES";
import {
  MATERIAL_ADMIN,
  MATERIAL_MESSAGES as M,
} from "../../constants/MATERIALES";

// Ventana con el formulario para crear o editar un material.
// Props:
//   editing: true si se está editando un material existente
//   values: valores actuales de los campos
//   onChange: se ejecuta cuando el usuario escribe o elige algo
//   onSubmit: se ejecuta al guardar
//   onCancel: cierra la ventana sin guardar
//   saving: true mientras se guarda (desactiva los botones)
//   error: mensaje de error a mostrar dentro de la ventana
//   stock: material editado, para mostrar su stock actual (solo lectura)
const MaterialFormModal = ({
  editing,
  values,
  onChange,
  onSubmit,
  onCancel,
  saving,
  error,
  stock,
}) => {
  // El stock inicial solo se pide al crear
  const fields = MATERIAL_ADMIN.fields.filter(
    (field) => !(field.createOnly && editing),
  );

  return (
    <Modal
      title={editing ? MATERIAL_ADMIN.editTitle : MATERIAL_ADMIN.createTitle}
      onClose={onCancel}
      closeOnBackdrop={false}
      size="lg"
    >
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {fields.map(({ half, createOnly, ...field }, index) => (
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

        {/* El stock se mueve desde la tabla para que quede registrado */}
        <p className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm text-neutral-700">
          {editing && stock
            ? M.stockNoteEdit(stock.stockActual, stock.unidadMedida)
            : M.stockNoteCreate}
        </p>

        {/* El error va junto a los botones para que se vea sin hacer scroll */}
        {error && <Feedback type="error">{error}</Feedback>}

        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel} disabled={saving}>
            {MESSAGES.actions.cancel}
          </Button>
          <Button type="submit" variant="compact" disabled={saving}>
            {saving
              ? MESSAGES.actions.saving
              : editing
                ? MESSAGES.actions.saveChanges
                : MATERIAL_ADMIN.createLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default MaterialFormModal;