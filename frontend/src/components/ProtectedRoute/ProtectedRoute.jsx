import { Navigate, Outlet } from "react-router";
import { useAuthStore } from "../../store/authStore";
import { ROUTES } from "../../constants/ROUTES";

// Protege páginas: si el usuario no inició sesión (o no tiene el rol pedido) lo manda a otra página.
// Props:
//   role: rol necesario para entrar, por ejemplo "ADMIN". Si no se pasa, alcanza con haber iniciado sesión
const ProtectedRoute = ({ role }) => {
  const usuario = useAuthStore((state) => state.usuario);

  if (!usuario) return <Navigate to={ROUTES.login} replace />;
  if (role && usuario.rol !== role) return <Navigate to={ROUTES.home} replace />;

  return <Outlet />;
};

export default ProtectedRoute;
