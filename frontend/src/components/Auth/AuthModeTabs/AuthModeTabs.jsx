import { Link } from "react-router";
import { LOGIN } from "../../../constants/LOGIN";
import { ROUTES } from "../../../constants/ROUTES";

// Pestañas para cambiar entre "Ingresar" y "Registrarse".
// Props:
//   mode: pestaña activa: login o register
//   onModeChange: se ejecuta al cambiar de pestaña (para limpiar el formulario)
const AuthModeTabs = ({ mode, onModeChange, onSelectMode }) => {
  if (mode !== "login" && mode !== "register") return null;

  const tabs = [
    { id: "login", to: ROUTES.login, label: LOGIN.title },
    { id: "register", to: ROUTES.register, label: LOGIN.register.tab },
  ];

  return (
    <div className="mt-6 flex rounded-xl bg-neutral-100 p-1">
      {tabs.map((tab) =>
        onSelectMode ? (
          <button
            key={tab.id}
            type="button"
            onClick={() => onSelectMode(tab.id)}
            aria-pressed={mode === tab.id}
            className={`flex-1 rounded-lg py-2 text-center text-sm font-medium transition-all ${
              mode === tab.id
                ? "bg-white font-semibold text-neutral-900 shadow-sm"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            {tab.label}
          </button>
        ) : (
          <Link
            key={tab.id}
            to={tab.to}
            onClick={onModeChange}
            aria-current={mode === tab.id ? "page" : undefined}
            className={`flex-1 rounded-lg py-2 text-center text-sm font-medium transition-all ${
              mode === tab.id
                ? "bg-white font-semibold text-neutral-900 shadow-sm"
                : "text-neutral-500 hover:text-neutral-900"
            }`}
          >
            {tab.label}
          </Link>
        ),
      )}
    </div>
  );
};

export default AuthModeTabs;
