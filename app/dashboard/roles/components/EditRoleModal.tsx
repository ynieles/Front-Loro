"use client";

import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { RoleFormData, roleSchema } from "../role.schema";
import { Role } from "@/types/roles.types";
import { useDepartment } from "@/hooks/useDepartment";
import DepartmentSelect from "./DepartmentSelect";

interface EditRoleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string | number, data: RoleFormData) => Promise<boolean | void>;
  selectedRole: Role | null;
  serverError?: string;
}

export default function EditRoleModal({
  isOpen,
  onClose,
  onUpdate,
  selectedRole,
  serverError,
}: EditRoleModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
  });

  const { departments } = useDepartment();

  useEffect(() => {
    if (selectedRole && isOpen) {
      reset({
        nombre: selectedRole.nombre_rol,
        departamento_id: selectedRole.departamento_id ? String(selectedRole.departamento_id) : "",
      });
    }
  }, [selectedRole, isOpen, departments, reset]);

  const onSubmit = async (data: RoleFormData) => {
    if (!isDirty) {
      onClose();
      return;
    }

    if (!selectedRole || selectedRole.id == null) return;
    const success = await onUpdate(selectedRole.id, data);
    if (success) {
      reset();
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Cargo / Rol">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...register("nombre")}
          label="Nombre del Cargo / Rol:"
          placeholder="Ej: Administrador, Técnico"
          icon={<i className="bi bi-person-badge text-xl" />}
          error={errors.nombre?.message}
        />

        <DepartmentSelect
          {...register("departamento_id")}
          departments={departments}
          error={errors.departamento_id?.message}
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
