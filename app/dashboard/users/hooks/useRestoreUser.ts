import { UserService } from "@/services/user.service";
import { User } from "@/types/users.types";
import { useState } from "react";
import axios from "axios";

export const useRestoreUser = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const restoreUser = async (id: string | number): Promise<boolean> => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      await UserService.restore(id);
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const resData = error.response?.data;
        const errorMessage =
          resData?.message ||
          resData?.error ||
          "Error al restaurar usuario";

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
    restoreUser,
    isSubmitting,
    serverError,
    clearServerError,
    selectedUser,
    setSelectedUser,
  };
};
