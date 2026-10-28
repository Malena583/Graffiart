import { useState } from "react";
import {
  actualizarDiseno,
  crearDiseno,
  eliminarDiseno,
  listarDisenos,
} from "../services/disenoService";
import { disenoNombreSchema } from "../schemas/entities";
import { MESSAGES } from "../constants/MESSAGES";
import { getErrorMessage } from "../utils/errors";
import useFetch from "./useFetch";

const M = MESSAGES.designs;

const useDisenos = (seleccion) => {
  const { data, loading, error: loadError, reload } = useFetch(
    "disenos",
    listarDisenos,
    M.loadError,
  );
  const [nombre, setNombre] = useState("");
  const [saving, setSaving] = useState(false);
  const [actionError, setActionError] = useState("");
  const [success, setSuccess] = useState("");

  const run = async (action, successMessage, errorMessage) => {
    setActionError("");
    setSuccess("");
    try {
      await action();
      setSuccess(successMessage);
      reload();
      return true;
    } catch (error) {
      setActionError(getErrorMessage(error, errorMessage));
      return false;
    }
  };

  const guardar = async (nombreDiseño = nombre) => {
    if (!nombreDiseño.trim()) return;
    setSaving(true);
    const ok = await run(
      async () => {
        const validName = await disenoNombreSchema.validate(nombreDiseño);
        await crearDiseno({
          nombre: validName,
          descripcion: M.defaultDescription,
          configuracion: seleccion,
        });
      },
      M.saved,
      M.saveError,
    );
    if (ok) setNombre("");
    setSaving(false);
  };

  const renombrar = (id, currentName) => {
    const nextName = window.prompt(M.newName, currentName);
    if (!nextName || !nextName.trim()) return;
    return run(
      () => actualizarDiseno(id, { nombre: nextName.trim() }),
      M.renamed,
      M.renameError,
    );
  };

  const borrar = (id) => {
    if (!window.confirm(MESSAGES.confirmDelete("este diseño"))) return;
    return run(() => eliminarDiseno(id), M.deleted, M.deleteError);
  };

  return {
    disenos: data ?? [],
    loading,
    error: actionError || loadError,
    success,
    nombre,
    setNombre,
    saving,
    guardar,
    renombrar,
    borrar,
  };
};

export default useDisenos;
