import apiClient from "../api/axios";

const listarMovimientos = async () => {
  const { data } = await apiClient.get("/inventario/movimientos");
  return data;
};

const crearMovimiento = async (payload) => {
  const { data } = await apiClient.post("/inventario/movimientos", payload);
  return data;
};

export default {
  listar: listarMovimientos,
  crear: crearMovimiento,
};