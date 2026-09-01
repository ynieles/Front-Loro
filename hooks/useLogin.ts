// front-loro/hooks/useLogin.ts
import { useState } from "react";
import { AuthService } from "@/services/auth.service";
import { LoginFormData } from "@/app/login.schema";
import axios from "axios";

export const useLogin = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const loginUser = async (data: LoginFormData): Promise<boolean> => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      await AuthService.login({
        email: data.email,
        password: data.password,
      });
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (!error.response) {
          setServerError("El servidor no está disponible. Intente más tarde.");
        } else {
          const resData = error.response.data;
          const errorMessage =
            resData?.message ||
            resData?.error ||
            (Array.isArray(resData?.errors) && resData.errors[0]?.msg) ||
            "Credenciales inválidas. Verifique sus datos.";
          setServerError(errorMessage);
        }
      } else {
        setServerError("Ocurrió un error inesperado al procesar la solicitud.");
      }

      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const clearServerError = () => setServerError(null);

  return {
    loginUser,
    isSubmitting,
    serverError,
    clearServerError,
  };
};
