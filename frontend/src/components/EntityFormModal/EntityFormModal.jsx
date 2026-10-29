import Button from "../Button/Button";
import Feedback from "../Feedback/Feedback";
import Modal from "../Modal/Modal";
import TextField from "../TextField/TextField";
import { MESSAGES } from "../../constants/MESSAGES";

// Ventana con un formulario que se arma solo a partir de una lista de campos.
// Sirve para crear o editar cualquier registro (material, etc.).
// Props:
//   title: título de la ventana
//   fields: lista de campos (name, label, type, options, half)
//   values: valores actuales de cada campo
//   onChange: se ejecuta cuando el usuario escribe o elige algo
//   onSubmit: se ejecuta al guardar
//   onCancel: cierra la ventana sin guardar
//   editing: true si se está editando algo existente
//   createLabel: texto del botón al crear
//   saving: true mientras se guarda (desactiva los botones)
//   error: mensaje de error a mostrar dentro de la ventana
const EntityFormModal = ({
  title,
  fields,
  values,
  onChange,
  onSubmit,
  onCancel,
  editing = false,
  createLabel,
  saving = false,
  error,
}) => {
  return (
    <Modal title={title} onClose={onCancel} closeOnBackdrop={false} size="lg">
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {fields.map(({ half, ...field }, index) => (
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

        {error && <Feedback type="error">{error}</Feedback>}

        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel} disabled={saving}>
            {MESSAGES.actions.cancel}
          </Button>
          <Button type="submit" variant="compact" disabled={saving}>
            {editing ? MESSAGES.actions.saveChanges : createLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default EntityFormModal;