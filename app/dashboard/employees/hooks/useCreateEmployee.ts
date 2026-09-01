import { EmployeeService } from "@/services/employee.service";
import { EmployeeFormData } from "../employee.schema";
import { useState } from "react";
import axios from "axios";

export const useCreateEmployee = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const createEmployee = async (data: EmployeeFormData): Promise<boolean> => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      await EmployeeService.new(data);
      return true;
    } catch (error) {
      console.error(error);
      if (axios.isAxiosError(error)) {
        setServerError(
          error.response?.data.message ||
            error.response?.data.error ||
            "Error al registrar empleado",
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
    createEmployee,
    isSubmitting,
    serverError,
    clearServerError,
  };
};
