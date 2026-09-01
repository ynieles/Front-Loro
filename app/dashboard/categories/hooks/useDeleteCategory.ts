import { CategoryService } from "@/services/category.service";
import { Category } from "@/types/category.types";
import axios from "axios";
import { useState } from "react";

export const useDeleteCategory = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );

  const deleteCategory = async (id: number | string): Promise<boolean> => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      await CategoryService.delete(id);
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const resData = error.response?.data;
        const errorMessage =
          resData?.message ||
          resData?.error ||
          (Array.isArray(resData?.errors) && resData.errors[0]?.msg) ||
          "Error al eliminar la categoría";

        setServerError(errorMessage);
      } else {
        setServerError("Ocurrió un error inesperado al conectar con el servidor");
      }
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearServerError = () => setServerError(null);

  return {
    deleteCategory,
    isSubmitting,
    serverError,
    clearServerError,
    selectedCategory,
    setSelectedCategory,
  };
};
