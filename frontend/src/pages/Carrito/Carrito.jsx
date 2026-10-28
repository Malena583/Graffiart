import { useState } from "react";
import { Link } from "react-router";
import CartItem from "../../components/CartItem/CartItem";
import Button from "../../components/Button/Button";
import Feedback from "../../components/Feedback/Feedback";
import OrderSummary from "../../components/OrderSummary/OrderSummary";
import MainContainer from "../../components/MainContainer/MainContainer";
import StateMessage from "../../components/StateMessage/StateMessage";
import { MESSAGES } from "../../constants/MESSAGES";
import { selectPrecioTotal, useCartStore } from "../../store/cartStore";
import { ROUTES } from "../../constants/ROUTES";
import { validarConfiguracion } from "../../services/gabineteService";
import { formatPrice } from "../../utils/format";
import { CONFIGURATOR_TEXTS } from "../../constants/CONFIGURATOR";

const M = MESSAGES.cart;

// Página del carrito de compras: lista de productos, resumen y compra.
const Carrito = () => {
  const carrito = useCartStore((state) => state.carrito);
  const total = useCartStore(selectPrecioTotal);
  const incrementarCantidad = useCartStore((s) => s.incrementarCantidad);
  const decrementarCantidad = useCartStore((s) => s.decrementarCantidad);
  const removerDelCarrito = useCartStore((s) => s.removerDelCarrito);
  const vaciarCarrito = useCartStore((s) => s.vaciarCarrito);
  const [purchased, setPurchased] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    setCheckoutError("");
    const carritoValidado = carrito;

    try {
      for (const item of carritoValidado) {
        if (item.configuracion) {
          const availability = await validarConfiguracion({
            ...(item.configuracion.tamanoId
              ? { tamanoId: item.configuracion.tamanoId }
              : { gabineteId: item.configuracion.gabineteId }),
            materialIds: item.configuracion.materialIds,
            accesorioIds: item.configuracion.accesorioIds,
            cantidad: item.cantidad,
          });
          const expectedTotal =
            Number(item.costoUnitario) * Number(item.cantidad);
          if (
            Math.round(Number(availability.total) * 100) !==
            Math.round(expectedTotal * 100)
          ) {
            setCheckoutError(
              CONFIGURATOR_TEXTS.priceChanged(
                formatPrice(availability.total / item.cantidad),
                formatPrice(item.costoUnitario),
              ),
            );
            return;
          }
        }
      }

      if (useCartStore.getState().carrito !== carritoValidado) {
        setCheckoutError(M.changedCart);
        return;
      }

      vaciarCarrito();
      setPurchased(true);
    } catch (error) {
      const unavailable = error.response?.data?.noDisponibles
        ?.map((option) => `${option.nombre}: ${option.motivo}`)
        .join(" ");
      setCheckoutError(
        unavailable ||
          error.response?.data?.error ||
          M.availabilityError,
      );
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (carrito.length === 0) {
    return (
      <MainContainer width="md">
        {purchased && <Feedback type="success">{M.checkoutSuccess}</Feedback>}
        <StateMessage
          title={M.emptyTitle}
          action={
            <Link
              to={ROUTES.products}
              className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white"
            >
              {M.viewCatalog}
            </Link>
          }
        >
          {M.emptyText}
        </StateMessage>
      </MainContainer>
    );
  }

  return (
    <MainContainer title={M.title} width="xl">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {carrito.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onIncrement={() => incrementarCantidad(item.id)}
              onDecrement={() => decrementarCantidad(item.id)}
              onRemove={() => removerDelCarrito(item.id)}
              disabled={checkoutLoading}
            />
          ))}
          <Button variant="mutedText" onClick={vaciarCarrito} disabled={checkoutLoading}>
            {M.clear}
          </Button>
        </div>

        <div className="space-y-3">
          {checkoutError && <Feedback type="error">{checkoutError}</Feedback>}
          <OrderSummary
            total={total}
            onCheckout={handleCheckout}
            loading={checkoutLoading}
          />
        </div>
      </div>
    </MainContainer>
  );
};

export default Carrito;
