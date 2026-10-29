import apiClient from "../api/axios";

export const listarGabinetes = async () => {
  const { data } = await apiClient.get("/gabinetes");
  return data;
};

export const listarTamanosConfigurador = async () => {
  const { data } = await apiClient.get("/gabinetes/tamanos-configuracion");
  return data;
};

export const listarColoresConfigurador = async () => {
  const { data } = await apiClient.get("/gabinetes/colores-configuracion");
  return data;
};

export const obtenerGabinete = async (id) => {
  const { data } = await apiClient.get(`/gabinetes/${id}`);
  return data;
};

export const validarConfiguracion = async (configuracion) => {
  const { data } = await apiClient.post(
    "/gabinetes/validar-configuracion",
    configuracion,
  );
  return data;
};