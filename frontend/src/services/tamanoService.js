import apiClient from "../api/axios";

export const listarTamanos = async () => {
  const { data } = await apiClient.get("/tamanos");
  return data;
};

export const crearTamano = async (payload) => {
  const { data } = await apiClient.post("/tamanos", payload);
  return data;
};

// El identificador de un tamaño es su código.
export const editarTamano = async (codigo, payload) => {
  const { data } = await apiClient.put(
    `/tamanos/${encodeURIComponent(codigo)}`,
    payload,
  );
  return data;
};

export const eliminarTamano = async (codigo) => {
  await apiClient.delete(`/tamanos/${encodeURIComponent(codigo)}`);
};

export default {
  listar: listarTamanos,
  crear: crearTamano,
  editar: editarTamano,
  eliminar: eliminarTamano,
};