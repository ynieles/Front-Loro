"use client";

import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { RoleFormData, roleSchema } from "../role.schema";
import { useDepartment } from "@/hooks/useDepartment";
import DepartmentSelect from "./DepartmentSelect";

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (data: RoleFormData) => Promise<boolean | void>;
  serverError?: string;
}

export default function CreateRoleModal({
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
  } = useForm<RoleFormData>({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      nombre: "",
      departamento_id: "",
    },
  });

  const { departments } = useDepartment();

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  const onSubmit = async (data: RoleFormData) => {
    const success = await onRegister(data);
    if (success) {
      reset();
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar Cargo / Rol">
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
          <div className="bg-red-50 border border-red-200 rounded-md p-2 flex items-center gap-3 transition-all animate-in fade-in-50">
            <i className="bi bi-exclamation-circle-fill text-red-500 text-lg shrink-0" />
            <p className="text-sm text-red-700 font-medium leading-relaxed">
              {serverError}
            </p>
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
            disabled={isSubmitting}
            className="px-4 py-2 text-sm bg-green-primary hover:bg-green-hover shadow-sm transition-all text-white rounded-md cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? <Spinner className="size-6" /> : "Guardar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
