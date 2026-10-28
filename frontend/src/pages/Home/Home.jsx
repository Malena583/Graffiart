import { useState } from "react";
import { Link } from "react-router";
import Feedback from "../../components/Feedback/Feedback";
import Hero from "../../components/Hero/Hero";
import ProductCard from "../../components/ProductCard/ProductCard";
import StateMessage from "../../components/StateMessage/StateMessage";
import { MESSAGES } from "../../constants/MESSAGES";
import { ROUTES } from "../../constants/ROUTES";
import { useGabinetes } from "../../hooks/useGabinetes";
import useFetch from "../../hooks/useFetch";
import { listarCategorias } from "../../services/categoriaService";
import { useCartStore } from "../../store/cartStore";
import { gabineteToProduct } from "../../utils/gabinete";

// Página de inicio.
const Home = () => {
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);
  const { gabinetes, loading: productsLoading, error: productsError } = useGabinetes();
  const {
    data: categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useFetch(
    "home-categories",
    listarCategorias,
    MESSAGES.homeCategories.loadCategoriesError,
  );
  const agregarAlCarrito = useCartStore((state) => state.agregarAlCarrito);
  const activeCategories = (categories ?? []).filter((category) => category.activo);
  const selectedCategory =
    activeCategories.find((category) => category.id === selectedCategoryId) ??
    activeCategories[0];
  const categoryProducts = selectedCategory
    ? gabinetes.filter((gabinete) => gabinete.categoriaId === selectedCategory.id)
    : [];

  return (
    <main className="flex flex-1 flex-col">
      <Hero />
      <section className="w-full bg-neutral-100 px-4 py-12 sm:px-8 lg:px-12">
        <div className="mx-auto w-full max-w-6xl space-y-8">
          <h2 className="text-center text-3xl font-bold text-neutral-900">
            {MESSAGES.homeCategories.title}
          </h2>

          {categoriesError && <Feedback type="error">{categoriesError}</Feedback>}

          {categoriesLoading ? (
            <StateMessage>{MESSAGES.homeCategories.loading}</StateMessage>
          ) : activeCategories.length === 0 ? (
            !categoriesError && (
              <StateMessage>{MESSAGES.homeCategories.emptyCategories}</StateMessage>
            )
          ) : (
            <>
              <div className="flex flex-wrap justify-center gap-3">
                {activeCategories.map((category) => {
                  const selected = category.id === selectedCategory.id;
                  return (
                    <button
                      key={category.id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => setSelectedCategoryId(category.id)}
                      className={`rounded-full px-6 py-3 text-sm font-medium transition ${
                        selected
                          ? "bg-neutral-900 text-white"
                          : "bg-white text-neutral-700 hover:bg-neutral-200"
                      }`}
                    >
                      {category.nombre}
                    </button>
                  );
                })}
              </div>

              {productsError && <Feedback type="error">{productsError}</Feedback>}

              {productsLoading ? (
                <StateMessage>{MESSAGES.catalog.loading}</StateMessage>
              ) : categoryProducts.length === 0 ? (
                !productsError && (
                  <StateMessage>{MESSAGES.homeCategories.emptyProducts}</StateMessage>
                )
              ) : (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                  {categoryProducts.slice(0, 4).map((gabinete) => (
                    <ProductCard
                      key={gabinete.id}
                      product={gabineteToProduct(gabinete)}
                      detailsTo={ROUTES.productDetail(gabinete.id)}
                      onAddToCart={() => agregarAlCarrito(gabinete)}
                    />
                  ))}
                </div>
              )}

              <div className="text-center">
                <Link
                  to={`${ROUTES.products}?categoria=${encodeURIComponent(selectedCategory.id)}`}
                  className="inline-flex items-center gap-2 font-semibold text-neutral-900 transition hover:text-neutral-600"
                >
                  {MESSAGES.homeCategories.explore}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default Home;