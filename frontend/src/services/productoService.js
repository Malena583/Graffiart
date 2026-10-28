import apiClient from "../api/axios";

export const listarProductos = async () => {
  const { data } = await apiClient.get("/productos");
  return data;
};

export const obtenerProducto = async (id) => {
  const { data } = await apiClient.get(`/productos/${id}`);
  return data;
};

export const crearProducto = async (payload) => {
  const { data } = await apiClient.post("/productos", payload);
  return data;
};

export const editarProducto = async (id, payload) => {
  const { data } = await apiClient.put(`/productos/${id}`, payload);
  return data;
};

export const eliminarProducto = async (id) => {
  await apiClient.delete(`/productos/${id}`);
};

export default {
  listar: listarProductos,
  crear: crearProducto,
  editar: editarProducto,
  eliminar: eliminarProducto,
};
