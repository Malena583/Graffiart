import { useRef, useState } from "react";
import { API_URL } from "../../constants/APP";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);

const ProductImageField = ({ values, onChange, editing, error, onError }) => {
  const inputRef = useRef(null);
  const [reading, setReading] = useState(false);
  const [failedPreview, setFailedPreview] = useState("");
  const existingImage = values.imagenUrl
    ? new URL(values.imagenUrl, `${API_URL.replace(/\/$/, "")}/`).toString()
    : "";
  const preview = values.imagen || existingImage;

  const handleChange = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    if (!ACCEPTED_TYPES.has(file.type)) {
      onError("La imagen debe ser PNG, JPG o WebP.");
      return;
    }
    if (file.size > MAX_IMAGE_SIZE) {
      onError("La imagen no puede superar los 5 MB.");
      return;
    }

    onError("");
    setReading(true);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        onError("No se pudo procesar la imagen seleccionada.");
      } else {
        onChange({ target: { name: "imagen", value: reader.result } });
      }
      setReading(false);
    };
    reader.onerror = () => {
      onError("No se pudo procesar la imagen seleccionada.");
      setReading(false);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <span className="block text-left text-xs font-semibold text-neutral-700">
        Imagen del producto <span className="text-red-600">*</span>
      </span>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleChange}
        className="sr-only"
        aria-label="Seleccionar imagen del producto"
      />
      {preview && failedPreview !== preview ? (
        <div className="mt-2 flex flex-wrap items-center gap-4">
          <img
            src={preview}
            alt="Vista previa del gabinete"
            className="h-32 w-40 rounded-lg border border-neutral-200 bg-neutral-100 object-cover"
            onError={() => setFailedPreview(preview)}
          />
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-50"
          >
            {reading ? "Procesando..." : "Reemplazar imagen"}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="mt-2 rounded-lg border border-dashed border-neutral-400 px-4 py-3 text-sm font-semibold text-neutral-700 hover:bg-neutral-50"
        >
          {reading ? "Procesando..." : "Seleccionar imagen"}
        </button>
      )}
      <p className="mt-1 text-xs text-neutral-500">
        PNG, JPG o WebP. Tamaño máximo: 5 MB.
        {editing && " Si no seleccionás otra, se conserva la imagen actual."}
      </p>
      {error && (
        <p className="mt-1 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};

export default ProductImageField;
