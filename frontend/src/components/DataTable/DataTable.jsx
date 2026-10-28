// Tabla que muestra una lista de datos en filas y columnas.
// Props:
//   columns: columnas: header (título) y key o render (qué mostrar)
//   rows: los datos, una fila por elemento
//   rowKey: nombre del dato que identifica cada fila (por defecto id)
//   empty: mensaje si no hay filas
const DataTable = ({ columns, rows, rowKey = "id", empty }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white shadow-sm">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="bg-neutral-900 text-white">
            {columns.map((column) => (
              <th key={column.header} className="p-3 font-semibold">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 && (
            <tr>
              <td
                colSpan={columns.length}
                className="p-6 text-center text-neutral-400"
              >
                {empty}
              </td>
            </tr>
          )}
          {rows.map((row) => (
            <tr
              key={row[rowKey]}
              className="border-b border-neutral-100 hover:bg-neutral-50"
            >
              {columns.map((column) => (
                <td key={column.header} className="p-3 text-neutral-700">
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
