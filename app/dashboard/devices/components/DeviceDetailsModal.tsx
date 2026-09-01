"use client";

import Modal from "@/components/ui/Modal";
import { Device } from "@/types/devices.types";
import { DeactivationHistoryItem } from "@/types/models.types";
import { DeviceService } from "@/services/device.service";
import { useEffect, useState } from "react";
import { Spinner } from "@/components/ui/spinner";

interface DeviceDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  device: Device | null;
}

export default function DeviceDetailsModal({
  isOpen,
  onClose,
  device,
}: DeviceDetailsModalProps) {
  const [history, setHistory] = useState<DeactivationHistoryItem[]>([]);
  const [loadingHistory, setLoadingHistory] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen && device?.id) {
      setLoadingHistory(true);
      DeviceService.getHistory(device.id)
        .then((res) => {
          setHistory(res.data || []);
        })
        .catch((err) => {
          console.error("Error al cargar historial del equipo:", err);
          setHistory([]);
        })
        .finally(() => {
          setLoadingHistory(false);
        });
    }
  }, [isOpen, device]);

  if (!device) return null;

  const isActivo = Boolean(device.activo);
  const isAsignado = device.estado === "Asignado";

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
    <Modal isOpen={isOpen} onClose={onClose} title="Detalles del Equipo">
      <div className="space-y-4">
        {/* Cabecera con Código y Badges */}
        <div className="flex flex-wrap items-center justify-between gap-2 bg-gray-50 p-3 rounded-xl border border-gray-200">
          <div>
            <span className="text-[11px] text-gray-500 font-medium uppercase tracking-wider block">
              Código de Inventario
            </span>
            <span className="text-base font-bold text-gray-800">
              {device.codigo_inventario}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Badge Disponibilidad */}
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${
                isAsignado
                  ? "bg-amber-50 text-amber-700 border-amber-200"
                  : "bg-blue-50 text-blue-700 border-blue-200"
              }`}
            >
              <span
                className={`size-1.5 rounded-full ${
                  isAsignado ? "bg-amber-500" : "bg-blue-500"
                }`}
              />
              {device.estado || "Disponible"}
            </span>

            {/* Badge Estado Sistema */}
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${
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
        </div>

        {/* Grid de Información Principal */}
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
          <div className="bg-white p-2.5 rounded-lg border border-gray-100 shadow-2xs">
            <span className="text-[11px] text-gray-400 font-medium block mb-0.5">
              Nombre del Equipo:
            </span>
            <span className="font-semibold text-gray-800">
              {device.nombre || "Sin especificar"}
            </span>
          </div>

          <div className="bg-white p-2.5 rounded-lg border border-gray-100 shadow-2xs">
            <span className="text-[11px] text-gray-400 font-medium block mb-0.5">
              Categoría:
            </span>
            <span className="font-semibold text-gray-800">
              {device.nombre_categoria || "Sin categoría"}
            </span>
          </div>

          <div className="bg-white p-2.5 rounded-lg border border-gray-100 shadow-2xs">
            <span className="text-[11px] text-gray-400 font-medium block mb-0.5">
              Departamento:
            </span>
            <span className="font-semibold text-gray-800">
              {device.nombre_departamento || "Sin departamento"}
            </span>
          </div>

          <div className="bg-white p-2.5 rounded-lg border border-gray-100 shadow-2xs">
            <span className="text-[11px] text-gray-400 font-medium block mb-0.5">
              Modelo:
            </span>
            <span className="font-semibold text-gray-800">
              {device.modelo || "Sin especificar"}
            </span>
          </div>

          {/* Especificaciones Técnicas (RAM/ROM) */}
          {device.ram && (
            <div className="bg-white p-2.5 rounded-lg border border-gray-100 shadow-2xs">
              <span className="text-[11px] text-gray-400 font-medium block mb-0.5">
                Memoria RAM:
              </span>
              <span className="font-semibold text-gray-800">{device.ram}</span>
            </div>
          )}

          {device.rom && (
            <div className="bg-white p-2.5 rounded-lg border border-gray-100 shadow-2xs">
              <span className="text-[11px] text-gray-400 font-medium block mb-0.5">
                Almacenamiento (ROM):
              </span>
              <span className="font-semibold text-gray-800">{device.rom}</span>
            </div>
          )}

          {/* Datos de Telefonía */}
          {device.numero_telefono && (
            <div className="bg-white p-2.5 rounded-lg border border-gray-100 shadow-2xs">
              <span className="text-[11px] text-gray-400 font-medium block mb-0.5">
                Número Telefónico:
              </span>
              <span className="font-semibold text-emerald-700 flex items-center gap-1.5">
                <i className="bi bi-telephone-fill text-xs" />
                {device.numero_telefono}
              </span>
            </div>
          )}

          {device.imei && (
            <div className="bg-white p-2.5 rounded-lg border border-gray-100 shadow-2xs">
              <span className="text-[11px] text-gray-400 font-medium block mb-0.5">
                IMEI / Serial:
              </span>
              <span className="font-semibold text-gray-800 font-mono text-xs">
                {device.imei}
              </span>
            </div>
          )}
        </div>

        {/* Observaciones */}
        {device.observaciones && (
          <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200 text-xs">
            <span className="text-[11px] text-gray-500 font-semibold uppercase tracking-wider block mb-0.5">
              Observaciones
            </span>
            <p className="text-gray-700 whitespace-pre-line leading-relaxed">
              {device.observaciones}
            </p>
          </div>
        )}

        {/* Historial de Motivos de Baja / Desactivación */}
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

        {/* Pie del Modal */}
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

