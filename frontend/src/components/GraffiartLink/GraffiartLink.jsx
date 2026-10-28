import { Link } from "react-router";
import { ROUTES } from "../../constants/ROUTES";

// Logo "GraffiArt" que lleva al inicio al hacer click.
// Props:
//   className: estilo del texto, para cambiar tamaño o color
const GraffiartLink = ({
  className = "text-base font-bold text-white",
}) => {
  return (
    <Link to={ROUTES.home} className={className}>
      GraffiArt
    </Link>
  );
};

export default GraffiartLink;