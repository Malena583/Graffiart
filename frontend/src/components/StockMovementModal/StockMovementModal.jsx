import { useState } from "react";
import Button from "../../components/Button/Button";
import Feedback from "../../components/Feedback/Feedback";
import Modal from "../../components/Modal/Modal";
import TextField from "../../components/TextField/TextField";
import { MESSAGES } from "../../constants/MESSAGES";
import {
  MATERIAL_MESSAGES as M,
  STOCK_FORM,
} from "../../constants/MATERIALES";
import { stockMovimientoSchema } from "../../schemas/Materialadmin";
import inventarioMovimientoService from "../../services/inventarioMovimientoService";
import { getErrorMessage } from "../../utils/errors";

const mapError = (error, fallback) =>
  [401, 403].includes(error?.response?.status)
    ? M.authError
    : getErrorMessage(error, fallback);

// Stock que quedaría después del movimiento (null si todavía no se puede calcular)
const calcularResultado = (tipo, cantidad, stockActual) => {
  const cantidadNumerica = Number(cantidad);
  if (cantidad === "" || !Number.isInteger(cantidadNumerica)) return null;
  if (tipo === "ENTRADA") return stockActual + cantidadNumerica;
  if (tipo === "SALIDA") return stockActual - cantidadNumerica;
  return cantidadNumerica;
};

// Ventana para registrar una entrada, salida o ajuste de stock de un material.
// El cambio se guarda como un movimiento del inventario (InventarioMovimiento).
// Props:
//   material: material al que se le mueve el stock
//   onClose: cierra la ventana sin guardar
//   onSaved: se ejecuta cuando el movimiento se registró correctamente
const StockMovementModal = ({ material, onClose, onSaved }) => {
  const [values, setValues] = useState(STOCK_FORM.initialValues);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const stockActual = Number(material.stockActual);
  const resultado = calcularResultado(values.tipo, values.cantidad, stockActual);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleClose = () => {
    if (!saving) onClose();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    let payload;
    try {
      payload = await stockMovimientoSchema.validate(values, {
        abortEarly: true,
      });
    } catch (validationError) {
      setError(validationError.message);
      return;
    }

    if (payload.tipo === "SALIDA" && payload.cantidad > stockActual) {
      setError(M.insufficientStock);
      return;
    }

    setSaving(true);
    try {
      await inventarioMovimientoService.crear({
        entidad: "material",
        articuloId: material.id,
        tipo: payload.tipo,
        cantidad: payload.cantidad,
        motivo: payload.motivo || undefined,
      });
      onSaved(calcularResultado(payload.tipo, payload.cantidad, stockActual));
    } catch (requestError) {
      setError(mapError(requestError, M.stockError));
    } finally {
      setSaving(false);
    }
  };

  const F = STOCK_FORM.fields;

  return (
    <Modal
      title={STOCK_FORM.title(material.nombre)}
      onClose={handleClose}
      closeOnBackdrop={false}
      size="lg"
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <p className="rounded-lg border border-neutral-200 bg-neutral-50 p-3 text-sm text-neutral-700">
          <strong>{STOCK_FORM.currentStock}:</strong> {stockActual}{" "}
          {material.unidadMedida}
          {resultado !== null && (
            <>
              {" · "}
              <strong>{STOCK_FORM.resultingStock}:</strong>{" "}
              <span className={resultado < 0 ? "text-red-700" : undefined}>
                {resultado} {material.unidadMedida}
              </span>
            </>
          )}
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            id={F.tipo.name}
            value={values.tipo}
            onChange={handleChange}
            {...F.tipo}
          />
          <TextField
            id={F.cantidad.name}
            value={values.cantidad}
            onChange={handleChange}
            autoFocus
            {...F.cantidad}
          />
          <div className="sm:col-span-2">
            <TextField
              id={F.motivo.name}
              value={values.motivo}
              onChange={handleChange}
              {...F.motivo}
            />
          </div>
        </div>

        {values.tipo === "AJUSTE" && (
          <p className="text-xs text-neutral-500">{STOCK_FORM.adjustHint}</p>
        )}

        {error && <Feedback type="error">{error}</Feedback>}

        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={handleClose} disabled={saving}>
            {MESSAGES.actions.cancel}
          </Button>
          <Button type="submit" variant="compact" disabled={saving}>
            {saving ? MESSAGES.actions.saving : STOCK_FORM.submit}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default StockMovementModal;