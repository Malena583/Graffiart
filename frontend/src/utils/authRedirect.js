import { ROLES } from "../constants/APP";
import { ROUTES } from "../constants/ROUTES";

// Destino después de iniciar sesión (o si ya hay sesión iniciada):
// el administrador va al panel y el cliente a la tienda.
export const getPostLoginRoute = (usuario) =>
  usuario?.rol === ROLES.admin ? ROUTES.admin : ROUTES.home;