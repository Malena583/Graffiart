import { ChevronDown } from "lucide-react";
import { CONFIGURATOR_TEXTS } from "../../constants/CONFIGURATOR";

const CategorySection = ({ categoria, seleccion, onSeleccionar }) => {
  const multiple = categoria.tipo === "multiple";
  const selectedIds = multiple
    ? Array.isArray(seleccion[categoria.id])
      ? seleccion[categoria.id]
      : []
    : [seleccion[categoria.id]].filter(Boolean);

  return (
    <details className="group border-b border-neutral-200 last:border-none">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-4 text-sm font-semibold text-neutral-900 [&::-webkit-details-marker]:hidden">
        {categoria.titulo}
        <ChevronDown
          size={16}
          className="shrink-0 transition-transform group-open:rotate-180"
          aria-hidden="true"
        />
      </summary>
      <div className="space-y-3 pb-4">
        {categoria.opciones.length === 0 ? (
          <p className="text-sm text-neutral-500">{categoria.mensajeVacio}</p>
        ) : (
          categoria.opciones.map((opcion) => {
            const selected = selectedIds.includes(opcion.id);
            return (
              <div key={opcion.id} className="rounded-lg">
                <button
                  type="button"
                  disabled={!opcion.disponible}
                  aria-pressed={selected}
                  onClick={() =>
                    onSeleccionar(categoria.id, opcion.id, multiple)
                  }
                  className={`w-full rounded-lg border px-3 py-2 text-left text-sm transition-colors ${
                    !opcion.disponible
                      ? "cursor-not-allowed border-neutral-200 bg-neutral-100 text-neutral-400"
                      : selected
                        ? "border-neutral-900 bg-neutral-900 text-white"
                        : "border-neutral-300 bg-white text-neutral-700 hover:border-neutral-500"
                  }`}
                >
                  <span className="block font-medium">{opcion.label}</span>
                  {opcion.descripcion && (
                    <span className="mt-1 block text-xs opacity-75">
                      {opcion.descripcion}
                    </span>
                  )}
                  <span
                    className={`mt-1 block text-xs ${
                      opcion.disponible
                        ? selected
                          ? "text-neutral-300"
                          : "text-neutral-500"
                        : "text-red-600"
                    }`}
                  >
                    {opcion.estado}
                  </span>
                </button>
              </div>
            );
          })
        )}
      </div>
    </details>
  );
};

const ConfiguratorOptions = ({
  categorias,
  seleccion,
  onSeleccionar,
  nombreDiseno,
  onNombreDisenoChange,
  loading,
  error,
}) => (
  <aside className="w-full rounded-xl border border-neutral-200 bg-white p-5">
    <h2 className="mb-1 text-base font-semibold text-neutral-900">
      {CONFIGURATOR_TEXTS.optionsTitle}
    </h2>
    <p className="mb-2 text-xs text-neutral-500">
      {CONFIGURATOR_TEXTS.optionsSubtitle}
    </p>
    {loading ? (
      <p className="py-4 text-sm text-neutral-500" role="status">
        {CONFIGURATOR_TEXTS.loading}
      </p>
    ) : error ? (
      <p className="py-4 text-sm text-red-700" role="alert">
        {error}
      </p>
    ) : (
      <>
        {categorias.map((categoria) => (
          <CategorySection
            key={categoria.id}
            categoria={categoria}
            seleccion={seleccion}
            onSeleccionar={onSeleccionar}
          />
        ))}
        <details className="group">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 py-4 text-sm font-semibold text-neutral-900 [&::-webkit-details-marker]:hidden">
            {CONFIGURATOR_TEXTS.designName}
            <ChevronDown
              size={16}
              className="shrink-0 transition-transform group-open:rotate-180"
              aria-hidden="true"
            />
          </summary>
          <label
            className="block pb-4 text-xs font-medium text-neutral-700"
            htmlFor="configurator-design-name"
          >
            {CONFIGURATOR_TEXTS.designName}
            <input
              id="configurator-design-name"
              type="text"
              value={nombreDiseno}
              onChange={(event) => onNombreDisenoChange(event.target.value)}
              maxLength={120}
              placeholder={CONFIGURATOR_TEXTS.designNamePlaceholder}
              className="mt-1 w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900 focus:ring-1 focus:ring-neutral-900"
            />
          </label>
        </details>
      </>
    )}
  </aside>
);

export default ConfiguratorOptions;
