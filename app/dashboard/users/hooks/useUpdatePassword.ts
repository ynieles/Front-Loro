import { UserService } from "@/services/user.service";
import { UpdatePasswordFormData } from "../user.schema";
import { User } from "@/types/users.types";
import { useState } from "react";
import axios from "axios";

export const useUpdatePassword = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const updatePassword = async (
    id: string | number,
    data: UpdatePasswordFormData,
  ): Promise<boolean> => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      await UserService.updatePassword(id, {
        password: data.password,
      });
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const resData = error.response?.data;
        const errorMessage =
          resData?.message ||
          resData?.error ||
          (Array.isArray(resData?.errors) && resData.errors[0]?.msg) ||
          "Error al actualizar la contraseña";

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
    updatePassword,
    isSubmitting,
    serverError,
    clearServerError,
    selectedUser,
    setSelectedUser,
  };
};
