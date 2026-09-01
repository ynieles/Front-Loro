"use client";

import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { useRole } from "@/hooks/useRole";
import RoleSelect from "./RoleSelect";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { EmployeeFormData, employeeSchema } from "../employee.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "@/components/ui/spinner";

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (data: EmployeeFormData) => Promise<boolean | void>;
  serverError?: string;
}

export default function CreateEmployeeModal({
  isOpen,
  onClose,
  onRegister,
  serverError,
}: CreateModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      nombre: "",
      ci: "",
      rol_id: "",
    },
  });

  const { roles } = useRole();

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  const onSubmit = async (data: EmployeeFormData) => {
    const success = await onRegister(data);
    if (success) {
      reset();
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar Empleado">
      <form
        onSubmit={handleSubmit(onSubmit)}
        id="registerForm"
        className="grid grid-cols-2 gap-4"
      >
        <Input
          {...register("nombre")}
          name="nombre"
          label="Nombre Completo:"
          placeholder="Ej: Juan Perez"
          icon={<i className="bi bi-person text-xl" />}
          error={errors.nombre?.message}
        />
        <Input
          {...register("ci")}
          name="ci"
          type="number"
          label="Número de Cédula:"
          placeholder="Ej: 00000000"
          icon={<i className="bi bi-person-vcard text-xl" />}
          error={errors.ci?.message}
        />
        <div className="col-span-2">
          <RoleSelect
            {...register("rol_id")}
            roles={roles}
            error={errors.rol_id?.message}
          />
        </div>

        {serverError && (
          <div className="col-span-2 bg-red-50 border border-red-200 rounded-md p-2 flex items-center gap-3 transition-all animate-in fade-in-50">
            <i className="bi bi-exclamation-circle-fill text-red-500 text-lg shrink-0" />
            <p className="text-sm text-red-700 font-medium leading-relaxed">
              {serverError}
            </p>
          </div>
        )}

        <div className="flex justify-end gap-2 pt-4 col-span-2">
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
            className="px-4 py-2 text-sm bg-green-primary hover:bg-green-hover shadow-sm transition-all text-white rounded-md cursor-pointer"
          >
            {isSubmitting ? <Spinner className="size-6" /> : "Guardar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
