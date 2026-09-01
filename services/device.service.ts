import { CreateDevice } from "@/types/devices.types";
import api from "./api.service";

interface Filters {
  page?: string;
  limit?: string;
  activo?: boolean;
  search?: string;
  categoria_id?: string;
  departamento_id?: string;
}

const URL = "/device";

export const DeviceService = {
  getAll: async (filters: Filters = {}) => {
    const { data } = await api.get(URL, {
      params: {
        limit: "5",
        ...filters,
      },
    });

    return data;
  },

  new: async (device: CreateDevice) => {
    const { data } = await api.post(URL, device);

    return data;
  },

  update: async (id: number | string, device: CreateDevice) => {
    const { data } = await api.put(`${URL}/${id}`, device);

    return data;
  },

  delete: async (id: number | string, motivo?: string) => {
    const { data } = await api.delete(`${URL}/${id}`, {
      data: { motivo },
    });

    return data;
  },

  getHistory: async (id: number | string) => {
    const { data } = await api.get(`${URL}/${id}/history`);

    return data;
  },

  restore: async (id: number | string) => {
    const { data } = await api.patch(`${URL}/restore/${id}`);

    return data;
  },
};
