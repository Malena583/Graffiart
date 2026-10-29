import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";
import { ChevronDown, ChevronRight, ExternalLink, LogOut } from "lucide-react";
import { ADMIN_MESSAGES } from "../../constants/ADMIN_MESSAGE";
import { ADMIN_NAV } from "../../constants/ADMIN_NAV";
import { ROUTES } from "../../constants/ROUTES";
import { useAuthStore } from "../../store/authStore";

const ITEM_CLASS = "flex items-center gap-3 rounded-lg px-3 text-sm transition-colors";
const ACTIVE_CLASS = "bg-neutral-800 text-white";
const IDLE_CLASS = "text-neutral-400 hover:bg-neutral-800 hover:text-white";

const isPathActive = (pathname, to) =>
  pathname === to || pathname.startsWith(`${to}/`);

// Menú lateral del panel: grupos desplegables, links directos y cerrar sesión.
// Props:
//   isOpen: true si el menú está visible (en celulares)
//   onClose: cierra el menú (en celulares)
const AdminSidebar = ({ isOpen, onClose }) => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  // Si la URL actual pertenece a un hijo, ese grupo arranca abierto
  const [expandedId, setExpandedId] = useState(
    () =>
      ADMIN_NAV.find((item) =>
        item.children?.some((child) => isPathActive(pathname, child.to)),
      )?.id ?? null,
  );

  const handleLogout = () => {
    logout();
    navigate(ROUTES.login, { replace: true });
  };

  return (
    <aside
      className={`fixed bottom-0 left-0 top-16 z-40 flex w-64 transform flex-col bg-neutral-900 transition-transform duration-300 ease-in-out lg:sticky lg:z-auto lg:h-[calc(100vh-4rem)] lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
      aria-label={ADMIN_MESSAGES.aria.sidebar}
    >
      <nav
        className="flex-1 overflow-y-auto py-4"
        aria-label={ADMIN_MESSAGES.aria.mainNav}
      >
        <ul className="space-y-1 px-3">
          {ADMIN_NAV.map((item) => {
            const Icon = item.icon;

            if (!item.children) {
              return (
                <li key={item.id}>
                  <NavLink
                    to={item.to}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `${ITEM_CLASS} py-2.5 font-medium ${isActive ? ACTIVE_CLASS : IDLE_CLASS}`
                    }
                  >
                    <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                    {item.label}
                  </NavLink>
                </li>
              );
            }

            const expanded = expandedId === item.id;
            const hasActiveChild = item.children.some((child) =>
              isPathActive(pathname, child.to),
            );

            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setExpandedId(expanded ? null : item.id)}
                  className={`${ITEM_CLASS} w-full cursor-pointer justify-between py-2.5 font-medium ${
                    hasActiveChild ? ACTIVE_CLASS : IDLE_CLASS
                  }`}
                  aria-expanded={expanded}
                  aria-controls={`sidebar-${item.id}`}
                >
                  <span className="flex items-center gap-3">
                    <Icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                    {item.label}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 transition-transform ${
                      expanded ? "rotate-180" : ""
                    }`}
                    aria-hidden="true"
                  />
                </button>
                <ul
                  id={`sidebar-${item.id}`}
                  className={`overflow-hidden transition-all duration-200 ${
                    expanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
                >
                  {item.children.map((child) => (
                    <li key={child.to}>
                      <NavLink
                        to={child.to}
                        onClick={onClose}
                        className={({ isActive }) =>
                          `${ITEM_CLASS} py-2 ${isActive ? ACTIVE_CLASS : IDLE_CLASS}`
                        }
                      >
                        <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                        {child.label}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="space-y-1 border-t border-neutral-800 p-4">
        <NavLink
          to={ROUTES.home}
          onClick={onClose}
          className={`${ITEM_CLASS} py-2.5 font-medium ${IDLE_CLASS}`}
        >
          <ExternalLink className="h-5 w-5 shrink-0" aria-hidden="true" />
          {ADMIN_MESSAGES.actions.viewSite}
        </NavLink>
        <button
          type="button"
          onClick={handleLogout}
          className={`${ITEM_CLASS} w-full cursor-pointer py-2.5 font-medium ${IDLE_CLASS}`}
        >
          <LogOut className="h-5 w-5 shrink-0" aria-hidden="true" />
          {ADMIN_MESSAGES.actions.logout}
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;