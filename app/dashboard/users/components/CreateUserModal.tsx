"use client";

import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { CreateUserFormData, createUserSchema } from "../user.schema";

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegister: (data: CreateUserFormData) => Promise<boolean | void>;
  serverError?: string;
}

export default function CreateUserModal({
  isOpen,
  onClose,
  onRegister,
  serverError,
}: CreateUserModalProps) {
  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      nombre: "",
      email: "",
      password: "",
      rol: "user",
    },
  });

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  const onSubmit = async (data: CreateUserFormData) => {
    const success = await onRegister(data);
    if (success) {
      reset();
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Registrar Usuario">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Banner de notificación de validación de correo */}
        <div className="bg-sky-50 border border-sky-200 rounded-lg p-3 flex items-start gap-3">
          <i className="bi bi-envelope-check text-sky-600 text-xl shrink-0 mt-0.5" />
          <p className="text-xs text-sky-800 leading-relaxed font-medium">
            <strong>Validación de correo:</strong> Al registrar al usuario se
            enviará una notificación por correo electrónico para que valide su
            cuenta antes de poder iniciar sesión.
          </p>
        </div>

        <Input
          {...register("nombre")}
          label="Nombre Completo:"
          placeholder="Ej: Juan Pérez"
          icon={<i className="bi bi-person text-xl" />}
          error={errors.nombre?.message}
        />

        <Input
          {...register("email")}
          type="email"
          label="Correo Electrónico:"
          placeholder="usuario@ejemplo.com"
          icon={<i className="bi bi-envelope text-xl" />}
          error={errors.email?.message}
        />

        <Input
          {...register("password")}
          type="password"
          label="Contraseña:"
          placeholder="••••••••"
          icon={<i className="bi bi-lock text-xl" />}
          error={errors.password?.message}
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
            {isSubmitting ? <Spinner className="size-5" /> : "Guardar"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
