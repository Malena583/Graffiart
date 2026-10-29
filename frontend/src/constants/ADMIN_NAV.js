import { Box, Boxes, Package, ShoppingCart } from "lucide-react";
import { ADMIN_MESSAGES } from "./ADMIN_MESSAGE";
import { ROUTES } from "./ROUTES";

const L = ADMIN_MESSAGES.labels;
const D = ADMIN_MESSAGES.descriptions;

// Items del panel de administración (sidebar y cuadrados del inicio).
// Un item con "children" es un grupo; si no, es un link directo.
export const ADMIN_NAV = [
  {
    id: "products",
    label: L.products,
    text: D.products,
    icon: Package,
    children: [
      { label: L.catalog, to: ROUTES.adminProducts },
      { label: L.accessories, to: ROUTES.adminAccessories },
    ],
  },
  { id: "categories", label: L.categories, text: D.categories, to: ROUTES.adminCategories, icon: Boxes },
  { id: "inventory", label: L.inventory, text: D.inventory, to: ROUTES.inventory, icon: Box },
  { id: "orders", label: L.orders, text: D.orders, to: ROUTES.adminOrders, icon: ShoppingCart },
];