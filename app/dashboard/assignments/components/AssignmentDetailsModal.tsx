"use client";

import Modal from "@/components/ui/Modal";
import { Assignment } from "@/types/assignment.types";
import { DeactivationHistoryItem } from "@/types/models.types";
import { AssignmentService } from "@/services/assignment.service";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";

interface AssignmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: Assignment | null;
  onOpenReceipt?: (assignment: Assignment) => void;
}

export default function AssignmentDetailsModal({
  isOpen,
  onClose,
  assignment,
  onOpenReceipt,
}: AssignmentDetailsModalProps) {
  const [history, setHistory] = useState<DeactivationHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && assignment?.id) {
      setLoadingHistory(true);
      AssignmentService.getHistory(assignment.id)
        .then((res) => {
          setHistory(res.data || []);
        })
        .catch((err) => {
          console.error("Error al cargar historial de la asignación:", err);
          setHistory([]);
        })
        .finally(() => {
          setLoadingHistory(false);
        });
    }
  }, [isOpen, assignment]);

  if (!assignment) return null;

  const isActiva = Boolean(assignment.activo);

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return "N/A";
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalle de Asignación / Custodia"
    >
      <div className="space-y-4">
        {/* Cabecera / Estado */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-gray-50 p-3 rounded-xl border border-gray-200">
          <div>
            <span className="text-[11px] text-gray-500 font-medium uppercase tracking-wider block">
              Estado de Custodia
            </span>
            <span
              className={`inline-flex items-center gap-1.5 mt-0.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                isActiva
                  ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                  : "bg-gray-100 text-gray-600 border-gray-300"
              }`}
            >
              <span
                className={`size-1.5 rounded-full ${
                  isActiva ? "bg-emerald-500 animate-pulse" : "bg-gray-400"
                }`}
              />
              {isActiva ? "Asignación Activa" : "Finalizada / Devuelta"}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-gray-500 font-medium uppercase tracking-wider block">
              ID Asignación
            </span>
            <span className="text-base font-bold text-gray-800">
              #{assignment.id}
            </span>
          </div>
        </div>

        {/* Informaciones (Empleado y Equipo) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
          <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-2xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-green-primary font-bold text-xs border-b border-gray-100 pb-1.5">
              <i className="bi bi-person-badge-fill text-sm" />
              <span>Empleado Responsable</span>
            </div>
            <div>
              <span className="text-[11px] text-gray-400 font-medium block">
                Nombre:
              </span>
              <span className="font-semibold text-gray-800">
                {assignment.nombre_empleado}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-gray-400 font-medium block">
                Cédula:
              </span>
              <span className="font-semibold text-gray-800">
                {assignment.cedula_empleado}
              </span>
            </div>
            {assignment.nombre_departamento && (
              <div>
                <span className="text-[11px] text-gray-400 font-medium block">
                  Departamento:
                </span>
                <span className="font-semibold text-gray-800">
                  {assignment.nombre_departamento}
                </span>
              </div>
            )}
          </div>

          <div className="bg-white p-3 rounded-xl border border-gray-200 shadow-2xs space-y-1.5">
            <div className="flex items-center gap-1.5 text-blue-600 font-bold text-xs border-b border-gray-100 pb-1.5">
              <i className="bi bi-laptop-fill text-sm" />
              <span>Equipo Custodiado</span>
            </div>
            <div>
              <span className="text-[11px] text-gray-400 font-medium block">
                Código Inventario:
              </span>
              <span className="font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded text-[11px]">
                {assignment.codigo_equipo}
              </span>
            </div>
            <div>
              <span className="text-[11px] text-gray-400 font-medium block">
                Nombre / Descripción:
              </span>
              <span className="font-semibold text-gray-800">
                {assignment.nombre_equipo}
              </span>
            </div>
            {assignment.modelo_equipo && (
              <div>
                <span className="text-[11px] text-gray-400 font-medium block">
                  Modelo:
                </span>
                <span className="font-semibold text-gray-800">
                  {assignment.modelo_equipo}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Fechas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-gray-50 p-3 rounded-xl border border-gray-200">
          <div>
            <span className="text-[11px] text-gray-500 font-medium uppercase tracking-wider block mb-0.5">
              Fecha de Inicio (Entrega)
            </span>
            <span className="font-semibold text-gray-800 flex items-center gap-1.5">
              <i className="bi bi-calendar-check text-emerald-600 text-xs" />
              {formatDate(assignment.fecha_inicio)}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-gray-500 font-medium uppercase tracking-wider block mb-0.5">
              Fecha de Devolución
            </span>
            <span className="font-semibold text-gray-800 flex items-center gap-1.5">
              <i className="bi bi-calendar-x text-amber-600 text-xs" />
              {formatDate(assignment.fecha_fin)}
            </span>
          </div>
        </div>

        {/* Historial de Motivos de Finalización */}
        <div className="space-y-2 pt-2 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <i className="bi bi-clock-history text-gray-500 text-xs" />
            <h4 className="text-[11px] font-bold text-gray-700 uppercase tracking-wider">
              Historial de Motivos de Finalización
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
            <div className="space-y-2 max-h-36 sm:max-h-44 overflow-y-auto pr-1 scrollbar-thin">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="bg-red-50/50 border border-red-100 p-2.5 rounded-lg text-xs space-y-0.5"
                >
                  <div className="flex justify-between items-center text-red-700 font-semibold">
                    <span>Finalización</span>
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

        {/* Footer Buttons */}
        <div className="flex flex-wrap justify-between items-center gap-2 pt-2 border-t border-gray-100">
          {onOpenReceipt && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenReceipt(assignment);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
            >
              <i className="bi bi-file-earmark-pdf-fill text-xs" />
              <span>Ver Ficha (PDF)</span>
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs sm:text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors cursor-pointer ml-auto"
          >
            Cerrar
          </button>
        </div>
      </div>
    </Modal>
  );
}

