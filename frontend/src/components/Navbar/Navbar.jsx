import { useCallback, useState } from "react";
import { Search, ShoppingBag, UserRound } from "lucide-react";
import { ROLES } from "../../constants/APP";
import { MESSAGES } from "../../constants/MESSAGES";
import { NAVBAR } from "../../constants/NAVBAR";
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
  const [activePanel, setActivePanel] = useState(null);
  const usuario = useAuthStore((state) => state.usuario);
  const logout = useAuthStore((state) => state.logout);
  const login = useAuthStore((state) => state.login);
  const cantidad = useCartStore(selectCantidadTotal);
  const isAdmin = usuario?.rol === ROLES.admin;
  const links = isAdmin ? [...NAVBAR.links, ...NAVBAR.adminLinks] : NAVBAR.links;
  const closePanel = useCallback(() => setActivePanel(null), []);
  const panelTitles = {
    search: MESSAGES.navbarPanels.search,
    profile: MESSAGES.navbarPanels.profile,
    cart: MESSAGES.navbarPanels.cart,
  };

  const togglePanel = (panel) => {
    setActivePanel((currentPanel) => (currentPanel === panel ? null : panel));
  };

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