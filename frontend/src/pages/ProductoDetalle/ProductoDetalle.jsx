import { Link, useNavigate, useParams } from "react-router";
import { useState } from "react";
import Button from "../../components/Button/Button";
import MainContainer from "../../components/MainContainer/MainContainer";
import StateMessage from "../../components/StateMessage/StateMessage";
import { FORMATOS, PANELES, SPEC_LABELS, TAMANOS } from "../../constants/CATALOGO";
import { MESSAGES } from "../../constants/MESSAGES";
import useTemporaryFlag from "../../hooks/useTemporaryFlag";
import { useGabinete } from "../../hooks/useGabinetes";
import { useCartStore } from "../../store/cartStore";
import { formatPrice } from "../../utils/format";
import { ROUTES } from "../../constants/ROUTES";
import { productoImageUrl } from "../../utils/gabinete";

const M = MESSAGES.detail;

// Página con el detalle de un producto y botón para agregarlo al carrito.
const ProductoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { gabinete, loading, error } = useGabinete(id);
  const [failedImage, setFailedImage] = useState("");
  const imageUrl = gabinete?.imagenUrl
    ? productoImageUrl(gabinete.imagenUrl)
    : "";
  const imageFailed = failedImage === imageUrl;
  const agregarAlCarrito = useCartStore((state) => state.agregarAlCarrito);
  const [added, markAdded] = useTemporaryFlag();

  if (loading) {
    return (
      <MainContainer width="md">
        <StateMessage>{MESSAGES.loading}</StateMessage>
      </MainContainer>
    );
  }

  if (!gabinete) {
    return (
      <MainContainer width="md">
        <StateMessage
          title={M.notFound}
          action={
            <Link
              to={ROUTES.products}
              className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-semibold text-white"
            >
              {M.backToCatalog}
            </Link>
          }
        >
          {error}
        </StateMessage>
      </MainContainer>
    );
  }

  const specs = [
    [SPEC_LABELS.format, FORMATOS[gabinete.formato] ?? gabinete.formato],
    [SPEC_LABELS.size, TAMANOS[gabinete.tamano] ?? gabinete.tamano],
    [SPEC_LABELS.sidePanel, PANELES[gabinete.panel] ?? gabinete.panel],
  ];

  return (
    <MainContainer width="md">
      <div className="w-32">
        <Button variant="mutedText" onClick={() => navigate(-1)}>
          {M.back}
        </Button>
      </div>

      <article className="space-y-6 rounded-xl border border-neutral-200 bg-white p-8 shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-neutral-200 pb-6 md:flex-row md:items-center">
          <div>
            <span className="text-sm font-semibold tracking-wider text-blue-600 uppercase">
              {MESSAGES.labels.brand}: {gabinete.marca}
            </span>
            <h1 className="mt-1 text-3xl font-bold text-neutral-900">
              {gabinete.nombre}
            </h1>
          </div>
          <span className="text-2xl font-bold text-neutral-900">
            {formatPrice(gabinete.costoUnitario)}
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {gabinete.imagenUrl && !imageFailed && (
            <img
              src={imageUrl}
              alt={gabinete.nombre}
              className="h-72 w-full rounded-lg bg-neutral-100 object-cover"
              onError={() => setFailedImage(imageUrl)}
            />
          )}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-neutral-900">{M.specs}</h2>
            <ul className="space-y-2 text-sm text-neutral-600">
              {specs.map(([label, value]) => (
                <li key={label}>
                  {label}: <strong className="text-neutral-900">{value}</strong>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
            <p className="mb-2 text-sm text-neutral-500">{M.manufacturer}</p>
            <p className="text-sm text-neutral-700">{M.description}</p>
          </div>
        </div>

        <div className="flex justify-end border-t border-neutral-200 pt-6">
          <div className="w-56">
            <Button
              variant="compact"
              onClick={() => {
                agregarAlCarrito(gabinete);
                markAdded();
              }}
            >
              {added ? MESSAGES.actions.added : MESSAGES.actions.addToCart}
            </Button>
          </div>
        </div>
      </article>
    </MainContainer>
  );
};

export default ProductoDetalle;
