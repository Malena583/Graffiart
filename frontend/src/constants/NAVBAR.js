import { ROUTES } from "./ROUTES";

export const NAVBAR = {
  links: [
    { label: "Inicio", to: ROUTES.home },
    { label: "Configurador", to: ROUTES.configurator },
    { label: "Productos", to: ROUTES.products },
  ],
  adminLinks: [
    { label: "Inventario", to: ROUTES.inventory },
    { label: "Administración", to: ROUTES.admin },
  ],
  categories: {
    label: "Categorías",
    loading: "Cargando categorías...",
    error: "No se pudieron cargar las categorías.",
    empty: "No hay categorías disponibles.",
  },
  aria: {
    profile: "Mi perfil",
    logout: "Cerrar sesión",
    login: "Ingresar",
    cart: "Carrito",
  },
};
