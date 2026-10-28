import { Link, useSearchParams } from "react-router";
import Feedback from "../../components/Feedback/Feedback";
import MainContainer from "../../components/MainContainer/MainContainer";
import ProductCard from "../../components/ProductCard/ProductCard";
import StateMessage from "../../components/StateMessage/StateMessage";
import { MESSAGES } from "../../constants/MESSAGES";
import { ROUTES } from "../../constants/ROUTES";
import { useGabinetes } from "../../hooks/useGabinetes";
import useFetch from "../../hooks/useFetch";
import { listarCategorias } from "../../services/categoriaService";
import { useCartStore } from "../../store/cartStore";
import { gabineteToProduct } from "../../utils/gabinete";

const M = MESSAGES.catalog;

// Página del catálogo: muestra todos los gabinetes disponibles.
const Productos = () => {
  const { gabinetes, loading, error } = useGabinetes();
  const agregarAlCarrito = useCartStore((state) => state.agregarAlCarrito);
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get("categoria");
  const {
    data: categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useFetch(
    "catalog-categories",
    listarCategorias,
    M.categoryLoadError,
  );
  const selectedCategory = (categories ?? []).find(
    (category) => category.id === categoryId,
  );
  const productosVisibles = categoryId
    ? gabinetes.filter((gabinete) => gabinete.categoriaId === categoryId)
    : gabinetes;

  return (
    <MainContainer title={selectedCategory?.nombre ?? M.title} width="xl">
      {categoryId && categoriesError && (
        <Feedback type="error">{categoriesError}</Feedback>
      )}
      {error && <Feedback type="error">{error}</Feedback>}
      {categoryId && categoriesLoading ? (
        <StateMessage>{M.categoryLoading}</StateMessage>
      ) : categoryId && categoriesError ? (
        <StateMessage>{M.categoryLoadError}</StateMessage>
      ) : categoryId && !categoriesError && !selectedCategory ? (
        <StateMessage>{M.categoryNotFound}</StateMessage>
      ) : loading ? (
        <StateMessage>{M.loading}</StateMessage>
      ) : productosVisibles.length === 0 ? (
        !error && (
          <StateMessage>
            {categoryId ? M.categoryEmpty : M.empty}
          </StateMessage>
        )
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {productosVisibles.map((gabinete) => (
            <ProductCard
              key={gabinete.id}
              product={gabineteToProduct(gabinete)}
              detailsTo={ROUTES.productDetail(gabinete.id)}
              onAddToCart={() => agregarAlCarrito(gabinete)}
            />
          ))}
        </div>
      )}
      {categoryId && (
        <div className="mt-8 flex justify-center">
          <Link
            to={ROUTES.home}
            className="rounded-lg bg-neutral-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-neutral-700"
          >
            {M.backHome}
          </Link>
        </div>
      )}
    </MainContainer>
  );
};

export default Productos;
