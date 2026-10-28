import Button from "../Button/Button";
import TextField from "../TextField/TextField";
import { MESSAGES } from "../../constants/MESSAGES";

// Formulario que se arma solo a partir de una lista de campos. Se usa para crear o editar cosas (categorías, productos, materiales, perfil).
// Props:
//   title: título del formulario
//   fields: lista de campos a mostrar (name, label, type, options, half)
//   values: valores actuales de cada campo
//   onChange: se ejecuta cuando el usuario escribe o elige algo
//   onSubmit: se ejecuta al enviar el formulario
//   onCancel: qué hacer al tocar "Cancelar" (solo aparece al editar)
//   editing: true si se está editando algo existente
//   submitLabel: texto del botón al crear
//   editLabel: texto del botón al editar
//   submitting: true mientras se guarda (desactiva el botón)
//   columns: 1 para una columna, 2 para dos columnas
const EntityForm = ({
  title,
  fields,
  values,
  onChange,
  onSubmit,
  onCancel,
  editing = false,
  submitLabel,
  editLabel,
  submitting = false,
  columns = 2,
}) => {
  const gridClass = columns === 1 ? "grid-cols-1" : "grid-cols-1 sm:grid-cols-2";

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-5 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm"
    >
      {title && <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>}

      <div className={`grid gap-4 ${gridClass}`}>
        {fields.map(({ half, render, ...field }) => (
          <div key={field.name} className={half || columns === 1 ? "" : "sm:col-span-2"}>
            {render ? (
              render({ values, onChange })
            ) : (
              <TextField
                id={field.name}
                value={values[field.name] ?? ""}
                onChange={onChange}
                {...field}
              />
            )}
          </div>
        ))}
      </div>

      <div className="flex gap-3">
        <div className="flex-1">
          <Button type="submit" variant="compact" disabled={submitting}>
            {editing ? editLabel : submitLabel}
          </Button>
        </div>
        {editing && onCancel && (
          <Button variant="secondary" onClick={onCancel}>
            {MESSAGES.actions.cancel}
          </Button>
        )}
      </div>
    </form>
  );
};

export default EntityForm;
