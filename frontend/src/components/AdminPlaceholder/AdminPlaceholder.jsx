// Pantalla temporal para secciones del panel que todavía no tienen su CRUD.
// Props:
//   title: nombre de la sección
const AdminPlaceholder = ({ title }) => {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-6 px-4 py-8 sm:px-6">
      <header>
        <h1 className="text-xl font-semibold text-neutral-900">{title}</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Esta sección todavía está en construcción.
        </p>
      </header>
      <div className="rounded-xl border border-dashed border-neutral-300 bg-white p-8 text-center text-sm text-neutral-500">
        Próximamente podrás administrar {title.toLowerCase()} desde acá.
      </div>
    </div>
  );
};

export default AdminPlaceholder;