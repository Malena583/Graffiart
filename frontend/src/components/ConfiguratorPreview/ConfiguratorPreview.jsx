import { CONFIGURATOR_TEXTS } from "../../constants/CONFIGURATOR";

const SIZE_SCALE = {
  MINI_TOWER: 0.78,
  MID_TOWER: 0.9,
  FULL_TOWER: 1,
};

const DEFAULT_SHELL = "#303030";
const DEFAULT_PANEL = "#303030";

const ConfiguratorPreview = ({
  seleccion,
  categorias,
  imagen,
  onReplaceImage,
}) => {
  const tamano = categorias
    .find((categoria) => categoria.id === "tamano")
    ?.opciones.find((opcion) => opcion.id === seleccion.tamano);
  // El color viene de las opciones activas; si el color elegido ya no está
  // activo (por ejemplo, en un diseño guardado) se usa el que se guardó.
  const colorOption = categorias
    .find((categoria) => categoria.id === "color")
    ?.opciones.find((opcion) => opcion.id === seleccion.color);
  const colorHex = colorOption?.hex ?? (seleccion.color ? seleccion.colorHex : "");
  const colorNombre =
    colorOption?.label ?? (seleccion.color ? seleccion.colorNombre : "");
  const scale = SIZE_SCALE[tamano?.tamano] ?? 1;
  const widthLabel = tamano
    ? `${CONFIGURATOR_TEXTS.width}: ${tamano.anchoMinCm}–${tamano.anchoMaxCm} cm`
    : CONFIGURATOR_TEXTS.dimensionsMissing;
  const heightLabel = tamano
    ? `${CONFIGURATOR_TEXTS.height}: ${tamano.altoMinCm}–${tamano.altoMaxCm} cm`
    : CONFIGURATOR_TEXTS.dimensionsMissing;
  const depthLabel = tamano
    ? `${CONFIGURATOR_TEXTS.depth}: ${tamano.profundidadMinCm}–${tamano.profundidadMaxCm} cm`
    : `${CONFIGURATOR_TEXTS.depth}: ${CONFIGURATOR_TEXTS.dimensionsMissing}`;

  return (
    <section className="flex min-h-[520px] flex-1 flex-col items-center justify-center rounded-xl border border-neutral-200 bg-white p-6">
      <p className="mb-2 text-center text-xs text-neutral-500">
        ↔ {widthLabel}
      </p>
      <div className="flex items-center gap-2">
        <span
          className="text-xs text-neutral-500"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          ↕ {heightLabel}
        </span>
        <div
          className="relative my-4 transition-transform duration-300"
          style={{ transform: `scale(${scale})` }}
        >
          <svg
            viewBox="0 0 260 420"
            width="260"
            role="img"
            aria-label={tamano?.label || CONFIGURATOR_TEXTS.previewEmpty}
            xmlns="http://www.w3.org/2000/svg"
          >
          <defs>
            <clipPath id="case-panel-clip">
              <rect x="88" y="50" width="120" height="315" rx="4" />
            </clipPath>
          </defs>
          <rect
            x="20"
            y="10"
            width="220"
            height="400"
            rx="10"
            fill={colorHex || DEFAULT_SHELL}
            stroke="#525252"
            strokeWidth="2"
            style={{ transition: "fill 300ms" }}
          />
          <rect
            x="35"
            y="28"
            width="190"
            height="360"
            rx="5"
            fill="#242424"
            stroke="#737373"
            strokeWidth="1"
          />
          <rect x="45" y="48" width="30" height="8" rx="4" fill="#525252" />
          <circle cx="60" cy="78" r="5" fill="#737373" />
          <rect
            x="88"
            y="50"
            width="120"
            height="315"
            rx="4"
            fill={colorHex || DEFAULT_PANEL}
            fillOpacity={colorHex ? 0.35 : 1}
            stroke="#737373"
            strokeWidth="1"
            style={{ transition: "fill 300ms" }}
          />
          {imagen && (
            <image
              href={imagen}
              x="88"
              y="50"
              width="120"
              height="315"
              preserveAspectRatio="xMidYMid slice"
              clipPath="url(#case-panel-clip)"
            />
          )}
          <path d="M100 80h96M100 92h96M100 104h96" stroke="#525252" />
          <text
            x="148"
            y="345"
            textAnchor="middle"
            fontSize="9"
            fill="#a3a3a3"
            fontFamily="system-ui"
            fontWeight="bold"
            letterSpacing="2"
          >
            GraffiArt
          </text>
          </svg>
        </div>
      </div>
      {tamano && (
        <p className="mt-4 text-center text-sm font-medium text-neutral-800">
          {tamano.label}
        </p>
      )}
      <p className="mt-1 text-center text-xs text-neutral-500">{depthLabel}</p>
      {colorHex && (
        <p className="mt-1 flex items-center justify-center gap-2 text-xs text-neutral-500">
          <span
            aria-hidden="true"
            className="inline-block h-3 w-3 rounded-full border border-neutral-400"
            style={{ backgroundColor: colorHex }}
          />
          {CONFIGURATOR_TEXTS.colorLabel}: {colorNombre || colorHex}
        </p>
      )}
      {imagen && (
        <button
          type="button"
          onClick={onReplaceImage}
          className="mt-3 rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-50"
        >
          {CONFIGURATOR_TEXTS.replaceImage}
        </button>
      )}
    </section>
  );
};

export default ConfiguratorPreview;
