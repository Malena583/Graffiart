import { MESSAGES } from "../../constants/MESSAGES";
import { formatPrice } from "../../utils/format";
import Button from "../Button/Button";

const M = MESSAGES.cart;

// Resumen del pedido en el carrito: subtotal, envío, total y botón para finalizar la compra.
// Props:
//   total: monto total a pagar
//   onCheckout: qué hacer al tocar "Finalizar compra"
const OrderSummary = ({ total, onCheckout, loading = false }) => {
  return (
    <aside className="h-fit space-y-3 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h2 className="border-b border-neutral-200 pb-3 text-lg font-semibold text-neutral-900">
        {M.summary}
      </h2>
      <div className="flex justify-between text-sm text-neutral-600">
        <span>{M.subtotal}</span>
        <span>{formatPrice(total)}</span>
      </div>
      <div className="flex justify-between text-sm text-neutral-600">
        <span>{M.shipping}</span>
        <span className="font-medium text-emerald-600">{M.free}</span>
      </div>
      <div className="flex justify-between border-t border-neutral-200 pt-3 text-lg font-bold text-neutral-900">
        <span>{M.total}</span>
        <span>{formatPrice(total)}</span>
      </div>
      <Button onClick={onCheckout} disabled={loading}>
        {loading ? M.validatingAvailability : M.checkout}
      </Button>
    </aside>
  );
};

export default OrderSummary;
