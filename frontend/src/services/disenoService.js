import apiClient from "../api/axios";

export const listarDisenos = async () => {
  const { data } = await apiClient.get("/disenos");
  return data;
};

export const crearDiseno = async (payload) => {
  const { data } = await apiClient.post("/disenos", payload);
  return data;
};

export const actualizarDiseno = async (id, payload) => {
  const { data } = await apiClient.put(`/disenos/${id}`, payload);
  return data;
};

export const eliminarDiseno = async (id) => {
  await apiClient.delete(`/disenos/${id}`);
};
