import { CategoryService } from "@/services/category.service";
import { CreateCategory } from "@/types/category.types";
import axios from "axios";
import { useState } from "react";

export const useCreateCategory = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const createCategory = async (payload: CreateCategory): Promise<boolean> => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      await CategoryService.new(payload);
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const resData = error.response?.data;
        const errorMessage =
          resData?.message ||
          resData?.error ||
          (Array.isArray(resData?.errors) && resData.errors[0]?.msg) ||
          "Error al registrar la categoría";

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
    createCategory,
    isSubmitting,
    serverError,
    clearServerError,
  };
};
