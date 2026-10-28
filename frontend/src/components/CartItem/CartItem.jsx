import { Trash2 } from "lucide-react";
import { Link } from "react-router";
import { formatPrice } from "../../utils/format";
import { MESSAGES } from "../../constants/MESSAGES";
import { ROUTES } from "../../constants/ROUTES";

const QUANTITY_BUTTON_CLASS =
  "cursor-pointer px-2 font-bold text-neutral-600 hover:text-neutral-900";

// Un producto dentro del carrito, con su precio, cantidad y botón para quitarlo.
// Props:
//   item: el producto del carrito
//   onIncrement: qué hacer al sumar una unidad
//   onDecrement: qué hacer al restar una unidad
//   onRemove: qué hacer al eliminar el producto
const CartItem = ({
  item,
  onIncrement,
  onDecrement,
  onRemove,
  onNavigate,
  disabled = false,
}) => {
  const price = Number(item.costoUnitario ?? 0);

  return (
    <article className="flex flex-col justify-between gap-4 rounded-xl border border-neutral-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center">
      <div className="space-y-1">
        {item.configuracion?.imagen && (
          <img
            src={item.configuracion.imagen}
            alt={item.nombre}
            className="mb-3 h-24 w-24 rounded-lg border border-neutral-200 object-cover"
          />
        )}
        <h2 className="font-semibold text-neutral-900">{item.nombre}</h2>
        {item.marca && (
          <p className="text-sm text-neutral-500">
            {MESSAGES.labels.brand}: {item.marca}
          </p>
        )}
        {item.formato && (
          <p className="text-xs text-neutral-500">
            {item.formato} • {item.tamano} • {item.panel}
          </p>
        )}
        {item.configuracion ? (
          <p className="max-w-xl whitespace-pre-line text-xs text-neutral-500">
            {item.configuracion.resumen}
          </p>
        ) : (
          <Link
            to={ROUTES.productDetail(item.id)}
            onClick={onNavigate}
            className="inline-block text-xs text-blue-600 hover:underline"
          >
            {MESSAGES.actions.viewDetails}
          </Link>
        )}
        <p className="pt-1 text-sm font-semibold text-neutral-900">
          {formatPrice(price)} {MESSAGES.labels.perUnit}
        </p>
      </div>

      <div className="flex items-center justify-between gap-4 sm:justify-end">
        <div className="flex items-center gap-2 rounded-lg border border-neutral-300 px-2 py-1">
          <button type="button" onClick={onDecrement} disabled={disabled} className={QUANTITY_BUTTON_CLASS} aria-label={MESSAGES.actions.removeOne}>
            -
          </button>
          <span className="min-w-6 text-center font-semibold text-neutral-900">
            {item.cantidad}
          </span>
          <button type="button" onClick={onIncrement} disabled={disabled} className={QUANTITY_BUTTON_CLASS} aria-label={MESSAGES.actions.addOne}>
            +
          </button>
        </div>
        <div className="min-w-24 text-right">
          <p className="text-xs text-neutral-500">{MESSAGES.labels.subtotal}</p>
          <p className="font-semibold text-neutral-900">
            {formatPrice(price * item.cantidad)}
          </p>
        </div>
        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          className="cursor-pointer text-red-500 hover:text-red-700"
          aria-label={MESSAGES.actions.remove(item.nombre)}
        >
          <Trash2 size={18} />
        </button>
      </div>
    </article>
  );
};

export default CartItem;
