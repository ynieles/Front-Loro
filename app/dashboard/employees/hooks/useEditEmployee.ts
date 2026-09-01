import { EmployeeService } from "@/services/employee.service";
import { EmployeeFormData } from "../employee.schema";
import { useState } from "react";
import axios from "axios";
import { Employee } from "@/types/employees.types";

export const useEditEmployee = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );

  const updateEmployee = async (
    id: number | string,
    data: EmployeeFormData,
  ): Promise<boolean> => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      await EmployeeService.update(id, data);
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setServerError(
          error.response?.data.message ||
            error.response?.data.error ||
            "Error al actualizar empleado",
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
    updateEmployee,
    clearServerError,
    serverError,
    isSubmitting,
    selectedEmployee,
    setSelectedEmployee,
  };
};
