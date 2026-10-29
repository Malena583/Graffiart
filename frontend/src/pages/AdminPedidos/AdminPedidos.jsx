
import { useState } from "react";
import Button from "../../components/Button/Button";
import DataTable from "../../components/DataTable/DataTable";
import Feedback from "../../components/Feedback/Feedback";

import useFetch from "../../hooks/useFetch";
import {
  listarPedidos,
  actualizarEstadoPedido,
} from "../../services/pedidoService";
import { getErrorMessage } from "../../utils/errors";
import { formatPrice } from "../../utils/format";
import Modal from "../../components/Modal/Modal";

const ESTADOS = [
  "PENDIENTE",
  "CONFIRMADO",
  "EN_PREPARACION",
  "ENVIADO",
  "ENTREGADO",
  "CANCELADO",
];

const nombresEstado = {
  PENDIENTE: "Pendiente",
  CONFIRMADO: "Confirmado",
  EN_PREPARACION: "En preparación",
  ENVIADO: "Enviado",
  ENTREGADO: "Entregado",
  CANCELADO: "Cancelado",
};

const AdminPedidos = () => {
  const [actualizando, setActualizando] = useState(null);
  const [errorAccion, setErrorAccion] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [pedidoDetalle, setPedidoDetalle] = useState(null);
  const { data, error, loading, reload } = useFetch(
    "pedidos",
    listarPedidos,
    "No se pudieron cargar los pedidos."
  );

  const pedidos = Array.isArray(data) ? data : [];

  const cambiarEstado = async (pedido, estado) => {
    if (estado === pedido.estado) return;

    setActualizando(pedido.id);
    setErrorAccion("");
    setMensaje("");

    try {
      await actualizarEstadoPedido(pedido.id, estado);
      setMensaje(`Pedido ${pedido.codigoPedido} actualizado.`);
      await reload();
    } catch (err) {
      setErrorAccion(
        getErrorMessage(err, "No se pudo actualizar el estado del pedido.")
      );
    } finally {
      setActualizando(null);
    }
  };

  const columns = [
    {
      header: "Pedido",
      render: (p) => (
        <div>
          <p className="font-semibold text-neutral-900">{p.codigoPedido}</p>
          <p className="text-xs text-neutral-500">
            {p.createdAt
              ? new Date(p.createdAt).toLocaleDateString("es-AR")
              : "Sin fecha"}
          </p>
        </div>
      ),
    },
    {
      header: "Cliente",
      render: (p) => (
        <div>
          <p className="font-medium">{p.clienteNombre}</p>
          <p className="text-xs text-neutral-500">{p.clienteEmail}</p>
        </div>
      ),
    },
    {
      header: "Artículos",
      render: (p) => (
        <div className="min-w-44 space-y-1">
          {(p.detalles || []).map((detalle) => (
            <p key={detalle.id}>
              {detalle.cantidad} × {detalle.nombreArticulo}
            </p>
          ))}
        </div>
      ),
    },
    {
      header: "Total",
      render: (p) => formatPrice(Number(p.total)),
    },
    {
      header: "Pago",
      render: (p) => (
        <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-800">
          {p.estadoPago}
        </span>
      ),
    },
    {
      header: "Estado",
      render: (p) => (
        <select
          value={p.estado}
          disabled={actualizando === p.id || p.estado === "CANCELADO"}
          onChange={(event) => cambiarEstado(p, event.target.value)}
          className="rounded-lg border border-neutral-300 bg-white px-2 py-2 text-xs disabled:opacity-60"
          aria-label={`Estado del pedido ${p.codigoPedido}`}
        >
          {ESTADOS.map((estado) => (
            <option key={estado} value={estado}>
              {nombresEstado[estado]}
            </option>
          ))}
        </select>
      ),
    },

    {
      header: "Acciones",
      render: (p) => (
        <Button
          variant="compact"
          onClick={() => setPedidoDetalle(p)}
        >
          Ver detalle
        </Button>
      ),
    },
  ];

  return (
  <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6">
    <header>
      <h1 className="text-xl font-semibold text-neutral-900">Pedidos</h1>
      <p className="mt-1 text-sm text-neutral-500">
        Consultá las compras y actualizá su estado de preparación y envío.
      </p>
    </header>

    {error && <Feedback type="error">{error}</Feedback>}
    {errorAccion && <Feedback type="error">{errorAccion}</Feedback>}
    {mensaje && <Feedback type="success">{mensaje}</Feedback>}

    <DataTable
      columns={columns}
      rows={pedidos}
      empty={loading ? "Cargando pedidos..." : "Todavía no hay pedidos."}
    />

    <div className="flex justify-end">
      <Button variant="compact" onClick={reload}>
        Actualizar lista
      </Button>
    </div>

    {pedidoDetalle && (
      <Modal
        title={`Pedido ${pedidoDetalle.codigoPedido}`}
        onClose={() => setPedidoDetalle(null)}
        size="lg"
      >
        <div className="space-y-6 text-sm">
          <section>
            <h3 className="mb-2 font-semibold text-neutral-900">
              Datos del cliente
            </h3>
            <p>Nombre: {pedidoDetalle.clienteNombre}</p>
            <p>Email: {pedidoDetalle.clienteEmail}</p>
            <p>Teléfono: {pedidoDetalle.clienteTelefono}</p>
          </section>

          <section>
            <h3 className="mb-2 font-semibold text-neutral-900">
              Dirección de envío
            </h3>
            <p>{pedidoDetalle.direccionEnvio}</p>
            <p>
              {pedidoDetalle.localidad}, {pedidoDetalle.provincia}
            </p>
            <p>Código postal: {pedidoDetalle.codigoPostal}</p>
          </section>

          <section>
            <h3 className="mb-2 font-semibold text-neutral-900">
              Artículos comprados
            </h3>
            <div className="space-y-3">
              {(pedidoDetalle.detalles || []).map((detalle) => (
                <div
                  key={detalle.id}
                  className="rounded-lg border border-neutral-200 p-3"
                >
                  <p className="font-medium text-neutral-900">
                    {detalle.nombreArticulo}
                  </p>
                  <p>Cantidad: {detalle.cantidad}</p>
                  <p>
                    Precio unitario:{" "}
                    {formatPrice(Number(detalle.precioUnitario))}
                  </p>
                  <p>Subtotal: {formatPrice(Number(detalle.subtotal))}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-1 border-t border-neutral-200 pt-4">
            <p>Subtotal: {formatPrice(Number(pedidoDetalle.subtotal))}</p>
            <p>Envío: {formatPrice(Number(pedidoDetalle.costoEnvio))}</p>
            <p>Pago: {pedidoDetalle.estadoPago}</p>
            <p>Método: {pedidoDetalle.metodoPago}</p>
            <p className="text-base font-bold text-neutral-900">
              Total: {formatPrice(Number(pedidoDetalle.total))}
            </p>
          </section>

          <div className="flex justify-end">
            <Button
              variant="secondary"
              onClick={() => setPedidoDetalle(null)}
            >
              Cerrar
            </Button>
          </div>
        </div>
      </Modal>
    )}
  </div>
);
};

export default AdminPedidos;