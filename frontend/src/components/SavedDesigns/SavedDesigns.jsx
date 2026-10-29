import { MESSAGES } from "../../constants/MESSAGES";
import useDisenos from "../../hooks/useDisenos";
import Button from "../Button/Button";
import Feedback from "../Feedback/Feedback";
import TextField from "../TextField/TextField";

const M = MESSAGES.designs;

const formatConfigSummary = (configuracion) => {
  if (!configuracion) return M.noConfig;

  const items = [];
  if (configuracion.tamanoNombre || configuracion.tamano) {
    items.push(
      `Tamaño: ${configuracion.tamanoNombre || configuracion.tamano}`,
    );
  }
  const materiales =
    configuracion.materialesNombres || configuracion.materiales;
  if (materiales) {
    items.push(
      `Material: ${Array.isArray(materiales) ? materiales.join(", ") : materiales}`,
    );
  }
  // colorNombre es el nombre legible; "color" puede ser solo el id del color.
  const color = configuracion.colorNombre || configuracion.color;
  if (color) items.push(`Color: ${color}`);
  const accesorios =
    configuracion.accesoriosNombres || configuracion.accesorios;
  if (accesorios?.length) {
    items.push(
      `Accesorios: ${Array.isArray(accesorios) ? accesorios.join(", ") : accesorios}`,
    );
  }

  return items.length ? items.join(" • ") : M.availableConfig;
};

// Una fila de la lista de diseños guardados, con sus botones.
// Props:
//   diseno: el diseño que se muestra
//   onLoad: qué hacer al tocar "Abrir"
//   onRename: qué hacer al tocar "Renombrar"
//   onDelete: qué hacer al tocar "Eliminar"
const DesignItem = ({ diseno, onLoad, onRename, onDelete }) => {
  return (
    <li className="flex flex-col justify-between gap-2 rounded-lg border border-neutral-200 bg-neutral-50 p-3 md:flex-row md:items-center">
      <div className="min-w-0 flex-1">
        <div className="font-semibold text-neutral-900">{diseno.nombre}</div>
        <div className="text-xs text-neutral-500">
          {formatConfigSummary(diseno.configuracion)}
        </div>
        <div className="mt-1 text-[11px] text-neutral-400">
          {new Date(diseno.updatedAt).toLocaleString()}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button variant="compact" onClick={() => onLoad(diseno.configuracion)}>
          {MESSAGES.actions.open}
        </Button>
        <Button variant="linkEdit" onClick={() => onRename(diseno.id, diseno.nombre)}>
          {MESSAGES.actions.rename}
        </Button>
        <Button variant="linkDelete" onClick={() => onDelete(diseno.id)}>
          {MESSAGES.actions.delete}
        </Button>
      </div>
    </li>
  );
};

// Lista de diseños guardados del usuario. Permite guardar el diseño actual, abrirlo, renombrarlo o borrarlo.
// Props:
//   seleccion: el diseño actual que se guardaría
//   onLoadDesign: qué hacer cuando el usuario abre un diseño
//   compact: si es true, oculta el formulario para guardar y muestra solo la lista
//   title: título que se muestra arriba
const SavedDesigns = ({
  seleccion = {},
  onLoadDesign,
  compact = false,
  title = M.title,
  nombreExterno,
}) => {
  const {
    disenos,
    loading,
    error,
    success,
    nombre,
    setNombre,
    saving,
    guardar,
    renombrar,
    borrar,
  } = useDisenos(seleccion);

  return (
    <section className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-neutral-900">{title}</h2>

      {error && <Feedback type="error">{error}</Feedback>}
      {success && <Feedback type="success">{success}</Feedback>}

      {!compact && nombreExterno === undefined && (
        <div className="mb-4 flex items-end gap-2">
          <div className="flex-1">
            <TextField
              id="nombre-diseno"
              label={MESSAGES.labels.name}
              value={nombre}
              onChange={(event) => setNombre(event.target.value)}
              placeholder={M.namePlaceholder}
            />
          </div>
          <div className="w-32">
            <Button
              variant="compact"
              onClick={guardar}
              disabled={saving || !nombre.trim()}
            >
              {saving ? MESSAGES.actions.saving : MESSAGES.actions.save}
            </Button>
          </div>
        </div>
      )}
      {!compact && nombreExterno !== undefined && (
        <div className="mb-4">
          <Button
            variant="compact"
            onClick={() => guardar(nombreExterno)}
            disabled={saving || !nombreExterno.trim()}
          >
            {saving ? MESSAGES.actions.saving : MESSAGES.actions.save}
          </Button>
        </div>
      )}

      {loading ? (
        <p className="text-sm text-neutral-500">{M.loading}</p>
      ) : disenos.length === 0 ? (
        <p className="text-sm text-neutral-500">{M.empty}</p>
      ) : (
        <ul className="space-y-3">
          {disenos.map((diseno) => (
            <DesignItem
              key={diseno.id}
              diseno={diseno}
              onLoad={onLoadDesign}
              onRename={renombrar}
              onDelete={borrar}
            />
          ))}
        </ul>
      )}
    </section>
  );
};

export default SavedDesigns;