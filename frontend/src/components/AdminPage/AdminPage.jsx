import Button from "../Button/Button";

// Estructura común de las secciones del panel de administración:
// título y descripción de la sección, botón de crear (opcional) y el contenido (listado).
// Props:
//   title: título de la sección
//   subtitle: descripción de la sección
//   actionLabel: texto del botón de crear (si no se pasa, no hay botón)
//   onAction: qué hacer al tocar el botón de crear
//   children: el contenido (avisos, tabla, modales)
const AdminPage = ({ title, subtitle, actionLabel, onAction, children }) => {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 sm:px-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-neutral-900">{title}</h1>
          <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>
        </div>
        {actionLabel && (
          <Button variant="compact" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </header>
      {children}
    </div>
  );
};

export default AdminPage;