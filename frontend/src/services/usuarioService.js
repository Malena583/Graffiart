import apiClient from "../api/axios";

export const obtenerPerfil = async () => {
  const { data } = await apiClient.get("/usuarios/perfil");
  return data;
};

export const actualizarPerfil = async (payload) => {
  const { data } = await apiClient.put("/usuarios/perfil", payload);
  return data;
};
