//frontend/src/pages/AdminCategorias/CategoriaFormModal.jsx
import Button from "../../components/Button/Button";
import Feedback from "../../components/Feedback/Feedback";
import Modal from "../../components/Modal/Modal";
import TextField from "../../components/TextField/TextField";
import { CATEGORIA_FORM } from "../../constants/FORMS";
import { MESSAGES } from "../../constants/MESSAGES";

// Ventana con el formulario para crear o editar una categoría.
// Props:
//   editing: true si se está editando una categoría existente
//   values: valores actuales de los campos
//   onChange: se ejecuta cuando el usuario escribe
//   onSubmit: se ejecuta al guardar
//   onCancel: cierra la ventana sin guardar
//   saving: true mientras se guarda (desactiva los botones)
//   error: mensaje de error a mostrar dentro de la ventana
const CategoriaFormModal = ({
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
      title={editing ? CATEGORIA_FORM.editTitle : CATEGORIA_FORM.createTitle}
      onClose={onCancel}
      closeOnBackdrop={false}
    >
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        {error && <Feedback type="error">{error}</Feedback>}

        {CATEGORIA_FORM.fields.map((field, index) => (
          <TextField
            key={field.name}
            id={field.name}
            value={values[field.name] ?? ""}
            onChange={onChange}
            autoFocus={index === 0}
            {...field}
          />
        ))}

        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel} disabled={saving}>
            {MESSAGES.actions.cancel}
          </Button>
          <Button type="submit" variant="compact" disabled={saving}>
            {editing ? MESSAGES.actions.saveChanges : CATEGORIA_FORM.createLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default CategoriaFormModal;