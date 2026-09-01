import { RoleService } from "@/services/role.service";
import { RoleFormData } from "../role.schema";
import { useState } from "react";
import axios from "axios";

export const useCreateRole = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const createRole = async (data: RoleFormData): Promise<boolean> => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      await RoleService.new({
        nombre: data.nombre,
        departamento_id: data.departamento_id,
      });
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const resData = error.response?.data;
        const errorMessage =
          resData?.message ||
          resData?.error ||
          (Array.isArray(resData?.errors) && resData.errors[0]?.msg) ||
          "Error al registrar rol";

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
    createRole,
    isSubmitting,
    serverError,
    clearServerError,
  };
};
