
import apiClient from "../api/axios";

export const crearPedido = async (pedido) => {
  const { data } = await apiClient.post("/pedidos", pedido);
  return data;
};

export const obtenerMisPedidos = async () => {
  const { data } = await apiClient.get("/pedidos/mis-pedidos");
  return data;
};

export const consultarSeguimiento = async (codigoPedido, codigoSeguimiento) => {
  const { data } = await apiClient.get("/pedidos/seguimiento", {
    params: { codigoPedido, codigoSeguimiento },
  });
  return data;
};


export const listarPedidos = async () => {
  const { data } = await apiClient.get("/pedidos");
  return data;
};

export const actualizarEstadoPedido = async (id, estado) => {
  const { data } = await apiClient.patch(`/pedidos/${id}/estado`, {
    estado,
  });
  return data;
};

