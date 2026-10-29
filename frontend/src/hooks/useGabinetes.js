import { useCallback } from "react";
import { listarGabinetes, obtenerGabinete } from "../services/gabineteService";
import { MESSAGES } from "../constants/MESSAGES";
import useFetch from "./useFetch";

export const useGabinetes = () => {
  const { data, loading, error, reload } = useFetch(
    "gabinetes",
    listarGabinetes,
    MESSAGES.catalog.loadError,
  );
  return { gabinetes: data ?? [], loading, error, reload };
};

export const useGabinete = (id) => {
  const fetcher = useCallback(() => obtenerGabinete(id), [id]);
  const { data, loading, error } = useFetch(
    `gabinete-${id}`,
    fetcher,
    MESSAGES.detail.loadError,
  );
  return { gabinete: data, loading, error };
};
