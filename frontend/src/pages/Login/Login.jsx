import { Navigate } from "react-router";
import AuthPage from "../Auth/AuthPage";
import { useAuthStore } from "../../store/authStore";
import { getPostLoginRoute } from "../../utils/authRedirect";

// Página de inicio de sesión. Al entrar, lleva al panel si es admin o al inicio si es cliente.
// Si ya hay una sesión iniciada, redirige directamente según el rol.
const Login = () => {
  const usuario = useAuthStore((state) => state.usuario);
  const login = useAuthStore((state) => state.login);

  if (usuario) {
    return <Navigate to={getPostLoginRoute(usuario)} replace />;
  }

  const handleLoginSuccess = (response) => {
    // Al guardar la sesión, este componente se vuelve a renderizar y redirige solo.
    login(response.usuario, response.token);
  };

  return <AuthPage onLoginSuccess={handleLoginSuccess} />;
};

export default Login;
