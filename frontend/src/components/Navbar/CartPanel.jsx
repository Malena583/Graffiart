import { Link } from "react-router";
import CartItem from "../CartItem/CartItem";
import StateMessage from "../StateMessage/StateMessage";
import { MESSAGES } from "../../constants/MESSAGES";
import { ROUTES } from "../../constants/ROUTES";
import {
  selectPrecioTotal,
  useCartStore,
} from "../../store/cartStore";
import { formatPrice } from "../../utils/format";

const M = MESSAGES.cart;

const CartPanel = ({ onClose }) => {
  const carrito = useCartStore((state) => state.carrito);
  const total = useCartStore(selectPrecioTotal);
  const incrementarCantidad = useCartStore((state) => state.incrementarCantidad);
  const decrementarCantidad = useCartStore((state) => state.decrementarCantidad);
  const removerDelCarrito = useCartStore((state) => state.removerDelCarrito);

  if (carrito.length === 0) {
    return (
      <StateMessage
        title={M.emptyTitle}
        action={
          <Link
            to={ROUTES.products}
            onClick={onClose}
            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-neutral-700"
          >
            {M.viewCatalog}
          </Link>
        }
      >
        {M.emptyText}
      </StateMessage>
    );
  }

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        {carrito.map((item) => (
          <CartItem
            key={item.id}
            item={item}
            onIncrement={() => incrementarCantidad(item.id)}
            onDecrement={() => decrementarCantidad(item.id)}
            onRemove={() => removerDelCarrito(item.id)}
            onNavigate={onClose}
          />
        ))}
      </div>
      <div className="space-y-4 rounded-xl border border-neutral-200 bg-white p-4">
        <div className="flex justify-between border-t border-neutral-200 pt-3 font-semibold text-neutral-900">
          <span>{M.total}</span>
          <span>{formatPrice(total)}</span>
        </div>
        <Link
          to={ROUTES.cart}
          onClick={onClose}
          className="block rounded-lg bg-neutral-900 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-neutral-700"
        >
          {MESSAGES.navbarPanels.continuePurchase}
        </Link>
      </div>
    </div>
  );
};

export default CartPanel;
