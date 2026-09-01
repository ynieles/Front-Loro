"use client";

import Modal from "@/components/ui/Modal";
import { Employee } from "@/types/employees.types";
import { DeactivationHistoryItem } from "@/types/models.types";
import { EmployeeService } from "@/services/employee.service";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";

interface EmployeeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  employee: Employee | null;
}

export default function EmployeeDetailsModal({
  isOpen,
  onClose,
  employee,
}: EmployeeDetailsModalProps) {
  const [history, setHistory] = useState<DeactivationHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && employee?.id) {
      setLoadingHistory(true);
      EmployeeService.getHistory(employee.id)
        .then((res) => {
          setHistory(res.data || []);
        })
        .catch((err) => {
          console.error("Error al cargar historial:", err);
          setHistory([]);
        })
        .finally(() => {
          setLoadingHistory(false);
        });
    }
  }, [isOpen, employee]);

  if (!employee) return null;

  const isActivo = Boolean(employee.activo);

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Detalles del Empleado">
      <div className="space-y-4">
        {/* Cabecera */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-gray-50 p-3 rounded-xl border border-gray-200">
          <div>
            <span className="text-[11px] text-gray-500 font-medium uppercase tracking-wider block">
              Nombre Completo
            </span>
            <span className="text-base font-bold text-gray-800">
              {employee.nombre_empleado}
            </span>
          </div>

          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
              isActivo
                ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                : "bg-red-50 text-red-700 border-red-200"
            }`}
          >
            <span
              className={`size-1.5 rounded-full ${
                isActivo ? "bg-emerald-500" : "bg-red-500"
              }`}
            />
            {isActivo ? "Activo" : "Inactivo"}
          </span>
        </div>

        {/* Datos Principales */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs sm:text-sm">
          <div className="bg-white p-2.5 rounded-lg border border-gray-100 shadow-2xs">
            <span className="text-[11px] text-gray-400 font-medium block mb-0.5">
              Cédula de Identidad (CI):
            </span>
            <span className="font-semibold text-gray-800">{employee.ci}</span>
          </div>

          <div className="bg-white p-2.5 rounded-lg border border-gray-100 shadow-2xs">
            <span className="text-[11px] text-gray-400 font-medium block mb-0.5">
              Departamento:
            </span>
            <span className="font-semibold text-gray-800">
              {employee.nombre_departamento || "Sin asignar"}
            </span>
          </div>

          <div className="bg-white p-2.5 rounded-lg border border-gray-100 shadow-2xs">
            <span className="text-[11px] text-gray-400 font-medium block mb-0.5">
              Cargo / Rol:
            </span>
            <span className="font-semibold text-gray-800">
              {employee.nombre_rol || "Sin asignar"}
            </span>
          </div>
        </div>

        {/* Historial de Motivos de Desactivación */}
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <i className="bi bi-clock-history text-gray-500 text-xs" />
            <h4 className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
              Historial de Motivos de Desactivación
            </h4>
          </div>

          {loadingHistory ? (
            <div className="flex justify-center p-3">
              <Spinner className="size-5 text-gray-400" />
            </div>
          ) : history.length === 0 ? (
            <div className="bg-gray-50 p-2.5 rounded-lg border border-gray-200 text-xs text-gray-400 text-center">
              No hay motivos registrados previamente.
            </div>
          ) : (
            <div className="space-y-2 max-h-36 sm:max-h-44 overflow-y-auto pr-1">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="bg-red-50/50 border border-red-100 p-2.5 rounded-lg text-xs space-y-0.5"
                >
                  <div className="flex justify-between items-center text-red-700 font-semibold">
                    <span>Desactivación</span>
                    <span className="text-[10px] text-gray-500 font-normal">
                      {formatDate(item.created_at)}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed font-medium">
                    {item.motivo}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-2 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs sm:text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
}
