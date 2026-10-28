//frontend/src/hooks/useCrudResource.js
import { useState } from "react";
import { getErrorMessage } from "../utils/errors";
import useFetch from "./useFetch";

const useCrudResource = ({
  key,
  service,
  schema,
  initialValues,
  toFormValues,
  messages,
  mapError = (error, fallback) => getErrorMessage(error, fallback),
}) => {
  const { data, loading, error: loadError, reload } = useFetch(
    key,
    service.listar,
    messages.loadError,
  );
  const [values, setValues] = useState(initialValues);
  const [editingId, setEditingId] = useState(null);
  const [actionError, setActionError] = useState("");
  const [message, setMessage] = useState("");

  const clearFeedback = () => {
    setActionError("");
    setMessage("");
  };

  const resetForm = () => {
    setValues(initialValues);
    setEditingId(null);
  };

  const onChange = (event) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const startEdit = (item) => {
    clearFeedback();
    setEditingId(item.id);
    setValues(toFormValues(item));
  };

  const cancelEdit = () => {
    clearFeedback();
    resetForm();
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    clearFeedback();

    let payload;
    try {
      payload = await schema.validate(values, { abortEarly: true });
    } catch (validationError) {
      setActionError(validationError.message);
      return false;
    }

    try {
      if (editingId) {
        await service.editar(editingId, payload);
        setMessage(messages.updated);
      } else {
        await service.crear(payload);
        setMessage(messages.created);
      }
      resetForm();
      reload();
      return true;
    } catch (error) {
      setActionError(mapError(error, messages.saveError));
      return false;
    }
  };

  const remove = async (id) => {
    clearFeedback();
    try {
      await service.eliminar(id);
      if (editingId === id) resetForm();
      setMessage(messages.deleted);
      reload();
      return true;
    } catch (error) {
      setActionError(mapError(error, messages.deleteError));
      return false;
    }
  };

  return {
    items: data ?? [],
    loading,
    error: actionError || loadError,
    message,
    values,
    editingId,
    onChange,
    onSubmit,
    startEdit,
    cancelEdit,
    remove,
  };
};

export default useCrudResource;

