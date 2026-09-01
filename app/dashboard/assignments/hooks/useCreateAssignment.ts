import { AssignmentService } from "@/services/assignment.service";
import { AssignmentFormData } from "../assignment.schema";
import { useState } from "react";
import axios from "axios";

export const useCreateAssignment = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const createAssignment = async (
    data: AssignmentFormData,
  ): Promise<boolean> => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      await AssignmentService.new({
        empleado_id: Number(data.empleado_id),
        equipo_id: Number(data.equipo_id),
      });
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const resData = error.response?.data;
        const errorMessage =
          resData?.message ||
          resData?.error ||
          (Array.isArray(resData?.errors) && resData.errors[0]?.msg) ||
          "Error al registrar la asignación";

        setServerError(errorMessage);
      } else {
        setServerError(
          "Ocurrió un error inesperado al conectar con el servidor",
        );
      }
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearServerError = () => setServerError(null);

  return {
    createAssignment,
    isSubmitting,
    serverError,
    clearServerError,
  };
};
