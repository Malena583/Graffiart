//frontend/src/components/AdminLayout/AdminTopNavbar.jsx
import { useState, useRef, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router";
import { Menu, UserRound, Bell, LogOut, ChevronDown } from "lucide-react";
import { ROUTES } from "../../constants/ROUTES";
import { useAuthStore } from "../../store/authStore";
import SidePanel from "../Navbar/SidePanel";

const AdminTopNavbar = ({ onMenuClick }) => {
  const navigate = useNavigate();
  const usuario = useAuthStore((state) => state.usuario);
  const logout = useAuthStore((state) => state.logout);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const profileRef = useRef(null);

  const closePanels = useCallback(() => {
    setNotificationsOpen(false);
    setProfileOpen(false);
  }, []);

  const handleLogout = () => {
    logout();
    navigate(ROUTES.login, { replace: true });
  };

  const handleNotificationsClick = () => {
    setNotificationsOpen((prev) => !prev);
    setProfileOpen(false);
  };

  const handleProfileClick = (e) => {
    e.stopPropagation();
    setProfileOpen((prev) => !prev);
    setNotificationsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg text-neutral-600 hover:bg-neutral-100"
            aria-label="Abrir menú"
          >
            <Menu size={24} />
          </button>

          <Link
            to={ROUTES.admin}
            className="text-lg font-bold tracking-tight text-neutral-900"
          >
            GraffiArt
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleNotificationsClick}
            aria-label="Notificaciones"
            aria-expanded={notificationsOpen}
            className="p-2 rounded-lg text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
          >
            <Bell size={22} />
          </button>

          <div className="relative" ref={profileRef}>
            <button
              type="button"
              onClick={handleProfileClick}
              aria-label="Menú de usuario"
              aria-expanded={profileOpen}
              aria-haspopup="true"
              className="flex items-center gap-2 rounded-lg p-1.5 hover:bg-neutral-100 transition-colors"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-900 text-white text-sm font-medium">
                {usuario?.nombre?.[0]?.toUpperCase() || "A"}
              </div>
              <span className="hidden sm:block text-sm font-medium text-neutral-700">
                {usuario?.nombre || "Admin"}
              </span>
              <ChevronDown className="h-4 w-4 text-neutral-500" aria-hidden="true" />
            </button>

            {profileOpen && (
              <div
                role="menu"
                className="absolute right-0 top-full z-50 mt-2 min-w-48 rounded-xl border border-neutral-200 bg-white py-1 shadow-lg"
              >
                <Link
                  to={ROUTES.profile}
                  role="menuitem"
                  onClick={closePanels}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                >
                  <UserRound size={18} />
                  Mi perfil
                </Link>
                <hr className="my-1 border-neutral-200" />
                <button
                  type="button"
                  onClick={handleLogout}
                  role="menuitem"
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-neutral-100"
                >
                  <LogOut size={18} />
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {notificationsOpen && (
        <SidePanel title="Notificaciones" onClose={closePanels}>
          <p className="text-sm text-neutral-500">No hay notificaciones nuevas.</p>
        </SidePanel>
      )}
    </header>
  );
};

export default AdminTopNavbar;