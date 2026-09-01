"use client";

import type { Item } from "../../types/models.types";

interface TableProps {
  columns: ColumnsProps[];
  data: Item[];
  emptyMessage?: string;
  onDelete?: (item: Item) => void;
  onEdit?: (item: Item) => void;
  onView?: (item: Item) => void;
  onRestore?: (item: Item) => void;
}

interface ColumnsProps {
  key: string;
  header: string;
  mobile: boolean;
  render?: (item: Item) => React.ReactNode;
}

export default function Table({
  columns,
  data,
  onDelete,
  onEdit,
  onView,
  onRestore,
  emptyMessage = "No hay datos para mostrar",
}: TableProps) {
  if (!data || data.length === 0) {
    return (
      <div className="w-full bg-white border-t border-gray-200 p-10 text-center text-gray-400 font-medium">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="w-full bg-white shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {/* Encabezado */}
          <thead className="bg-gray-600 border-b border-gray-200">
            <tr className="divide-x divide-white">
              {columns.map((col: ColumnsProps) => (
                <th
                  key={col.key}
                  className={`px-6 py-4 text-center text-xs font-semibold text-white uppercase tracking-wider ${
                    !col.mobile ? "hidden md:table-cell" : ""
                  }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>

          {/* Cuerpo */}
          <tbody className="divide-y divide-slate-100 text-sm text-gray-600">
            {data.map((item: Item) => (
              <tr
                key={item.id}
                className="hover:bg-slate-50/80 transition-colors"
              >
                {columns.map((col: ColumnsProps) => {
                  const isMobileHidden = !col.mobile
                    ? "hidden md:table-cell"
                    : "";

                  return (
                    <td
                      key={col.key}
                      className={`px-6 py-4 text-center whitespace-nowrap ${isMobileHidden}`}
                    >
                      {/* 1. Si la columna tiene una función de renderizado personalizada */}
                      {col.render ? (
                        col.render(item)
                      ) : col.key === "actions" ? (
                        /* 2. Renderizado de acciones estándar */
                        <div className="flex justify-center items-center gap-2">
                          {onView && (
                            <button
                              onClick={() => onView(item)}
                              className="bg-blue-50 text-blue-600 hover:bg-blue-100 p-2.5 rounded-md transition-all cursor-pointer"
                              title="Ver"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-eye"
                                viewBox="0 0 16 16"
                              >
                                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z" />
                                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0" />
                              </svg>
                            </button>
                          )}

                          {onEdit && Boolean(item.activo ?? true) && (
                            <button
                              onClick={() => onEdit(item)}
                              className={`bg-sky-50 text-sky-600 hover:bg-sky-100 p-2.5 rounded-md transition-all cursor-pointer ${col.mobile ? "flex" : "hidden sm:flex"}`}
                              title="Editar"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-pencil-square"
                                viewBox="0 0 16 16"
                              >
                                <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
                                <path
                                  fillRule="evenodd"
                                  d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5z"
                                />
                              </svg>
                            </button>
                          )}

                          {onDelete && Boolean(item.activo) && (
                            <button
                              onClick={() => onDelete(item)}
                              className={`bg-red-50 text-red-500 hover:bg-red-100 p-2.5 rounded-md transition-all cursor-pointer ${col.mobile ? "flex" : "hidden sm:flex"}`}
                              title="Eliminar"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-trash"
                                viewBox="0 0 16 16"
                              >
                                <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                                <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                              </svg>
                            </button>
                          )}

                          {onRestore && !Boolean(item.activo) && (
                            <button
                              onClick={() => onRestore(item)}
                              className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 p-2.5 rounded-md transition-all cursor-pointer"
                              title="Restaurar"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-arrow-clockwise"
                                viewBox="0 0 16 16"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2z"
                                />
                                <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ) : (
                        /* 3. Renderizado normal de datos por clave */
                        String((item as Record<string, unknown>)[col.key] ?? "")
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
