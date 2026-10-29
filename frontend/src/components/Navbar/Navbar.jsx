import { useCallback, useEffect, useRef, useState } from "react";
import { Search, ShoppingBag, UserRound } from "lucide-react";
import { Link } from "react-router";
import { ROLES } from "../../constants/APP";
import { MESSAGES } from "../../constants/MESSAGES";
import { NAVBAR } from "../../constants/NAVBAR";
import { ROUTES } from "../../constants/ROUTES";
import useFetch from "../../hooks/useFetch";
import { listarCategorias } from "../../services/categoriaService";
import { selectCantidadTotal, useCartStore } from "../../store/cartStore";
import { useAuthStore } from "../../store/authStore";
import GraffiartLink from "../GraffiartLink/GraffiartLink";
import NavItem from "../NavItem/NavItem";
import AuthPanel from "./AuthPanel";
import CartPanel from "./CartPanel";
import ProfilePanel from "./ProfilePanel";
import SearchPanel from "./SearchPanel";
import SidePanel from "./SidePanel";

// Barra de navegación superior: links del sitio, perfil o login, cerrar sesión y carrito con la cantidad de productos.
const Navbar = () => {
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [activePanel, setActivePanel] = useState(null);
  const hoverTimeout = useRef(null);
  const usuario = useAuthStore((state) => state.usuario);
  const logout = useAuthStore((state) => state.logout);
  const login = useAuthStore((state) => state.login);
  const cantidad = useCartStore(selectCantidadTotal);
  const {
    data: categories,
    loading: categoriesLoading,
    error: categoriesError,
    reload: reloadCategories,
  } = useFetch(
    "navbar-categories",
    listarCategorias,
    NAVBAR.categories.error,
  );
  const isAdmin = usuario?.rol === ROLES.admin;
  const links = isAdmin ? [...NAVBAR.links, ...NAVBAR.adminLinks] : NAVBAR.links;
  const closePanel = useCallback(() => setActivePanel(null), []);
  const panelTitles = {
    search: MESSAGES.navbarPanels.search,
    profile: MESSAGES.navbarPanels.profile,
    cart: MESSAGES.navbarPanels.cart,
  };

  const togglePanel = (panel) => {
    clearTimeout(hoverTimeout.current);
    setCategoriesOpen(false);
    setActivePanel((currentPanel) => (currentPanel === panel ? null : panel));
  };

  const openCategories = () => {
    if (!categoriesOpen) {
      setActivePanel(null);
      setCategoriesOpen(true);
      reloadCategories();
    }
  };

  const toggleCategories = () => {
    clearTimeout(hoverTimeout.current);
    if (categoriesOpen) {
      setCategoriesOpen(false);
      return;
    }
    setActivePanel(null);
    openCategories();
  };

  const handleCategoriesMouseEnter = () => {
    hoverTimeout.current = setTimeout(openCategories, 100);
  };

  const handleCategoriesMouseLeave = () => {
    clearTimeout(hoverTimeout.current);
    setCategoriesOpen(false);
  };

  useEffect(
    () => () => clearTimeout(hoverTimeout.current),
    [],
  );

  return (
    <header className="px-4 pt-4">
      <nav className="grid h-[76px] grid-cols-[auto_1fr_auto] items-center gap-4 rounded-xl bg-neutral-900 px-5 sm:px-8">
        <GraffiartLink className="text-lg font-semibold text-white" />

        <div className="flex h-full items-center justify-center gap-5 sm:gap-8">
          {links.map(({ label, to }) => (
            <NavItem key={to} to={to}>
              {label}
            </NavItem>
          ))}
          <div
            className="relative flex h-full items-center"
            onMouseEnter={handleCategoriesMouseEnter}
            onMouseLeave={handleCategoriesMouseLeave}
          >
            <button
              type="button"
              aria-haspopup="true"
              aria-expanded={categoriesOpen}
              onClick={toggleCategories}
              className={`relative flex h-full items-center text-sm transition-colors ${
                categoriesOpen
                  ? "font-semibold text-white after:absolute after:inset-x-0 after:bottom-5 after:h-0.5 after:bg-white"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {NAVBAR.categories.label}
            </button>
            {categoriesOpen && (
              <div
                role="menu"
                className="absolute top-full left-1/2 z-50 min-w-52 -translate-x-1/2 rounded-xl border border-neutral-200 bg-white p-2 text-neutral-900 shadow-lg"
              >
                {categoriesLoading ? (
                  <p className="px-4 py-2 text-sm text-neutral-500">
                    {NAVBAR.categories.loading}
                  </p>
                ) : categoriesError ? (
                  <p className="px-4 py-2 text-sm text-red-600" role="status">
                    {categoriesError}
                  </p>
                ) : categories?.length ? (
                  categories.map((category) => (
                    <Link
                      key={category.id}
                      to={`${ROUTES.products}?categoria=${encodeURIComponent(category.id)}`}
                      role="menuitem"
                      onClick={() => setCategoriesOpen(false)}
                      className="block rounded-lg px-4 py-2 text-sm hover:bg-neutral-100"
                    >
                      {category.nombre}
                    </Link>
                  ))
                ) : (
                  <p className="px-4 py-2 text-sm text-neutral-500" role="status">
                    {NAVBAR.categories.empty}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 text-white sm:gap-5">
          <button
            type="button"
            onClick={() => togglePanel("search")}
            aria-label={MESSAGES.navbarPanels.search}
            aria-expanded={activePanel === "search"}
            className="cursor-pointer transition hover:text-neutral-300"
          >
            <Search size={19} />
          </button>
          <button
            type="button"
            onClick={() => togglePanel("profile")}
            aria-label={NAVBAR.aria.profile}
            aria-expanded={activePanel === "profile"}
            title={usuario?.nombre}
            className="cursor-pointer transition hover:text-neutral-300"
          >
            <UserRound size={19} />
          </button>
          <button
            type="button"
            onClick={() => togglePanel("cart")}
            aria-label={NAVBAR.aria.cart}
            aria-expanded={activePanel === "cart"}
            className="relative cursor-pointer transition hover:text-neutral-300"
          >
            <ShoppingBag size={19} />
            {cantidad > 0 && (
              <span className="absolute -top-2 -right-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-semibold">
                {cantidad}
              </span>
            )}
          </button>
        </div>
      </nav>
      {activePanel && (
        <SidePanel title={panelTitles[activePanel]} onClose={closePanel}>
          {activePanel === "search" && <SearchPanel onClose={closePanel} />}
          {activePanel === "profile" &&
            (usuario ? (
              <ProfilePanel onLogout={logout} />
            ) : (
              <AuthPanel
                onLoginSuccess={({ usuario: authenticatedUser, token }) => {
                  login(authenticatedUser, token);
                }}
              />
            ))}
          {activePanel === "cart" && <CartPanel onClose={closePanel} />}
        </SidePanel>
      )}
    </header>
  );
};

export default Navbar;
