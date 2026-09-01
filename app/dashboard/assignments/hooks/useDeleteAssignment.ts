import { AssignmentService } from "@/services/assignment.service";
import { Assignment } from "@/types/assignment.types";
import axios from "axios";
import { useState } from "react";

export const useDeleteAssignment = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [selectedAssignment, setSelectedAssignment] =
    useState<Assignment | null>(null);

  const deleteAssignment = async (
    id: number | string,
    motivo: string,
  ): Promise<boolean> => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      await AssignmentService.delete(id, motivo);
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const resData = error.response?.data;
        const errorMessage =
          resData?.message ||
          resData?.error ||
          (Array.isArray(resData?.errors) && resData.errors[0]?.msg) ||
          "Error al liberar el equipo";

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
    deleteAssignment,
    clearServerError,
    serverError,
    isSubmitting,
    selectedAssignment,
    setSelectedAssignment,
  };
};
