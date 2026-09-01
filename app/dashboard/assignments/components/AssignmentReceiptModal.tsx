"use client";

import Modal from "@/components/ui/Modal";
import { Assignment } from "@/types/assignment.types";

interface AssignmentReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment: Assignment | null;
}

export default function AssignmentReceiptModal({
  isOpen,
  onClose,
  assignment,
}: AssignmentReceiptModalProps) {
  if (!assignment) return null;

  const formatDate = (dateStr?: string | null) => {
    if (!dateStr) return new Date().toLocaleDateString("es-ES");
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateStr;
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const actaNumber = String(assignment.id).padStart(4, "0");

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Exportar Ficha de Entrega (PDF)"
    >
      <div className="space-y-4">
        {/* Estilos CSS para Impresión vs Pantalla */}
        <style jsx global>{`
          /* En pantalla: ocultar el documento largo de impresión */
          .full-receipt-pdf {
            display: none;
          }

          /* En impresión: ocultar todo el sistema y mostrar solo la Acta Completa en formato A4 */
          @media print {
            body * {
              visibility: hidden !important;
            }
            .full-receipt-pdf,
            .full-receipt-pdf * {
              visibility: visible !important;
              display: block !important;
            }
            .full-receipt-pdf {
              position: absolute !important;
              left: 0 !important;
              top: 0 !important;
              width: 100% !important;
              padding: 30px !important;
              margin: 0 !important;
              background: white !important;
              color: black !important;
              box-shadow: none !important;
              border: none !important;
            }
            .full-receipt-pdf .grid-2 {
              display: grid !important;
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
              gap: 1.5rem !important;
            }
            .screen-only-modal {
              display: none !important;
            }
          }
        `}</style>

        {/* 1. VISTA EN PANTALLA (Resumen Compacto) */}
        <div className="screen-only-modal space-y-4">
          <div className="bg-emerald-50/60 p-3 rounded-xl border border-emerald-200/80 flex items-center gap-3">
            <div className="size-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
              <i className="bi bi-file-earmark-pdf-fill text-lg" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                Ficha de Custodia N° #{actaNumber}
              </h4>
            </div>
          </div>

          {/* Tarjeta de Resumen Breve */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 text-xs space-y-2">
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-500 font-medium">Empleado:</span>
              <span className="font-bold text-gray-800">
                {assignment.nombre_empleado} (
                {assignment.cedula_empleado || "Sin CI"})
              </span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-500 font-medium">Equipo:</span>
              <span className="font-bold text-blue-700">
                {assignment.codigo_equipo} {assignment.nombre_equipo}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-medium">
                Fecha de Entrega:
              </span>
              <span className="font-semibold text-gray-700">
                {formatDate(assignment.fecha_inicio)}
              </span>
            </div>
          </div>

          {/* Botones de Acción */}
          <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-green-primary hover:bg-green-hover rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <i className="bi bi-printer text-sm" />
              <span>Imprimir</span>
            </button>
          </div>
        </div>

        {/* 2. DOCUMENTO COMPLETO PARA IMPRESIÓN / GENERACIÓN DE PDF */}
        <div className="full-receipt-pdf space-y-6 text-gray-900 text-xs">
          {/* Encabezado */}
          <div className="border-b-2 border-gray-900 pb-3 flex justify-between items-start">
            <div>
              <h1 className="text-lg font-bold uppercase tracking-wider text-gray-900">
                Acta de Entrega y Custodia de Equipo Tecnológico
              </h1>
              <p className="text-[11px] text-gray-600 font-medium">
                Dispositivo Tecnolológico
              </p>
            </div>
            <div className="text-right">
              <div className="inline-block bg-gray-100 text-gray-900 font-mono font-bold px-3 py-1 rounded border border-gray-400 text-xs">
                N° ACTA: #{actaNumber}
              </div>
              <p className="text-[10px] text-gray-500 mt-1">
                Fecha: {formatDate(assignment.fecha_inicio)}
              </p>
            </div>
          </div>

          {/* Sección 1: Datos del Empleado */}
          <div className="space-y-1.5">
            <h2 className="text-[11px] font-bold uppercase text-gray-700 border-b border-gray-200 pb-0.5">
              1. Datos del Empleado Responsable (Receptor)
            </h2>
            <div className="grid-2 bg-gray-50 p-3 rounded border border-gray-200">
              <div>
                <span className="text-gray-500 font-medium block">
                  Quien entrega:
                </span>
                <span className="font-bold text-gray-900 text-xs">Soporte</span>
              </div>
              <div>
                <span className="text-gray-500 font-medium block">
                  Nombre Completo:
                </span>
                <span className="font-bold text-gray-900 text-xs">
                  {assignment.nombre_empleado}
                </span>
              </div>
              <div>
                <span className="text-gray-500 font-medium block">
                  Cédula de Identidad (CI):
                </span>
                <span className="font-semibold text-gray-900">
                  {assignment.cedula_empleado || "N/A"}
                </span>
              </div>
              <div>
                <span className="text-gray-500 font-medium block">
                  Departamento / Área:
                </span>
                <span className="font-semibold text-gray-900">
                  {assignment.nombre_departamento || "Sin especificar"}
                </span>
              </div>
            </div>
          </div>

          {/* Sección 2: Datos del Equipo */}
          <div className="space-y-1.5">
            <h2 className="text-[11px] font-bold uppercase text-gray-700 border-b border-gray-200 pb-0.5">
              2. Datos del Equipo / Activo Custodiado
            </h2>
            <div className="grid-2 bg-gray-50 p-3 rounded border border-gray-200">
              <div>
                <span className="text-gray-500 font-medium block">
                  Código de Inventario:
                </span>
                <span className="font-bold text-blue-800">
                  {assignment.codigo_equipo}
                </span>
              </div>
              <div>
                <span className="text-gray-500 font-medium block">Nombre:</span>
                <span className="font-semibold text-gray-900">
                  {assignment.nombre_equipo}
                </span>
              </div>
              {assignment.modelo_equipo && (
                <div>
                  <span className="text-gray-500 font-medium block">
                    Modelo / Marca:
                  </span>
                  <span className="font-semibold text-gray-900">
                    {assignment.modelo_equipo}
                  </span>
                </div>
              )}
              <div>
                <span className="text-gray-500 font-medium block">
                  Fecha de Entrega:
                </span>
                <span className="font-semibold text-gray-900">
                  {formatDate(assignment.fecha_inicio)}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-[11px] font-bold uppercase text-gray-700 border-b border-gray-200 pb-0.5">
              3. Estado del equipo y accesorios
            </h2>
            <div className="grid-2 bg-gray-50 p-3 rounded border border-gray-200">
              <div>
                <span className="text-gray-500 font-medium block">Estado:</span>
                <span className="text-gray-900 font-medium block">
                  Nuevo [ ] Buen estado [ ] Excelente [ ] Con detalles [ ]
                </span>
              </div>
              <div>
                <span className="text-gray-500 font-medium block">
                  Accesorios:
                </span>
                <span className="font-semibold text-gray-900">
                  Cargador [ ] Estuche [ ] Mouse [ ] Cable USB [ ]
                </span>
              </div>
              <div>
                <span>Observaciones:</span>
              </div>
            </div>
          </div>

          {/* Sección 3: Cláusula de Responsabilidad */}
          <div className="bg-gray-50 p-3 rounded border border-gray-300 text-[10.5px] leading-relaxed text-gray-800">
            <p className="font-bold uppercase tracking-tight mb-1 text-gray-900">
              Compromiso de Custodia y Responsabilidad:
            </p>
            <p>
              El empleado declara haber recibido en conformidad y perfecto
              estado operativo el equipo detallado. Se compromete a utilizarlo
              de manera exclusiva para fines laborales, asumir el debido cuidado
              y custodia del activo, e informar de inmediato cualquier falla o
              eventualidad a la Coordinación de TI. Asimismo, se obliga a
              restituir el equipo en el momento en que cese su relación laboral
              o cuando la institución lo requiera.
            </p>
          </div>

          {/* Sección 4: Bloque de Firmas */}
          <div className="pt-16 grid-2 text-center text-xs">
            <div className="space-y-12">
              <div className="border-b-2 border-gray-900 w-3/4 mx-auto" />
              <div>
                <p className="font-bold text-gray-900">ENTREGADO POR</p>
                <p className="text-gray-600 text-[11px]">
                  Responsable de Soporte
                </p>
                <p className="text-gray-400 text-[10px] mt-1">Firma</p>
              </div>
            </div>

            <div className="space-y-12">
              <div className="border-b-2 border-gray-900 w-3/4 mx-auto" />
              <div>
                <p className="font-bold text-gray-900">
                  RECIBIDO POR (CONFORME)
                </p>
                <p className="text-gray-700 font-semibold text-[11px]">
                  {assignment.nombre_empleado}
                </p>
                <p className="text-gray-500 text-[10px]">
                  CI: {assignment.cedula_empleado || "_______________"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
