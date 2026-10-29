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

// Activa o desactiva un material sin eliminarlo (conserva su historial).
export const cambiarEstadoMaterial = async (id, activo) => {
  const { data } = await apiClient.patch(`/materiales/${id}/estado`, { activo });
  return data;
};

export default {
  listar: listarMateriales,
  crear: crearMaterial,
  editar: editarMaterial,
  eliminar: eliminarMaterial,
  cambiarEstado: cambiarEstadoMaterial,
};
