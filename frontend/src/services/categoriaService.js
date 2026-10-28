import apiClient from "../api/axios";

export const listarCategorias = async () => {
  const { data } = await apiClient.get("/categorias");
  return data;
};

export const obtenerCategoria = async (id) => {
  const { data } = await apiClient.get(`/categorias/${id}`);
  return data;
};

export const crearCategoria = async (payload) => {
  const { data } = await apiClient.post("/categorias", payload);
  return data;
};

export const editarCategoria = async (id, payload) => {
  const { data } = await apiClient.put(`/categorias/${id}`, payload);
  return data;
};

export const eliminarCategoria = async (id) => {
  await apiClient.delete(`/categorias/${id}`);
};

export default {
  listar: listarCategorias,
  crear: crearCategoria,
  editar: editarCategoria,
  eliminar: eliminarCategoria,
};
