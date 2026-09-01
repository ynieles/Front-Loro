"use client";

import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { UpdatePasswordFormData, updatePasswordSchema } from "../user.schema";
import { User } from "@/types/users.types";

interface UpdatePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdatePassword: (
    id: string | number,
    data: UpdatePasswordFormData,
  ) => Promise<boolean | void>;
  selectedUser: User | null;
  serverError?: string;
}

export default function UpdatePasswordModal({
  isOpen,
  onClose,
  onUpdatePassword,
  selectedUser,
  serverError,
}: UpdatePasswordModalProps) {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdatePasswordFormData>({
    resolver: zodResolver(updatePasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  const onSubmit = async (data: UpdatePasswordFormData) => {
    if (!selectedUser?.id) return;
    const success = await onUpdatePassword(selectedUser.id, data);
    if (success) {
      reset();
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Actualizar Contraseña">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {selectedUser && (
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 text-xs text-slate-700">
            Cambiando contraseña para:{" "}
            <span className="font-semibold text-slate-900">
              {selectedUser.nombre}
            </span>{" "}
            ({selectedUser.email})
          </div>
        )}

        <Input
          {...register("password")}
          type="password"
          label="Nueva Contraseña:"
          placeholder="••••••••"
          icon={<i className="bi bi-key text-xl" />}
          error={errors.password?.message}
        />

        <Input
          {...register("confirmPassword")}
          type="password"
          label="Confirmar Nueva Contraseña:"
          placeholder="••••••••"
          icon={<i className="bi bi-key-fill text-xl" />}
          error={errors.confirmPassword?.message}
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
            className="px-4 py-2 text-sm bg-green-primary hover:bg-green-hover shadow-sm transition-all text-white rounded-md cursor-pointer disabled:opacity-50 flex items-center justify-center min-w-[140px]"
          >
            {isSubmitting ? <Spinner className="size-5" /> : "Cambiar Contraseña"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
