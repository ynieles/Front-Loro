import { DepartmentService } from "@/services/department.service";
import { Department } from "@/types/department.types";
import axios from "axios";
import { useState } from "react";

export const useDeleteDepartment = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

  const deleteDepartment = async (id: number | string): Promise<boolean> => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      await DepartmentService.delete(id);
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const resData = error.response?.data;
        const errorMessage =
          resData?.message ||
          resData?.error ||
          (Array.isArray(resData?.errors) && resData.errors[0]?.msg) ||
          "Error al eliminar departamento";

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
    deleteDepartment,
    clearServerError,
    serverError,
    isSubmitting,
    selectedDepartment,
    setSelectedDepartment,
  };
};
