"use client";

import { useCurrentUser } from "@/hooks/useCurrentUser";
import { useListAssignments } from "./assignments/hooks/useListAssignment";
import { useListDevice } from "./devices/hooks/useListDevice";
import { useListEmployee } from "./employees/hooks/useListEmployee";
import { Spinner } from "@/components/ui/spinner";
import Table from "@/components/ui/Table";
import { SkeletonTable } from "@/components/ui/SkeletonTable";
import { Item } from "@/types/models.types";
import Link from "next/link";

const recentColumns = [
  {
    key: "codigo_equipo",
    header: "Equipo",
    mobile: true,
    render: (item: Item) => (
      <div className="text-left">
        <span className="font-bold text-gray-800 block text-xs sm:text-sm">
          {(item.codigo_equipo as string) || "N/A"}
        </span>
        <span className="text-xs text-gray-500">
          {(item.nombre_equipo as string) || "Sin nombre"}
        </span>
      </div>
    ),
  },
  {
    key: "nombre_empleado",
    header: "Empleado",
    mobile: true,
    render: (item: Item) => (
      <div className="text-left">
        <span className="font-semibold text-gray-800 block text-xs sm:text-sm">
          {(item.nombre_empleado as string) || "Empleado"}
        </span>
        {Boolean(item.cedula_empleado) && (
          <span className="text-xs text-gray-400">
            CI: {item.cedula_empleado as string}
          </span>
        )}
      </div>
    ),
  },
  {
    key: "fecha_inicio",
    header: "Fecha Entrega",
    mobile: false,
    render: (item: Item) => {
      const dateStr = item.fecha_inicio as string;
      if (!dateStr) return <span className="text-xs text-gray-400">N/A</span>;
      try {
        const d = new Date(dateStr);
        return (
          <span className="text-xs text-gray-600 font-medium">
            {d.toLocaleDateString("es-ES", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </span>
        );
      } catch {
        return <span className="text-xs text-gray-600">{dateStr}</span>;
      }
    },
  },
  {
    key: "activo",
    header: "Estado",
    mobile: false,
    render: (item: Item) => {
      const isActivo = Boolean(item.activo);
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${
            isActivo
              ? "bg-emerald-50 text-emerald-700 border-emerald-200"
              : "bg-gray-100 text-gray-600 border-gray-300"
          }`}
        >
          <span
            className={`size-1.5 rounded-full ${
              isActivo ? "bg-emerald-500 animate-pulse" : "bg-gray-400"
            }`}
          />
          {isActivo ? "Activa" : "Devuelta"}
        </span>
      );
    },
  },
];

function Dashboard() {
  const { totals: totalsEmployees, isLoading: loadingEmployees } =
    useListEmployee();
  const {
    assignments,
    totals: totalsAssignments,
    isLoading: loadingAssignments,
  } = useListAssignments();
  const { totals: totalsDevices, isLoading: loadingDevices } = useListDevice();

  const { user } = useCurrentUser();

  const recentAssignments = assignments.slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Banner de Bienvenida */}
      <div className="p-6 bg-green-primary rounded-xl text-white shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-wide">
            ¡Bienvenido de nuevo, {user?.nombre || "Usuario"}!
          </h2>
          <p className="text-gray-50 text-sm mt-1">
            Sistema de inventario{" "}
            <span className="font-semibold text-white">El Loro C.A</span>.
          </p>
        </div>
        <i className="bi bi-boxes text-3xl md:text-4xl"></i>
      </div>

      {/* Tarjetas KPI */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <div className="border border-gray-200 bg-white rounded-xl p-6 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-lg bg-blue-50 text-blue-800 flex items-center justify-center">
            <i className="bi bi-pc-display text-2xl" />
          </div>
          <div>
            <p className="uppercase font-semibold text-gray-500 text-xs tracking-wider">
              Total de equipos
            </p>
            {loadingDevices ? (
              <Spinner className="w-6 h-6" />
            ) : (
              <p className="text-3xl font-bold">{totalsDevices.activos}</p>
            )}
          </div>
        </div>
        <div className="border border-gray-200 bg-white rounded-xl p-6 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-lg flex items-center bg-green-50 text-green-800 justify-center">
            <i className="bi bi-people-fill text-2xl" />
          </div>
          <div>
            <p className="uppercase font-semibold text-gray-500 text-xs tracking-wider">
              Total de empleados
            </p>
            {loadingEmployees ? (
              <Spinner className="w-6 h-6" />
            ) : (
              <p className="text-3xl font-bold">{totalsEmployees.activos}</p>
            )}
          </div>
        </div>
        <div className="border border-gray-200 bg-white rounded-xl p-6 flex flex-col gap-3 shadow-sm hover:shadow-md transition-shadow">
          <div className="w-12 h-12 rounded-lg flex items-center bg-yellow-50 text-yellow-800 justify-center">
            <i className="bi-person-workspace text-2xl" />
          </div>
          <div>
            <p className="uppercase font-semibold text-gray-500 text-xs tracking-wider">
              Total de Asignaciones
            </p>
            {loadingAssignments ? (
              <Spinner className="w-6 h-6" />
            ) : (
              <p className="text-3xl font-bold">{totalsAssignments.activos}</p>
            )}
          </div>
        </div>
      </div>

      {/* Tabla de 3 Últimas Asignaciones */}
      <div className="bg-white border border-gray-200 rounded-xl flex flex-col shadow-xs overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50/50">
          <div className="flex items-center gap-2">
            <i className="bi bi-person-workspace text-green-primary text-xl" />
            <h3 className="text-base font-semibold text-gray-800 tracking-wide">
              Últimas Asignaciones Realizadas
            </h3>
          </div>
          <Link
            href="/dashboard/assignments"
            className="text-xs font-semibold text-green-primary hover:text-green-hover flex items-center gap-1 transition-colors"
          >
            Ver todas <i className="bi bi-arrow-right" />
          </Link>
        </div>

        {loadingAssignments ? (
          <SkeletonTable />
        ) : (
          <Table
            columns={recentColumns}
            data={recentAssignments}
            emptyMessage="No hay asignaciones registradas recientemente"
          />
        )}
      </div>
    </div>
  );
}

export default Dashboard;
