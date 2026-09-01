"use client";

import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { DeviceFormData, deviceSchema } from "../device.schema";
import { useDepartment } from "@/hooks/useDepartment";
import { useCategory } from "@/hooks/useCategory";
import CategorySelect from "./CategorySelect";
import DepartmentSelect from "../../roles/components/DepartmentSelect";

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (data: DeviceFormData) => Promise<boolean | void>;
  serverError?: string;
}

export default function CreateDeviceModal({
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
  } = useForm<DeviceFormData>({
    resolver: zodResolver(deviceSchema),
    defaultValues: {
      codigo_inventario: "",
      nombre: "",
      categoria_id: "",
      departamento_id: "",
      modelo: "",
      ram: "",
      rom: "",
      numero_telefono: "",
      imei: "",
      observaciones: "",
    },
  });

  const { departments } = useDepartment();
  const { categories } = useCategory();

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  const onSubmit = async (data: DeviceFormData) => {
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
      title="Registrar Equipo / Dispositivo"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-4 max-h-[75vh] overflow-y-auto pr-1"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            {...register("codigo_inventario")}
            label="Código de Inventario:"
            placeholder="Ej: EQ-001"
            error={errors.codigo_inventario?.message}
          />

          <Input
            {...register("nombre")}
            label="Nombre del Equipo:"
            placeholder="Ej: Laptop Dell XPS"
            error={errors.nombre?.message}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <CategorySelect
            {...register("categoria_id")}
            categories={categories}
            error={errors.categoria_id?.message}
          />

          <DepartmentSelect
            {...register("departamento_id")}
            departments={departments}
            error={errors.departamento_id?.message}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            {...register("modelo")}
            label="Modelo:"
            placeholder="Ej: XPS 13"
            error={errors.modelo?.message}
          />
          <Input
            {...register("ram")}
            label="RAM:"
            placeholder="Ej: 16GB"
            error={errors.ram?.message}
          />
          <Input
            {...register("rom")}
            label="ROM:"
            placeholder="Ej: 512GB SSD"
            error={errors.rom?.message}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            {...register("numero_telefono")}
            label="Número de Teléfono:"
            placeholder="Ej: 0412..."
            error={errors.numero_telefono?.message}
          />
          <Input
            {...register("imei")}
            label="IMEI / Serial:"
            placeholder="Ej: 8642..."
            error={errors.imei?.message}
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Observaciones:
          </label>
          <textarea
            {...register("observaciones")}
            placeholder="Detalles adicionales del equipo..."
            rows={2}
            className="w-full bg-gray-50 border border-gray-200 focus:border-green-primary focus:ring-green-600/20 px-3 py-2 rounded-md text-sm outline-none transition-all"
          />
        </div>

        {serverError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-2 flex items-center gap-3 transition-all animate-in fade-in-50">
            <i className="bi bi-exclamation-circle-fill text-red-500 text-lg shrink-0" />
            <p className="text-sm text-red-700 font-medium leading-relaxed">
              {serverError}
            </p>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4 border-t border-gray-100">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 cursor-pointer shadow-sm rounded-md hover:bg-gray-50 transition-all"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm bg-green-primary hover:bg-green-hover shadow-sm transition-all text-white rounded-md cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? <Spinner className="size-6" /> : "Guardar Equipo"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
