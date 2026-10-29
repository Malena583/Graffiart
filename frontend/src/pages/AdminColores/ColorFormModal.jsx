import Button from "../../components/Button/Button";
import Feedback from "../../components/Feedback/Feedback";
import Modal from "../../components/Modal/Modal";
import TextField from "../../components/TextField/TextField";
import { COLOR_DEFAULT_HEX, COLOR_FORM } from "../../constants/COLORES";
import { MESSAGES } from "../../constants/MESSAGES";

const HEX = /^#[0-9A-Fa-f]{6}$/;

// Ventana con el formulario para crear o editar un color.
// Props:
//   editing: true si se está editando un color existente
//   values: valores actuales de los campos
//   onChange: se ejecuta cuando el usuario escribe o elige algo
//   onSubmit: se ejecuta al guardar
//   onCancel: cierra la ventana sin guardar
//   saving: true mientras se guarda (desactiva los botones)
//   error: mensaje de error a mostrar dentro de la ventana
const ColorFormModal = ({
  editing,
  values,
  onChange,
  onSubmit,
  onCancel,
  saving,
  error,
}) => {
  const F = COLOR_FORM.fields;
  const pickerValue = HEX.test(values.codigoHex ?? "")
    ? values.codigoHex
    : COLOR_DEFAULT_HEX;

  // El selector de color actualiza el campo de texto del código
  const handlePicker = (event) =>
    onChange({
      target: { name: "codigoHex", value: event.target.value.toUpperCase() },
    });

  return (
    <Modal
      title={editing ? COLOR_FORM.editTitle : COLOR_FORM.createTitle}
      onClose={onCancel}
      closeOnBackdrop={false}
      size="lg"
    >
      <form onSubmit={onSubmit} noValidate className="space-y-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            id={F.nombre.name}
            value={values.nombre ?? ""}
            onChange={onChange}
            autoFocus
            {...F.nombre}
          />

          <div className="flex items-end gap-3">
            <div className="flex-1">
              <TextField
                id={F.codigoHex.name}
                value={values.codigoHex ?? ""}
                onChange={onChange}
                {...F.codigoHex}
              />
            </div>
            <input
              type="color"
              aria-label={COLOR_FORM.pickerLabel}
              value={pickerValue}
              onChange={handlePicker}
              className="h-10 w-12 cursor-pointer rounded border border-neutral-300 bg-white p-1"
            />
          </div>

          <div className="sm:col-span-2">
            <TextField
              id={F.activo.name}
              value={values.activo ?? "true"}
              onChange={onChange}
              {...F.activo}
            />
          </div>
        </div>

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
                : COLOR_FORM.createLabel}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default ColorFormModal;