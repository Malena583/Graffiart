import apiClient from "../api/axios";
 
export const listarColores = async () => {
  const { data } = await apiClient.get("/colores");
  return data;
};
 
export const crearColor = async (payload) => {
  const { data } = await apiClient.post("/colores", payload);
  return data;
};
 
export const editarColor = async (id, payload) => {
  const { data } = await apiClient.put(`/colores/${id}`, payload);
  return data;
};
 
// Los colores no se eliminan: se activan o desactivan para conservar
// las referencias en diseños y pedidos existentes.
export const cambiarEstadoColor = async (id, activo) => {
  const { data } = await apiClient.patch(`/colores/${id}/estado`, { activo });
  return data;
};
 
export default {
  listar: listarColores,
  crear: crearColor,
  editar: editarColor,
  cambiarEstado: cambiarEstadoColor,
};