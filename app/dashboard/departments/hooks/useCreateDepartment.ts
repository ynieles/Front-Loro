import { useState } from "react";
import { DepartmentFormData } from "../department.shcema";
import { DepartmentService } from "@/services/department.service";
import axios from "axios";

export const useCreateDepartment = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const createDepartment = async (
    data: DepartmentFormData,
  ): Promise<boolean> => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      await DepartmentService.new(data);
      return true;
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        setServerError(
          error.response?.data.message ||
            error.response?.data.error ||
            "Error al registrar emplead",
        );
      } else {
        setServerError(
          "Ocurrio un error inesperado al conectar con el servidor",
        );
      }
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearServerError = () => setServerError(null);

  return {
    createDepartment,
    clearServerError,
    isSubmitting,
    serverError,
  };
};
