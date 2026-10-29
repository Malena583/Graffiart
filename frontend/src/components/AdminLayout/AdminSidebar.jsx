import { useState } from "react";
import { NavLink, useLocation } from "react-router";
import {
  Box,
  LayoutDashboard,
  Package,
  Boxes,
  ShoppingCart,
  ChevronDown,
  ChevronRight,
  X,
} from "lucide-react";
import { ROUTES } from "../../constants/ROUTES";
import { ADMIN_MESSAGES } from "../../constants/ADMIN_MESSAGE";

const SIDEBAR_ITEMS = [
  {
    label: ADMIN_MESSAGES.labels.label_dashboard,
    to: ROUTES.admin,
    icon: LayoutDashboard,
  },
  {
    label: ADMIN_MESSAGES.labels.label_products,
    icon: Package,
    children: [
      { label: ADMIN_MESSAGES.labels.label_catalog, to: ROUTES.adminProducts },
      { label: ADMIN_MESSAGES.labels.label_designs, to: ROUTES.adminDesigns },
      { label: ADMIN_MESSAGES.labels.label_sizes, to: ROUTES.adminSizes },
      { label: ADMIN_MESSAGES.labels.label_colors, to: ROUTES.adminColors },
      { label: ADMIN_MESSAGES.labels.label_materials, to: ROUTES.adminMaterials },
      { label: ADMIN_MESSAGES.labels.label_accessories, to: ROUTES.adminAccessories },
    ],
  },
  {
    label: ADMIN_MESSAGES.labels.label_categories,
    to: ROUTES.adminCategories,
    icon: Boxes,
  },
  {
    label: ADMIN_MESSAGES.labels.label_inventory,
    to: ROUTES.inventory,
    icon: Box,
  },
  {
    label: ADMIN_MESSAGES.labels.label_orders,
    to: ROUTES.adminOrders,
    icon: ShoppingCart,
  },
];

const AdminSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  // Si la URL actual pertenece a un hijo, ese grupo arranca abierto
  const [expandedItem, setExpandedItem] = useState(
    () =>
      SIDEBAR_ITEMS.find((item) =>
        item.children?.some(
          (child) =>
            location.pathname === child.to ||
            location.pathname.startsWith(child.to + "/"),
        ),
      )?.label ?? null,
  );

  const toggleItem = (label) => {
    setExpandedItem((prev) => (prev === label ? null : label));
  };

  // exact = true: solo coincide con la ruta exacta (para Dashboard)
  const isItemActive = (to, exact = false) => {
    if (!to) return false;
    return exact
      ? location.pathname === to
      : location.pathname === to || location.pathname.startsWith(to + "/");
  };

  const isItemExpanded = (label) => expandedItem === label;

  const hasActiveChild = (item) => {
    if (!item.children) return false;
    return item.children.some((child) => isItemActive(child.to));
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex flex-col w-64 transform bg-neutral-900 transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:z-auto`}
      aria-label={ADMIN_MESSAGES.labels.aria_label_sidebar}
    >
      <div className="flex h-16 items-center justify-between border-b border-neutral-800 px-5">
        <NavLink
          to={ROUTES.admin}
          className="text-lg font-semibold text-white hover:text-neutral-300"
          onClick={onClose}
        >
          {ADMIN_MESSAGES.NavLink.grafiart_admin}
        </NavLink>
        <button
          type="button"
          onClick={onClose}
          className="lg:hidden p-2 text-neutral-400 hover:text-white"
          aria-label={ADMIN_MESSAGES.labels.aria_label_menu}
        >
          <X size={24} />
        </button>
      </div>

      <nav
        className="flex-1 overflow-y-auto py-4"
        aria-label="Navegación principal"
      >
        <ul className="space-y-1 px-3">
          {SIDEBAR_ITEMS.map((item) => {
            // Dashboard solo se marca activo en /admin exacto
            const isActive = isItemActive(item.to, item.to === ROUTES.admin);
            const hasChildren = item.children && item.children.length > 0;
            const childActive = hasActiveChild(item);
            const isParentActive = isActive || childActive;

            return (
              <li key={item.label}>
                {hasChildren ? (
                  <>
                    <button
                      type="button"
                      onClick={() => toggleItem(item.label)}
                      className={`flex w-full items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        isParentActive
                          ? "bg-neutral-800 text-white"
                          : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                      }`}
                      aria-expanded={isItemExpanded(item.label)}
                      aria-controls={`sidebar-${item.label}`}
                    >
                      <span className="flex items-center gap-3">
                        <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                        {item.label}
                      </span>
                      <ChevronDown
                        className={`h-4 w-4 shrink-0 transition-transform ${
                          isItemExpanded(item.label) ? "rotate-180" : ""
                        }`}
                        aria-hidden="true"
                      />
                    </button>
                    <ul
                      id={`sidebar-${item.label}`}
                      className={`overflow-hidden transition-all duration-200 ${
                        isItemExpanded(item.label)
                          ? "max-h-96 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      {item.children.map((child) => {
                        const childIsActive = isItemActive(child.to);
                        return (
                          <li key={child.to}>
                            <NavLink
                              to={child.to}
                              onClick={onClose}
                              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                                childIsActive
                                  ? "bg-neutral-800 text-white"
                                  : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                              }`}
                              aria-current={childIsActive ? "page" : undefined}
                            >
                              <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                              {child.label}
                            </NavLink>
                          </li>
                        );
                      })}
                    </ul>
                  </>
                ) : (
                  <NavLink
                    to={item.to}
                    onClick={onClose}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-neutral-800 text-white"
                        : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                    }`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    <item.icon className="h-5 w-5 shrink-0" aria-hidden="true" />
                    {item.label}
                  </NavLink>
                )}
              </li>
            );
          })}
        </ul>
      </nav>

      
    </aside>
  );
};

export default AdminSidebar;