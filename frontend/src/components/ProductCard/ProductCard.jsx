import { useState } from "react";
import { Link } from "react-router";
import { PRODUCTCARD } from "../../constants/PRODUCTCARD";
import useTemporaryFlag from "../../hooks/useTemporaryFlag";
import { formatPrice } from "../../utils/format";
import Button from "../Button/Button";

// Tarjeta de un producto con imagen, datos, precio y botones para ver detalles o agregar al carrito.
// Props:
//   product: datos del producto: name, image, price, subtitle y specs
//   detailsTo: dirección a la que lleva el botón "Ver detalles"
//   onAddToCart: qué hacer al tocar "Agregar al carrito"
const ProductCard = ({
  product,
  detailsTo,
  onAddToCart,
}) => {
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [failedImage, setFailedImage] = useState("");
  const [added, markAdded] = useTemporaryFlag();
  const { name, image, price, subtitle, specs = [] } = product;

  const imageFailed = failedImage === image;

  const handleAddToCart = () => {
    onAddToCart(product);
    markAdded();
  };

  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm">
      {image && !imageFailed ? (
        <button
          type="button"
          className="block w-full cursor-zoom-in bg-neutral-100"
          onClick={() => setIsImageExpanded(true)}
          aria-label={PRODUCTCARD.expandImage(name)}
        >
          <img
            src={image}
            alt={name}
            className="h-48 w-full object-cover"
            onError={() => setFailedImage(image)}
          />
        </button>
      ) : (
        <div className="flex h-48 w-full items-center justify-center bg-neutral-100 text-sm text-neutral-400">
          {PRODUCTCARD.noImage}
        </div>
      )}

      <div className="flex flex-1 flex-col justify-between space-y-3 p-4">
        <div>
          <h2 className="font-semibold text-neutral-900">{name}</h2>
          {subtitle && <p className="text-sm text-neutral-500">{subtitle}</p>}
          {specs.length > 0 && (
            <ul className="mt-2 space-y-0.5 text-xs text-neutral-600">
              {specs.map((spec) => (
                <li key={spec.label}>
                  {spec.label}: <strong className="text-neutral-900">{spec.value}</strong>
                </li>
              ))}
            </ul>
          )}
          <p className="mt-2 text-lg font-bold text-neutral-900">{formatPrice(price)}</p>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Link
            to={detailsTo}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-center text-sm font-semibold text-neutral-800 transition hover:bg-neutral-50"
          >
            {PRODUCTCARD.details}
          </Link>
          <Button
            variant="verify"
            disabled={!onAddToCart}
            onClick={handleAddToCart}
          >
            {added ? PRODUCTCARD.added : PRODUCTCARD.addToCart}
          </Button>
        </div>
      </div>

      {isImageExpanded && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={PRODUCTCARD.image(name)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
        >
          <button
            type="button"
            className="absolute right-4 top-4 rounded-lg bg-white px-3 py-2 text-sm font-semibold text-neutral-900"
            onClick={() => setIsImageExpanded(false)}
          >
            {PRODUCTCARD.close}
          </button>
          <img
            src={image}
            alt={name}
            className="max-h-full max-w-full rounded-lg object-contain"
          />
        </div>
      )}
    </article>
  );
};

export default ProductCard;
