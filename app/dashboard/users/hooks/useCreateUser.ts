import { UserService } from "@/services/user.service";
import { CreateUserFormData } from "../user.schema";
import { useState } from "react";
import axios from "axios";

export const useCreateUser = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const createUser = async (data: CreateUserFormData): Promise<boolean> => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      await UserService.new({
        nombre: data.nombre,
        email: data.email,
        password: data.password,
        rol: data.rol,
      });
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const resData = error.response?.data;
        const errorMessage =
          resData?.message ||
          resData?.error ||
          (Array.isArray(resData?.errors) && resData.errors[0]?.msg) ||
          "Error al registrar usuario";

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
    createUser,
    isSubmitting,
    serverError,
    clearServerError,
  };
};
