import { MESSAGES } from "./MESSAGES";
import { ROUTES } from "./ROUTES";

const A = MESSAGES.admin;

export const ADMIN_CARDS = [
  { to: ROUTES.adminCategories, title: "Categorías", text: A.categorias.cardText },
  { to: ROUTES.adminProducts, title: "Productos", text: A.productos.cardText },
  { to: ROUTES.inventory, title: "Inventario", text: A.materiales.cardText },
];
