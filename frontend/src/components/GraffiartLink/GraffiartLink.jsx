import { Link } from "react-router";
import { ROUTES } from "../../constants/ROUTES";

// Logo "GraffiArt" que lleva a una página al hacer click (por defecto, el inicio).
// Props:
//   to: dirección a la que lleva
//   className: estilo del texto, para cambiar tamaño o color
const GraffiartLink = ({
  to = ROUTES.home,
  className = "text-base font-bold text-white",
}) => {
  return (
    <Link to={to} className={className}>
      GraffiArt
    </Link>
  );
};

export default GraffiartLink;