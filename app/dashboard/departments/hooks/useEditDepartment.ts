import { DepartmentService } from "@/services/department.service";
import { DepartmentFormData } from "../department.shcema";
import { useState } from "react";
import axios from "axios";
import { Department } from "@/types/department.types";

export const useEditDepartment = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);

  const updateDepartment = async (
    id: number | string,
    data: DepartmentFormData
  ): Promise<boolean> => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      await DepartmentService.update(id, data);
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const resData = error.response?.data;
        const errorMessage =
          resData?.message ||
          resData?.error ||
          (Array.isArray(resData?.errors) && resData.errors[0]?.msg) ||
          "Error al actualizar departamento";

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
    updateDepartment,
    clearServerError,
    serverError,
    isSubmitting,
    selectedDepartment,
    setSelectedDepartment,
  };
};
