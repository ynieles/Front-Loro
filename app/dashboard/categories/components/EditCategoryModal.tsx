"use client";

import Input from "@/components/ui/Input";
import Modal from "@/components/ui/Modal";
import { Spinner } from "@/components/ui/spinner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { CategoryFormData, categorySchema } from "../category.schema";
import { Category } from "@/types/category.types";

interface EditCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (
    id: string | number,
    data: CategoryFormData,
  ) => Promise<boolean | void>;
  selectedCategory: Category | null;
  serverError?: string;
}

export default function EditCategoryModal({
  isOpen,
  onClose,
  onUpdate,
  selectedCategory,
  serverError,
}: EditCategoryModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
  });

  useEffect(() => {
    if (selectedCategory && isOpen) {
      reset({
        nombre: selectedCategory.nombre,
      });
    }
  }, [selectedCategory, isOpen, reset]);

  const onSubmit = async (data: CategoryFormData) => {
    if (!isDirty) {
      onClose();
      return;
    }

    if (!selectedCategory || selectedCategory.id == null) return;
    const success = await onUpdate(selectedCategory.id, data);
    if (success) {
      reset();
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Categoría">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...register("nombre")}
          label="Nombre de la Categoría:"
          placeholder="Ej: Telefonia"
          icon={<i className="bi bi-tags text-xl" />}
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
