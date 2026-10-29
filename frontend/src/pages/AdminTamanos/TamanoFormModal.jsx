import Button from "../../components/Button/Button";
import Feedback from "../../components/Feedback/Feedback";
import Modal from "../../components/Modal/Modal";
import TextField from "../../components/TextField/TextField";
import { MESSAGES } from "../../constants/MESSAGES";
import { TAMANO_FORM, TAMANO_MESSAGES as M } from "../../constants/TAMANOS";

// Ventana con el formulario para crear o editar un tamaño.
// Props:
//   editing: true si se está editando un tamaño existente (el código queda bloqueado)
//   values: valores actuales de los campos
//   onChange: se ejecuta cuando el usuario escribe o elige algo
//   onSubmit: se ejecuta al guardar
//   onCancel: cierra la ventana sin guardar
//   saving: true mientras se guarda (desactiva los botones)
//   error: mensaje de error a mostrar dentro de la ventana
const TamanoFormModal = ({
  editing,
  values,
  onChange,
  onSubmit,
  onCancel,
  saving,
  error,
}) => {
  return (
    <Modal
      title={editing ? TAMANO_FORM.editTitle : TAMANO_FORM.createTitle}
      onClose={onCancel}
      closeOnBackdrop={false}
      size="lg"
    >
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {TAMANO_FORM.fields.map(({ half, ...field }) => (
            <div key={field.name} className={half ? "" : "sm:col-span-2"}>
              <TextField
                id={field.name}
                value={values[field.name] ?? ""}
                onChange={onChange}
                autoFocus={field.name === (editing ? "nombre" : "codigo")}
                {...field}
                disabled={field.name === "codigo" && editing}
              />
            </div>
          ))}
        </div>

        {editing && (
          <p className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm text-neutral-700">
            {M.codeLockedNote}
          </p>
        )}

        {/* El error va junto a los botones para que se vea sin hacer scroll */}
        {error && <Feedback type="error">{error}</Feedback>}

        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel} disabled={saving}>
            {MESSAGES.actions.cancel}
          </Button>
          <Button type="submit" variant="compact" disabled={saving}>
            {editing ? MESSAGES.actions.saveChanges : TAMANO_FORM.createLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TamanoFormModal;