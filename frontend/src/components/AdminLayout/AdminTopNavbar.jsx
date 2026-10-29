//frontend/src/components/AdminLayout/AdminTopNavbar.jsx
import { Menu } from "lucide-react";
import { ADMIN_MESSAGES } from "../../constants/ADMIN_MESSAGE";
import { ROUTES } from "../../constants/ROUTES";
import GraffiartLink from "../GraffiartLink/GraffiartLink";

// Barra superior del panel: solo el título GraffiArt (y el botón del menú en celulares).
// Props:
//   onMenuClick: abre o cierra el sidebar en pantallas chicas
const AdminTopNavbar = ({ onMenuClick }) => {
  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6">
        <button
          type="button"
          onClick={onMenuClick}
          className="cursor-pointer rounded-lg p-2 text-neutral-600 hover:bg-neutral-100 lg:hidden"
          aria-label={ADMIN_MESSAGES.aria.openMenu}
        >
          <Menu size={24} />
        </button>

        <GraffiartLink
          to={ROUTES.admin}
          className="text-lg font-bold tracking-tight text-neutral-900"
        />
      </div>
    </header>
  );
};

export default AdminTopNavbar;