"use client";

import { useForm } from "react-hook-form";
import { DepartmentFormData, departmentShema } from "../department.shcema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import Modal from "@/components/ui/Modal";
import Input from "@/components/ui/Input";
import { Spinner } from "@/components/ui/spinner";

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (data: DepartmentFormData) => Promise<boolean | void>;
  serverError?: string;
}

export default function CreateDepartmentModal({
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
  } = useForm<DepartmentFormData>({
    resolver: zodResolver(departmentShema),
    defaultValues: {
      nombre: "",
    },
  });

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  const onSubmit = async (data: DepartmentFormData) => {
    const success = await onRegister(data);
    if (success) {
      reset();
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar Departamento">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          {...register("nombre")}
          name="nombre"
          label="Nombre:"
          error={errors.nombre?.message}
          placeholder="Ej: Compras"
          icon={<i className="bi bi-building text-xl" />}
        />

        {serverError && (
          <div className="col-span-2 mt-2 bg-red-50 border border-red-200 rounded-md p-2 flex items-center gap-3 transition-all animate-in fade-in-50">
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
