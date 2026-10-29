
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
import { useAuthStore } from "../../store/authStore";
import { ROUTES } from "../../constants/ROUTES";
import { validarConfiguracion } from "../../services/gabineteService";
import { crearPedido } from "../../services/pedidoService";
import { formatPrice } from "../../utils/format";
import { CONFIGURATOR_TEXTS } from "../../constants/CONFIGURATOR";

const M = MESSAGES.cart;

const Carrito = () => {
  const carrito = useCartStore((state) => state.carrito);
  const total = useCartStore(selectPrecioTotal);
  const incrementarCantidad = useCartStore((s) => s.incrementarCantidad);
  const decrementarCantidad = useCartStore((s) => s.decrementarCantidad);
  const removerDelCarrito = useCartStore((s) => s.removerDelCarrito);
  const vaciarCarrito = useCartStore((s) => s.vaciarCarrito);
  const usuario = useAuthStore((s) => s.usuario);

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState("");
  const [orderResult, setOrderResult] = useState(null);

  const [cliente, setCliente] = useState(() => ({
    nombre: usuario?.nombre
      ? [usuario.nombre, usuario.apellido].filter(Boolean).join(" ")
      : "",
    email: usuario?.email ?? "",
    telefono: usuario?.telefono ?? "",
    direccionEnvio: "",
    localidad: "",
    provincia: "",
    codigoPostal: "",
  }));

  const actualizarCliente = (event) => {
    const { name, value } = event.target;
    setCliente((actual) => ({ ...actual, [name]: value }));
  };

  const handleCheckout = async () => {
    setCheckoutError("");

    const camposObligatorios = [
      "nombre",
      "email",
      "direccionEnvio",
      "localidad",
      "provincia",
    ];

    const campoVacio = camposObligatorios.some(
      (campo) => !String(cliente[campo] ?? "").trim(),
    );

    if (campoVacio) {
      setCheckoutError(
        "CompletÃ¡ tu nombre, email, direcciÃ³n, localidad y provincia.",
      );
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cliente.email.trim())) {
      setCheckoutError("IngresÃ¡ un email vÃ¡lido.");
      return;
    }

    if (carrito.length === 0) {
      setCheckoutError("El carrito estÃ¡ vacÃ­o.");
      return;
    }

    setCheckoutLoading(true);
    const carritoValidado = carrito;

    try {
      for (const item of carritoValidado) {
        if (!item.configuracion) continue;

        const availability = await validarConfiguracion({
          ...(item.configuracion.tamanoId
            ? { tamanoId: item.configuracion.tamanoId }
            : { gabineteId: item.configuracion.gabineteId }),
          materialIds: item.configuracion.materialIds ?? [],
          accesorioIds: item.configuracion.accesorioIds ?? [],
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
              formatPrice(Number(availability.total) / item.cantidad),
              formatPrice(item.costoUnitario),
            ),
          );
          return;
        }
      }

      if (useCartStore.getState().carrito !== carritoValidado) {
        setCheckoutError(M.changedCart);
        return;
      }

      const pedido = {
        cliente: {
          nombre: cliente.nombre.trim(),
          email: cliente.email.trim(),
          telefono: cliente.telefono.trim(),
          direccionEnvio: cliente.direccionEnvio.trim(),
          localidad: cliente.localidad.trim(),
          provincia: cliente.provincia.trim(),
          codigoPostal: cliente.codigoPostal.trim(),
        },
        metodoPago: "SIMULADO",
        items: carritoValidado.map((item) => {
          if (item.configuracion) {
            return {
              tipo: "PERSONALIZADO",
              cantidad: item.cantidad,
              configuracion: item.configuracion,
            };
          }

          return {
            tipo: "GABINETE",
            gabineteId: item.id,
            cantidad: item.cantidad,
          };
        }),
      };

      const resultado = await crearPedido(pedido);

      setOrderResult({
        codigoPedido:
          resultado.codigoPedido ?? resultado.pedido?.codigoPedido,
        codigoSeguimiento: resultado.codigoSeguimiento,
      });

      vaciarCarrito();
    } catch (error) {
      const unavailable = error.response?.data?.noDisponibles
        ?.map((option) => `${option.nombre}: ${option.motivo}`)
        .join(" ");

      setCheckoutError(
        unavailable ||
          error.response?.data?.error ||
          "No se pudo crear el pedido. RevisÃ¡ los datos e intentÃ¡ nuevamente.",
      );
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (orderResult) {
    return (
      <MainContainer width="md">
        <div className="space-y-4 rounded-xl border border-neutral-200 bg-white p-6">
          <Feedback type="success">
            Tu pedido se creÃ³ correctamente. El pago es simulado.
          </Feedback>

          <h1 className="text-xl font-bold text-neutral-900">
            Compra finalizada
          </h1>

          <div className="space-y-2 text-sm text-neutral-700">
            <p>
              <strong>NÃºmero de pedido:</strong>{" "}
              {orderResult.codigoPedido || "No disponible"}
            </p>
            <p>
              <strong>CÃ³digo de seguimiento:</strong>{" "}
              {orderResult.codigoSeguimiento || "No disponible"}
            </p>
          </div>

          <p className="text-sm text-neutral-600">
            GuardÃ¡ el cÃ³digo de seguimiento. Lo vas a necesitar junto con el
            nÃºmero de pedido para consultar su estado.
          </p>

          <Link
            to={ROUTES.products}
            className="inline-block rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white"
          >
            {M.viewCatalog}
          </Link>
        </div>
      </MainContainer>
    );
  }

  if (carrito.length === 0) {
    return (
      <MainContainer width="md">
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
        <div className="space-y-6 lg:col-span-2">
          <section className="space-y-4 rounded-xl border border-neutral-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-neutral-900">
              Datos de contacto y envÃ­o
            </h2>

            <p className="text-sm text-neutral-600">
              {usuario
                ? "ConfirmÃ¡ los datos donde querÃ©s recibir el pedido."
                : "PodÃ©s comprar sin iniciar sesiÃ³n. CompletÃ¡ tus datos para el envÃ­o."}
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="space-y-1 text-sm">
                <span className="font-medium">Nombre y apellido *</span>
                <input
                  name="nombre"
                  value={cliente.nombre}
                  onChange={actualizarCliente}
                  autoComplete="name"
                  required
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2"
                />
              </label>

              <label className="space-y-1 text-sm">
                <span className="font-medium">Email *</span>
                <input
                  type="email"
                  name="email"
                  value={cliente.email}
                  onChange={actualizarCliente}
                  autoComplete="email"
                  required
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2"
                />
              </label>

              <label className="space-y-1 text-sm">
                <span className="font-medium">TelÃ©fono</span>
                <input
                  type="tel"
                  name="telefono"
                  value={cliente.telefono}
                  onChange={actualizarCliente}
                  autoComplete="tel"
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2"
                />
              </label>

              <label className="space-y-1 text-sm">
                <span className="font-medium">DirecciÃ³n *</span>
                <input
                  name="direccionEnvio"
                  value={cliente.direccionEnvio}
                  onChange={actualizarCliente}
                  autoComplete="street-address"
                  required
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2"
                />
              </label>

              <label className="space-y-1 text-sm">
                <span className="font-medium">Localidad *</span>
                <input
                  name="localidad"
                  value={cliente.localidad}
                  onChange={actualizarCliente}
                  autoComplete="address-level2"
                  required
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2"
                />
              </label>

              <label className="space-y-1 text-sm">
                <span className="font-medium">Provincia *</span>
                <input
                  name="provincia"
                  value={cliente.provincia}
                  onChange={actualizarCliente}
                  autoComplete="address-level1"
                  required
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2"
                />
              </label>

              <label className="space-y-1 text-sm sm:col-span-2">
                <span className="font-medium">CÃ³digo postal</span>
                <input
                  name="codigoPostal"
                  value={cliente.codigoPostal}
                  onChange={actualizarCliente}
                  autoComplete="postal-code"
                  className="w-full rounded-lg border border-neutral-300 px-3 py-2"
                />
              </label>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-neutral-900">
              Productos
            </h2>

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

            <Button
              variant="mutedText"
              onClick={vaciarCarrito}
              disabled={checkoutLoading}
            >
              {M.clear}
            </Button>
          </section>
        </div>

        <div className="space-y-3">
          {checkoutError && (
            <Feedback type="error">{checkoutError}</Feedback>
          )}

          <OrderSummary
            total={total}
            onCheckout={handleCheckout}
            loading={checkoutLoading}
          />

          <p className="text-xs text-neutral-500">
            Pago simulado: no ingreses ni envÃ­es datos reales de tarjetas.
          </p>
        </div>
      </div>
    </MainContainer>
  );
};

export default Carrito;
