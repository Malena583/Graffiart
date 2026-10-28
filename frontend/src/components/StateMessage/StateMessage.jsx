// Cuadro con un mensaje para cuando no hay nada que mostrar: cargando, lista vacía o no encontrado.
// Props:
//   title: título del mensaje
//   children: texto del mensaje
//   action: botón o link opcional debajo del mensaje
const StateMessage = ({ title, children, action }) => {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-8 text-center">
      {title && (
        <h2 className="mb-2 text-lg font-semibold text-neutral-900">{title}</h2>
      )}
      {children && <p className="text-sm text-neutral-500">{children}</p>}
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </div>
  );
};

export default StateMessage;
