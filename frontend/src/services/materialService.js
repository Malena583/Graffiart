import apiClient from "../api/axios";

export const listarMateriales = async () => {
  const { data } = await apiClient.get("/materiales");
  return data;
};

export const obtenerMaterial = async (id) => {
  const { data } = await apiClient.get(`/materiales/${id}`);
  return data;
};

export const crearMaterial = async (payload) => {
  const { data } = await apiClient.post("/materiales", payload);
  return data;
};

export const editarMaterial = async (id, payload) => {
  const { data } = await apiClient.put(`/materiales/${id}`, payload);
  return data;
};

export const eliminarMaterial = async (id) => {
  await apiClient.delete(`/materiales/${id}`);
};

export default {
  listar: listarMateriales,
  crear: crearMaterial,
  editar: editarMaterial,
  eliminar: eliminarMaterial,
};
