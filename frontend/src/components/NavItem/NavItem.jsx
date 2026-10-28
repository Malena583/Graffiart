import { NavLink } from "react-router";
import { ROUTES } from "../../constants/ROUTES";

// Link de la barra de navegación. Se resalta cuando es la página en la que estás.
// Props:
//   to: dirección a la que lleva
//   children: texto del link
const NavItem = ({ to, children }) => {
  return (
    <NavLink
      to={to}
      end={to === ROUTES.home}
      className={({ isActive }) =>
        `relative flex h-full items-center text-sm transition-colors ${
          isActive
            ? "font-semibold text-white after:absolute after:inset-x-0 after:bottom-5 after:h-0.5 after:bg-white"
            : "text-neutral-400 hover:text-white"
        }`
      }
    >
      {children}
    </NavLink>
  );
};

export default NavItem;