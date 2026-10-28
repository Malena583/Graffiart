import { useState } from "react";
import { actualizarPerfil, obtenerPerfil } from "../services/usuarioService";
import { perfilSchema } from "../schemas/entities";
import { MESSAGES } from "../constants/MESSAGES";
import { getErrorMessage } from "../utils/errors";
import useFetch from "./useFetch";

export const usePerfil = () => {
  const { data, loading, error } = useFetch(
    "perfil",
    obtenerPerfil,
    MESSAGES.profile.loadError,
  );
  return { perfil: data, loading, error };
};

export const usePerfilForm = (perfil) => {
  const [email, setEmail] = useState(perfil.email ?? "");
  const [values, setValues] = useState({
    nombre: perfil.nombre || "",
    apellido: perfil.apellido || "",
    telefono: perfil.telefono || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const onChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");
    try {
      const payload = await perfilSchema.validate(values);
      const updated = await actualizarPerfil(payload);
      setEmail(updated.email ?? email);
      setSuccess(MESSAGES.profile.saved);
    } catch (requestError) {
      setError(getErrorMessage(requestError, MESSAGES.profile.saveError));
    } finally {
      setSaving(false);
    }
  };

  return { email, values, saving, error, success, onChange, onSubmit };
};
