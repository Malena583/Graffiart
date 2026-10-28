//frontend/src/components/ConfirmDialog/ConfirmDialog.jsx
import Button from "../Button/Button";
import Modal from "../Modal/Modal";
import { MESSAGES } from "../../constants/MESSAGES";

// Ventana para pedir confirmación antes de una acción peligrosa (por ejemplo eliminar).
// Props:
//   title: título de la ventana
//   confirmLabel: texto del botón que confirma
//   onConfirm: qué hacer si el usuario confirma
//   onCancel: qué hacer si cancela o cierra la ventana
//   loading: true mientras se procesa (desactiva los botones)
//   children: el mensaje a mostrar
const ConfirmDialog = ({
  title,
  confirmLabel,
  onConfirm,
  onCancel,
  loading = false,
  children,
}) => {
  return (
    <Modal title={title} onClose={onCancel} size="sm">
      <div className="space-y-5">
        <div className="text-sm text-neutral-700">{children}</div>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onCancel} disabled={loading}>
            {MESSAGES.actions.cancel}
          </Button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;