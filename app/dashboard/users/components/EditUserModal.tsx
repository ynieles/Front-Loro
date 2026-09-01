"use client";

import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { EditUserFormData, editUserSchema } from "../user.schema";
import { User } from "@/types/users.types";

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string | number, data: EditUserFormData) => Promise<boolean | void>;
  selectedUser: User | null;
  serverError?: string;
}

export default function EditUserModal({
  isOpen,
  onClose,
  onUpdate,
  selectedUser,
  serverError,
}: EditUserModalProps) {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: {
      nombre: "",
      rol: "user",
    },
  });

  useEffect(() => {
    if (selectedUser) {
      reset({
        nombre: selectedUser.nombre || "",
        rol: selectedUser.rol || "user",
      });
    }
  }, [selectedUser, reset]);

  const onSubmit = async (data: EditUserFormData) => {
    if (!selectedUser?.id) return;
    const success = await onUpdate(selectedUser.id, data);
    if (success) {
      reset();
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Usuario">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Correo Electrónico:
          </label>
          <div className="relative">
            <input
              type="text"
              disabled
              value={selectedUser?.email || ""}
              className="w-full px-3 py-2 pl-10 border border-gray-200 bg-gray-100 rounded-md text-sm text-gray-500 cursor-not-allowed"
            />
            <i className="bi bi-envelope text-xl absolute left-3 top-2 text-gray-400" />
          </div>
        </div>

        <Input
          {...register("nombre")}
          label="Nombre Completo:"
          placeholder="Ej: Juan Pérez"
          icon={<i className="bi bi-person text-xl" />}
          error={errors.nombre?.message}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rol del Usuario:
          </label>
          <div className="relative">
            <select
              {...register("rol")}
              className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-primary/50 text-sm bg-white text-gray-800"
            >
              <option value="user">Usuario Standard (user)</option>
              <option value="admin">Administrador (admin)</option>
            </select>
            <i className="bi bi-shield-lock text-xl absolute left-3 top-2 text-gray-400" />
          </div>
          {errors.rol?.message && (
            <p className="text-xs text-red-500 mt-1">{errors.rol.message}</p>
          )}
        </div>

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
            className="px-4 py-2 text-sm bg-green-primary hover:bg-green-hover shadow-sm transition-all text-white rounded-md cursor-pointer disabled:opacity-50 flex items-center justify-center min-w-[90px]"
          >
            {isSubmitting ? <Spinner className="size-5" /> : "Guardar Cambios"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
