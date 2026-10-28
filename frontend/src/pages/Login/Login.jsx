import AuthPage from "../Auth/AuthPage";
import { useNavigate } from "react-router";
import { useAuthStore } from "../../store/authStore";
import { ROLES } from "../../constants/APP";
import { ROUTES } from "../../constants/ROUTES";

// Página de inicio de sesión. Al entrar, lleva al panel si es admin o al inicio si es cliente.
const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleLoginSuccess = (response) => {
    login(response.usuario, response.token);
    navigate(response.usuario.rol === ROLES.admin ? ROUTES.admin : ROUTES.home);
  };

  return <AuthPage onLoginSuccess={handleLoginSuccess} />;
};

export default Login;
