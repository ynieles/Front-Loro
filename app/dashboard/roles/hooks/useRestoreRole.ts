import { RoleService } from "@/services/role.service";
import { Role } from "@/types/roles.types";
import axios from "axios";
import { useState } from "react";

export const useRestoreRole = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);

  const restoreRole = async (id: number | string): Promise<boolean> => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      await RoleService.restore(id);
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const resData = error.response?.data;
        const errorMessage =
          resData?.message ||
          resData?.error ||
          (Array.isArray(resData?.errors) && resData.errors[0]?.msg) ||
          "Error al restaurar rol";

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
    restoreRole,
    clearServerError,
    serverError,
    isSubmitting,
    selectedRole,
    setSelectedRole,
  };
};
