import { useState } from "react";
import { useLocation } from "react-router";

const useConfigurador = () => {
  const location = useLocation();
  const [seleccion, setSeleccion] = useState(
    () => location.state?.configuracion ?? {},
  );

  const seleccionar = (categoriaId, opcionId, esMultiple) => {
    setSeleccion((prev) => {
      if (!esMultiple) return { ...prev, [categoriaId]: opcionId };

      const actuales = Array.isArray(prev[categoriaId])
        ? prev[categoriaId]
        : prev[categoriaId]
          ? [prev[categoriaId]]
          : [];
      const yaEstaba = actuales.includes(opcionId);
      const nuevos = yaEstaba
        ? actuales.filter((id) => id !== opcionId)
        : [...actuales, opcionId];

      return { ...prev, [categoriaId]: nuevos };
    });
  };

  const cargarDiseno = (configuracion) => setSeleccion(configuracion || {});

  return { seleccion, seleccionar, cargarDiseno };
};

export default useConfigurador;
