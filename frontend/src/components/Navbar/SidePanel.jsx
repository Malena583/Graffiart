import { useEffect } from "react";
import { X } from "lucide-react";

const SidePanel = ({ title, onClose, children }) => {
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  return (
    <>
      <button
        type="button"
        aria-label="Cerrar panel"
        onClick={onClose}
        className="fixed inset-0 z-40 cursor-default bg-black/50"
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-neutral-100 shadow-2xl"
      >
        <header className="flex items-center justify-between border-b border-neutral-200 bg-white px-5 py-4">
          <h2 className="text-lg font-semibold text-neutral-900">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar panel"
            className="rounded-lg p-2 text-neutral-600 transition hover:bg-neutral-100 hover:text-neutral-900"
          >
            <X size={20} />
          </button>
        </header>
        <div className="flex-1 overflow-y-auto p-5">{children}</div>
      </aside>
    </>
  );
};

export default SidePanel;
