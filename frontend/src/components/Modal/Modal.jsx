//frontend/src/components/Modal/Modal.jsx
import { useEffect, useId } from "react";
import { X } from "lucide-react";

const SIZES = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

// Ventana modal reutilizable: fondo oscuro, título, botón de cerrar y contenido.
// Se cierra con la tecla Escape, con la X y (opcionalmente) tocando el fondo.
// Props:
//   title: título de la ventana
//   onClose: qué hacer al cerrar
//   size: sm, md o lg (ancho de la ventana)
//   closeOnBackdrop: si es false, tocar el fondo no la cierra (útil en formularios)
//   children: el contenido
const Modal = ({
  title,
  onClose,
  size = "md",
  closeOnBackdrop = true,
  children,
}) => {
  const titleId = useId();

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  // Bloquea el scroll de la página mientras el modal está abierto
  useEffect(() => {
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`relative max-h-[90vh] w-full overflow-y-auto rounded-xl bg-white shadow-2xl ${SIZES[size]}`}
      >
        <header className="flex items-center justify-between border-b border-neutral-200 px-5 py-4">
          <h2 id={titleId} className="text-lg font-semibold text-neutral-900">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="cursor-pointer rounded-lg p-2 text-neutral-500 transition hover:bg-neutral-100 hover:text-neutral-900"
          >
            <X size={20} />
          </button>
        </header>
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

export default Modal;