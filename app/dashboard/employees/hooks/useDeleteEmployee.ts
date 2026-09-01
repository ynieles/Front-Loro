import { EmployeeService } from "@/services/employee.service";
import { Employee } from "@/types/employees.types";
import axios from "axios";
import { useState } from "react";

export const useDeleteEmployee = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(
    null,
  );

  const deleteEmployee = async (
    id: number | string,
    motivo: string,
  ): Promise<boolean> => {
    setIsSubmitting(true);
    try {
      await EmployeeService.delete(id, motivo);
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setServerError(
          error.response?.data.message ||
            error.response?.data.error ||
            "Error al eliminar empleado",
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
    deleteEmployee,
    clearServerError,
    setIsSubmitting,
    serverError,
    selectedEmployee,
    setSelectedEmployee,
    isSubmitting,
  };
};
