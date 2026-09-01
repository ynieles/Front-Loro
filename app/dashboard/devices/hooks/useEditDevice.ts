import { DeviceService } from "@/services/device.service";
import { DeviceFormData } from "../device.schema";
import { Device } from "@/types/devices.types";
import { useState } from "react";
import axios from "axios";

export const useEditDevice = () => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);

  const updateDevice = async (
    id: number | string,
    data: DeviceFormData
  ): Promise<boolean> => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      await DeviceService.update(id, {
        codigo_inventario: data.codigo_inventario,
        nombre: data.nombre,
        categoria_id: data.categoria_id,
        departamento_id: data.departamento_id,
        modelo: data.modelo,
        ram: data.ram,
        rom: data.rom,
        numero_telefono: data.numero_telefono,
        imei: data.imei,
        observaciones: data.observaciones,
        estado: data.estado,
      });
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const resData = error.response?.data;
        const errorMessage =
          resData?.message ||
          resData?.error ||
          (Array.isArray(resData?.errors) && resData.errors[0]?.msg) ||
          "Error al actualizar equipo";

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
    updateDevice,
    clearServerError,
    serverError,
    isSubmitting,
    selectedDevice,
    setSelectedDevice,
  };
};
