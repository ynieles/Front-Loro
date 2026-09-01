import { DeviceService } from "@/services/device.service";
import { Device } from "@/types/devices.types";
import axios from "axios";
import { useState } from "react";

export const useRestoreDevice = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  const restoreDevice = async (id: number | string): Promise<boolean> => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      await DeviceService.restore(id);
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const resData = error.response?.data;
        const errorMessage =
          resData?.message ||
          resData?.error ||
          (Array.isArray(resData?.errors) && resData.errors[0]?.msg) ||
          "Error al restaurar equipo";

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
    restoreDevice,
    clearServerError,
    serverError,
    isSubmitting,
    selectedDevice,
    setSelectedDevice,
  };
};
