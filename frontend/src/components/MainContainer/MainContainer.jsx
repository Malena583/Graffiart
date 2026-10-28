const WIDTHS = {
  sm: "max-w-md",
  md: "max-w-3xl",
  lg: "max-w-5xl",
  xl: "max-w-6xl",
};

// Contenedor principal de cada página: pone el fondo, centra el contenido y muestra el título.
// Props:
//   title: título de la página
//   subtitle: texto chico debajo del título
//   width: ancho del contenido: sm, md, lg o xl
//   centered: si es true, centra el contenido en el medio de la pantalla
//   actions: elementos a la derecha del título, como un botón
//   children: el contenido de la página
const MainContainer = ({
  title,
  subtitle,
  width = "lg",
  centered = false,
  actions,
  children,
}) => {
  return (
    <main
      className={`flex-1 bg-neutral-100 px-4 py-8 ${
        centered ? "flex items-center justify-center" : ""
      }`}
    >
      <div className={`mx-auto w-full space-y-6 ${WIDTHS[width]}`}>
        {(title || actions) && (
          <div className="flex items-start justify-between gap-4">
            <header>
              <h1 className="text-xl font-semibold text-neutral-900">{title}</h1>
              {subtitle && (
                <p className="mt-1 text-sm text-neutral-500">{subtitle}</p>
              )}
            </header>
            {actions}
          </div>
        )}
        {children}
      </div>
    </main>
  );
};

export default MainContainer;
