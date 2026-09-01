"use client";

import Modal from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { AssignmentFormData, assignmentSchema } from "../assignment.schema";
import { EmployeeService } from "@/services/employee.service";
import { DeviceService } from "@/services/device.service";
import { Employee } from "@/types/employees.types";
import { Device } from "@/types/devices.types";

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (data: AssignmentFormData) => Promise<boolean | void>;
  serverError?: string;
}

export default function CreateAssignmentModal({
  isOpen,
  onClose,
  onRegister,
  serverError,
}: CreateModalProps) {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      empleado_id: "",
      equipo_id: "",
    },
  });

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoadingOptions, setIsLoadingOptions] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      const loadOptions = async () => {
        setIsLoadingOptions(true);
        try {
          const [empRes, devRes] = await Promise.all([
            EmployeeService.getAll({ limit: "100", activo: true }),
            DeviceService.getAll({ limit: "100", activo: true }),
          ]);

          setEmployees(empRes.data || []);
          // Filtrar equipos que no estén ya asignados
          const availableDevices = (devRes.data || []).filter(
            (d: Device) => d.estado !== "Asignado",
          );
          setDevices(availableDevices);
        } catch (err) {
          console.error("Error al cargar opciones de asignación:", err);
        } finally {
          setIsLoadingOptions(false);
        }
      };

      loadOptions();
    } else {
      reset();
    }
  }, [isOpen, reset]);

  const onSubmit = async (data: AssignmentFormData) => {
    const success = await onRegister(data);
    if (success) {
      reset();
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Registrar Asignación / Custodia"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {isLoadingOptions ? (
          <div className="flex flex-col items-center justify-center py-8 gap-2 text-gray-500 text-sm">
            <Spinner className="size-6 text-green-primary" />
            <span>Cargando empleados y equipos disponibles...</span>
          </div>
        ) : (
          <>
            {/* Select Empleado */}
            <div className="space-y-1 w-full">
              <label className="block text-sm font-medium text-gray-700">
                Empleado Responsable: <span className="text-red-500">*</span>
              </label>
              <select
                {...register("empleado_id")}
                className={`w-full bg-gray-50 border ${
                  errors.empleado_id
                    ? "border-red-500 focus:ring-red-500/20"
                    : "border-gray-200 focus:border-green-primary focus:ring-green-600/20"
                } px-3 py-2 rounded-md transition-all outline-none text-sm`}
              >
                <option value="" disabled>
                  -- Seleccione un empleado --
                </option>
                {employees.map((emp) => (
                  <option key={emp.id} value={String(emp.id)}>
                    {`${emp.nombre_empleado || "Empleado"} (${emp.ci || ""}) - ${emp.nombre_departamento || "Sin Depto"}`}
                  </option>
                ))}
              </select>
              {errors.empleado_id && (
                <p className="text-xs text-red-600 font-medium">
                  {errors.empleado_id.message}
                </p>
              )}
            </div>

            {/* Select Equipo Disponible */}
            <div className="space-y-1 w-full">
              <label className="block text-sm font-medium text-gray-700">
                Equipo / Dispositivo a Asignar:{" "}
                <span className="text-red-500">*</span>
              </label>
              <select
                {...register("equipo_id")}
                className={`w-full bg-gray-50 border ${
                  errors.equipo_id
                    ? "border-red-500 focus:ring-red-500/20"
                    : "border-gray-200 focus:border-green-primary focus:ring-green-600/20"
                } px-3 py-2 rounded-md transition-all outline-none text-sm`}
              >
                <option value="" disabled>
                  {devices.length > 0
                    ? "-- Seleccione un equipo disponible --"
                    : "-- No hay equipos disponibles actualmente --"}
                </option>
                {devices.map((dev) => (
                  <option key={dev.id} value={String(dev.id)}>
                    {`[${dev.codigo_inventario}] ${dev.nombre || "Equipo"}${dev.modelo ? ` - ${dev.modelo}` : ""}`}
                  </option>
                ))}
              </select>
              {errors.equipo_id && (
                <p className="text-xs text-red-600 font-medium">
                  {errors.equipo_id.message}
                </p>
              )}
            </div>
          </>
        )}

        {serverError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm font-medium">
            {serverError}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-all"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting || isLoadingOptions}
            className="inline-flex cursor-pointer items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-green-primary hover:bg-green-hover rounded-md shadow-sm transition-all disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <Spinner className="size-4 text-white" />
                <span>Asignando...</span>
              </>
            ) : (
              <span>Asignar Equipo</span>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
