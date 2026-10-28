import { useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import ConfiguratorOptions from "../../components/ConfiguratorOptions/ConfiguratorOptions";
import ConfiguratorPreview from "../../components/ConfiguratorPreview/ConfiguratorPreview";
import ConfiguratorSummary from "../../components/ConfiguratorSummary/ConfiguratorSummary";
import Feedback from "../../components/Feedback/Feedback";
import MainContainer from "../../components/MainContainer/MainContainer";
import SavedDesigns from "../../components/SavedDesigns/SavedDesigns";
import { CONFIGURATOR_TEXTS } from "../../constants/CONFIGURATOR";
import { ROUTES } from "../../constants/ROUTES";
import { useAuthStore } from "../../store/authStore";
import { useCartStore } from "../../store/cartStore";
import { formatPrice } from "../../utils/format";
import { listarMateriales } from "../../services/materialService";
import {
  listarTamanosConfigurador,
  validarConfiguracion,
} from "../../services/gabineteService";
import useFetch from "../../hooks/useFetch";
import useConfigurador from "../../hooks/useConfigurador";

const ACCEPTED_IMAGE_TYPES = new Set(["image/png", "image/jpeg", "image/webp"]);
const STEPS = [
  CONFIGURATOR_TEXTS.stepUpload,
  CONFIGURATOR_TEXTS.stepOptions,
  CONFIGURATOR_TEXTS.stepConfirm,
];

const getSelectedIds = (value) =>
  Array.isArray(value) ? value : value ? [value] : [];

const Configurator = () => {
  const { seleccion, seleccionar, cargarDiseno } = useConfigurador();
  const usuario = useAuthStore((state) => state.usuario);
  const agregarConfiguracion = useCartStore((state) => state.agregarConfiguracion);
  const imageInput = useRef(null);
  const [step, setStep] = useState(1);
  const [imagen, setImagen] = useState("");
  const [imageError, setImageError] = useState("");
  const [adding, setAdding] = useState(false);
  const [actionError, setActionError] = useState("");
  const [success, setSuccess] = useState("");
  const {
    data: tamanos,
    loading: tamanosLoading,
    error: tamanosError,
    reload: reloadTamanos,
  } = useFetch(
    "configurator-sizes",
    listarTamanosConfigurador,
    CONFIGURATOR_TEXTS.loadError,
  );
  const {
    data: materiales,
    loading: materialesLoading,
    error: materialesError,
    reload: reloadMateriales,
  } = useFetch(
    "configurator-materials",
    listarMateriales,
    CONFIGURATOR_TEXTS.loadError,
  );
  const loading = tamanosLoading || materialesLoading;
  const loadError = tamanosError || materialesError;
  const nombreDiseno = seleccion.nombreDiseno ?? "";

  const categories = useMemo(() => {
    const sizeOptions = (tamanos ?? []).map((tamano) => ({
      id: tamano.codigo,
      label: tamano.nombre,
      descripcion: CONFIGURATOR_TEXTS.approximateDimensions(
        tamano.altoMinCm,
        tamano.altoMaxCm,
        tamano.anchoMinCm,
        tamano.anchoMaxCm,
        tamano.profundidadMinCm,
        tamano.profundidadMaxCm,
      ),
      precio: Number(tamano.precioBase),
      tamano: tamano.codigo,
      altoMinCm: tamano.altoMinCm,
      altoMaxCm: tamano.altoMaxCm,
      anchoMinCm: tamano.anchoMinCm,
      anchoMaxCm: tamano.anchoMaxCm,
      profundidadMinCm: tamano.profundidadMinCm,
      profundidadMaxCm: tamano.profundidadMaxCm,
      disponible: tamano.activo,
      estado: formatPrice(tamano.precioBase),
    }));
    const inventory = materiales ?? [];
    const toInventoryOption = (material) => {
      const stock = Number(material.stockActual);
      const hasPrice = material.costoUnitario != null;
      const available = material.activo && stock > 0 && hasPrice;
      const status = !material.activo
        ? CONFIGURATOR_TEXTS.inactive
        : stock < 1
          ? CONFIGURATOR_TEXTS.unavailable
          : !hasPrice
            ? CONFIGURATOR_TEXTS.noPrice
            : `${CONFIGURATOR_TEXTS.availableStock(stock)} · ${formatPrice(material.costoUnitario)}`;
      return {
        id: material.id,
        label: material.nombre,
        descripcion: `${material.categoria} · ${material.unidadMedida}`,
        precio: hasPrice ? Number(material.costoUnitario) : 0,
        disponible: available,
        estado: status,
      };
    };
    const materials = inventory.filter(
      (material) => material.categoria !== "ACCESORIO",
    );
    const accessories = inventory.filter(
      (material) => material.categoria === "ACCESORIO",
    );

    return [
      {
        id: "tamano",
        titulo: "Tamaño",
        tipo: "simple",
        opciones: sizeOptions,
        mensajeVacio: CONFIGURATOR_TEXTS.noBaseOptions,
      },
      {
        id: "materiales",
        titulo: "Material",
        tipo: "multiple",
        opciones: materials.map(toInventoryOption),
        mensajeVacio: CONFIGURATOR_TEXTS.noMaterialOptions,
      },
      {
        id: "color",
        titulo: "Color",
        tipo: "simple",
        opciones: [],
        mensajeVacio: CONFIGURATOR_TEXTS.noColorOptions,
      },
      {
        id: "accesorios",
        titulo: "Accesorios",
        tipo: "multiple",
        opciones: accessories.map(toInventoryOption),
        mensajeVacio: CONFIGURATOR_TEXTS.noAccessoryOptions,
      },
    ];
  }, [tamanos, materiales]);

  const sizeOptions =
    categories.find((category) => category.id === "tamano")?.opciones ?? [];
  const materialOptions =
    categories.find((category) => category.id === "materiales")?.opciones ?? [];
  const accessoryOptions =
    categories.find((category) => category.id === "accesorios")?.opciones ?? [];
  const selectedSize = tamanos?.find(
    (tamano) => tamano.codigo === seleccion.tamano,
  );
  const selectedMaterialIds = getSelectedIds(seleccion.materiales);
  const selectedAccessoryIds = getSelectedIds(seleccion.accesorios);
  const selectedMaterials = selectedMaterialIds
    .map((id) => materialOptions.find((option) => option.id === id))
    .filter(Boolean);
  const selectedAccessories = selectedAccessoryIds
    .map((id) => accessoryOptions.find((option) => option.id === id))
    .filter(Boolean);
  const savedConfiguration = {
    ...seleccion,
    tamano: seleccion.tamano,
    tamanoNombre: selectedSize?.nombre ?? "",
    materialesNombres: selectedMaterials.map((option) => option.label),
    accesoriosNombres: selectedAccessories.map((option) => option.label),
  };
  const total = [
    ...sizeOptions.filter((option) => option.id === seleccion.tamano),
    ...selectedMaterials,
    ...selectedAccessories,
  ].reduce((sum, option) => sum + option.precio, 0);
  const canAdd = Boolean(
    !loading &&
      !loadError &&
      nombreDiseno.trim() &&
      sizeOptions.find((option) => option.id === seleccion.tamano)?.disponible &&
      selectedMaterials.length === selectedMaterialIds.length &&
      selectedMaterials.length > 0 &&
      selectedMaterials.every((option) => option.disponible) &&
      selectedAccessories.length === selectedAccessoryIds.length &&
      selectedAccessories.every((option) => option.disponible),
  );

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setImageError("");
    if (!ACCEPTED_IMAGE_TYPES.has(file.type)) {
      setImageError(CONFIGURATOR_TEXTS.invalidImage);
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        setImageError(CONFIGURATOR_TEXTS.imageReadError);
        return;
      }
      const previewImage = new Image();
      previewImage.onload = () => {
        setImagen(reader.result);
        if (step === 1) setStep(2);
      };
      previewImage.onerror = () =>
        setImageError(CONFIGURATOR_TEXTS.imageReadError);
      previewImage.src = reader.result;
    };
    reader.onerror = () => setImageError(CONFIGURATOR_TEXTS.imageReadError);
    reader.readAsDataURL(file);
  };

  const handleAddToCart = async () => {
    if (!canAdd || !selectedSize) return;
    setAdding(true);
    setActionError("");
    setSuccess("");
    const disponibilidadPayload = {
      tamanoId: selectedSize.codigo,
      materialIds: selectedMaterialIds,
      accesorioIds: selectedAccessoryIds,
    };

    try {
      const availability = await validarConfiguracion(disponibilidadPayload);
      if (
        Math.round(Number(availability.total) * 100) !==
        Math.round(total * 100)
      ) {
        setActionError(
          CONFIGURATOR_TEXTS.priceChanged(
            formatPrice(availability.total),
            formatPrice(total),
          ),
        );
        reloadTamanos();
        reloadMateriales();
        return;
      }

      const configuracion = {
        ...disponibilidadPayload,
        tamano: selectedSize.codigo,
        tamanoNombre: selectedSize.nombre,
        materiales: selectedMaterials.map((option) => option.label),
        accesorios: selectedAccessories.map((option) => option.label),
        nombreDiseno: nombreDiseno.trim(),
        imagen,
      };

      const resumen = [
        `${CONFIGURATOR_TEXTS.sizeLabel}: ${selectedSize.nombre}`,
        ...selectedMaterials.map((option) => `${CONFIGURATOR_TEXTS.materialLabel}: ${option.label}`),
        ...selectedAccessories.map((option) => `${CONFIGURATOR_TEXTS.accessoriesLabel}: ${option.label}`),
      ].join("\n");
      agregarConfiguracion(
        { id: selectedSize.codigo, nombre: nombreDiseno.trim(), tamano: selectedSize.codigo },
        { ...configuracion, resumen },
        availability.total,
      );
      setSuccess(CONFIGURATOR_TEXTS.added);
    } catch (error) {
      const unavailable = error.response?.data?.noDisponibles
        ?.map((option) => `${option.nombre}: ${option.motivo}`)
        .join(" ");
      setActionError(
        unavailable ||
          error.response?.data?.error ||
          CONFIGURATOR_TEXTS.availabilityError,
      );
      reloadTamanos();
      reloadMateriales();
    } finally {
      setAdding(false);
    }
  };

  const handleLoadDesign = (configuracion) => {
    cargarDiseno(configuracion);
    setImagen("");
    setActionError("");
    setSuccess("");
  };

  const renderOptions = () => (
    <ConfiguratorOptions
      categorias={categories}
      seleccion={seleccion}
      onSeleccionar={(...args) => {
        setActionError("");
        setSuccess("");
        seleccionar(...args);
      }}
      nombreDiseno={nombreDiseno}
      onNombreDisenoChange={(value) => {
        setActionError("");
        setSuccess("");
        seleccionar("nombreDiseno", value, false);
      }}
      loading={loading}
      error={loadError}
    />
  );

  return (
    <MainContainer
      title="Configurador de gabinetes"
      subtitle={CONFIGURATOR_TEXTS.optionsSubtitle}
      width="xl"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <ol
          aria-label={CONFIGURATOR_TEXTS.progress}
          className="flex flex-1 flex-wrap items-center gap-2"
        >
          {STEPS.map((label, index) => {
            const number = index + 1;
            const active = step === number;
            const complete = step > number;
            return (
              <li
                key={label}
                aria-current={active ? "step" : undefined}
                className={`flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold sm:text-sm ${
                  active
                    ? "bg-neutral-900 text-white"
                    : complete
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-white text-neutral-500"
                }`}
              >
                <span>{complete ? "✓" : number}</span>
                <span>{label}</span>
              </li>
            );
          })}
        </ol>
        <Link
          to={ROUTES.home}
          className="rounded-lg px-3 py-2 text-sm font-semibold text-neutral-700 hover:bg-white"
        >
          {CONFIGURATOR_TEXTS.backHome}
        </Link>
      </div>

      {imageError && <Feedback type="error">{imageError}</Feedback>}
      {step === 3 && loadError && <Feedback type="error">{loadError}</Feedback>}
      <input
        ref={imageInput}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={handleImageChange}
        className="hidden"
        aria-label={CONFIGURATOR_TEXTS.uploadImage}
      />

      {step === 1 && (
        <section className="grid gap-6 rounded-xl border border-neutral-200 bg-white p-6 md:grid-cols-2 md:items-center">
          <div>
            <h2 className="text-xl font-semibold text-neutral-900">
              {CONFIGURATOR_TEXTS.stepUpload}
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              {CONFIGURATOR_TEXTS.uploadHint}
            </p>
            <button
              type="button"
              onClick={() => imageInput.current?.click()}
              className="mt-5 rounded-lg bg-neutral-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-neutral-700"
            >
              {CONFIGURATOR_TEXTS.selectFile}
            </button>
            <button
              type="button"
              onClick={() => setStep(2)}
              className="ml-3 mt-5 rounded-lg border border-neutral-300 px-4 py-3 text-sm font-semibold text-neutral-800 transition hover:bg-neutral-50"
            >
              {CONFIGURATOR_TEXTS.skipImage}
            </button>
          </div>
          {imagen ? (
            <img
              src={imagen}
              alt={CONFIGURATOR_TEXTS.uploadedImage}
              className="max-h-80 w-full rounded-lg object-contain"
            />
          ) : (
            <ConfiguratorPreview
              seleccion={savedConfiguration}
              categorias={categories}
              imagen=""
            />
          )}
        </section>
      )}

      {step === 2 && (
        <>
          {imagen ? (
            <div className="grid gap-6 pb-28 lg:grid-cols-[minmax(0,1fr)_380px]">
              <ConfiguratorPreview
                seleccion={savedConfiguration}
                categorias={categories}
                imagen={imagen}
                onReplaceImage={() => imageInput.current?.click()}
              />
              <div className="max-h-[calc(100vh-12rem)] overflow-y-auto rounded-xl">
                {renderOptions()}
                {usuario && (
                  <div className="mt-5">
                    <SavedDesigns
                      seleccion={savedConfiguration}
                      onLoadDesign={handleLoadDesign}
                      nombreExterno={nombreDiseno}
                    />
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-6 pb-28">
              <ConfiguratorPreview
                seleccion={seleccion}
                categorias={categories}
                imagen=""
              />
              {renderOptions()}
              {usuario && (
                <SavedDesigns
                  seleccion={savedConfiguration}
                  onLoadDesign={handleLoadDesign}
                  nombreExterno={nombreDiseno}
                />
              )}
            </div>
          )}
          <div className="mb-3 flex justify-between">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-800 hover:bg-white"
            >
              {CONFIGURATOR_TEXTS.back}
            </button>
          </div>
          {loadError && <Feedback type="error">{loadError}</Feedback>}
        </>
      )}

      {step === 3 && (
        <section className="grid gap-6 pb-28 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <ConfiguratorPreview
            seleccion={savedConfiguration}
            categorias={categories}
            imagen={imagen}
            onReplaceImage={() => imageInput.current?.click()}
          />
          <div className="rounded-xl border border-neutral-200 bg-white p-6">
            <h2 className="mb-5 text-lg font-semibold text-neutral-900">
              {CONFIGURATOR_TEXTS.reviewTitle}
            </h2>
            <dl className="space-y-4 text-sm">
              <div>
                <dt className="font-medium text-neutral-500">
                  {CONFIGURATOR_TEXTS.designName}
                </dt>
                <dd className="mt-1 text-neutral-900">{nombreDiseno}</dd>
              </div>
              <div>
                <dt className="font-medium text-neutral-500">
                  {CONFIGURATOR_TEXTS.sizeLabel}
                </dt>
                <dd className="mt-1 text-neutral-900">
                  {selectedSize
                    ? selectedSize.nombre
                    : CONFIGURATOR_TEXTS.noSelection}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-neutral-500">
                  {CONFIGURATOR_TEXTS.materialLabel}
                </dt>
                <dd className="mt-1 text-neutral-900">
                  {selectedMaterials.length
                    ? selectedMaterials.map((option) => option.label).join(", ")
                    : CONFIGURATOR_TEXTS.noSelection}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-neutral-500">
                  {CONFIGURATOR_TEXTS.colorLabel}
                </dt>
                <dd className="mt-1 text-neutral-900">
                  {CONFIGURATOR_TEXTS.noColorOptions}
                </dd>
              </div>
              <div>
                <dt className="font-medium text-neutral-500">
                  {CONFIGURATOR_TEXTS.accessoriesLabel}
                </dt>
                <dd className="mt-1 text-neutral-900">
                  {selectedAccessories.length
                    ? selectedAccessories.map((option) => option.label).join(", ")
                    : CONFIGURATOR_TEXTS.noExtras}
                </dd>
              </div>
              <div className="border-t border-neutral-200 pt-4">
                <dt className="font-medium text-neutral-500">
                  {CONFIGURATOR_TEXTS.estimatedPrice}
                </dt>
                <dd className="mt-1 text-xl font-semibold text-neutral-900">
                  {formatPrice(total)}
                </dd>
              </div>
            </dl>
            {usuario && (
              <div className="mt-5 border-t border-neutral-200 pt-5">
                <SavedDesigns
                  compact
                  seleccion={savedConfiguration}
                  onLoadDesign={handleLoadDesign}
                  title={CONFIGURATOR_TEXTS.savedDesigns}
                />
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => setStep(2)}
            className="w-fit rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-800 hover:bg-white"
          >
            {CONFIGURATOR_TEXTS.back}
          </button>
        </section>
      )}

      {step === 2 && (
        <ConfiguratorSummary
          total={total}
          loading={loading || Boolean(loadError)}
          adding={adding}
          error={
            actionError ||
            (!loading && !loadError && !canAdd
              ? CONFIGURATOR_TEXTS.configurationRequired
              : "")
          }
          success={success}
          canAdd={canAdd}
          step={step}
          onContinue={() => {
            setActionError("");
            setSuccess("");
            setStep(3);
          }}
          onAdd={handleAddToCart}
        />
      )}
      {step === 3 && (
        <ConfiguratorSummary
          total={total}
          loading={loading || Boolean(loadError)}
          adding={adding}
          error={
            actionError ||
            (!loading && !loadError && !canAdd
              ? CONFIGURATOR_TEXTS.configurationRequired
              : "")
          }
          success={success}
          canAdd={canAdd}
          step={step}
          onAdd={handleAddToCart}
        />
      )}
    </MainContainer>
  );
};

export default Configurator;
