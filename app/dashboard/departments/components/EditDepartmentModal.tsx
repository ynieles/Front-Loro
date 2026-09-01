"use client";

import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { DepartmentFormData, departmentShema } from "../department.shcema";
import { Department } from "@/types/department.types";

interface EditDepartmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string | number, data: DepartmentFormData) => Promise<boolean | void>;
  selectedDepartment: Department | null;
  serverError?: string;
}

export default function EditDepartmentModal({
  isOpen,
  onClose,
  onUpdate,
  selectedDepartment,
  serverError,
}: EditDepartmentModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentShema),
  });

  useEffect(() => {
    if (selectedDepartment && isOpen) {
      reset({
        nombre: selectedDepartment.nombre,
      });
    }
  }, [selectedDepartment, isOpen, reset]);

  const onSubmit = async (data: DepartmentFormData) => {
    if (!isDirty) {
      onClose();
      return;
    }

    if (!selectedDepartment || selectedDepartment.id == null) return;
    const success = await onUpdate(selectedDepartment.id, data);
    if (success) {
      reset();
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Departamento">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...register("nombre")}
          label="Nombre del Departamento:"
          placeholder="Ej: Recursos Humanos"
          icon={<i className="bi bi-building text-xl" />}
          error={errors.nombre?.message}
        />

        {serverError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-2 flex items-center gap-3">
            <i className="bi bi-exclamation-circle-fill text-red-500 text-lg shrink-0" />
            <p className="text-sm text-red-700 font-medium">{serverError}</p>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-600 cursor-pointer shadow-sm rounded-md hover:bg-gray-50 transition-all"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isSubmitting || !isDirty}
            className="px-4 py-2 text-sm bg-green-primary hover:bg-green-hover shadow-sm transition-all text-white rounded-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? <Spinner className="size-6" /> : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
