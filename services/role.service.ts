import { CreateRole } from "@/types/roles.types";
import api from "./api.service";

interface Filters {
  page?: string;
  limit?: string;
  activo?: boolean;
  search?: string;
}

const URL = "/role";

export const RoleService = {
  getAll: async (filters: Filters = {}) => {
    const { data } = await api.get(URL, {
      params: {
        ...filters,
      },
    });

    return data;
  },

  new: async (role: CreateRole) => {
    const { data } = await api.post(URL, role);

    return data;
  },

  update: async (id: number | string, role: CreateRole) => {
    const { data } = await api.put(`${URL}/${id}`, role);

    return data;
  },

  delete: async (id: number | string) => {
    const { data } = await api.delete(`${URL}/${id}`);

    return data;
  },

  restore: async (id: number | string) => {
    const { data } = await api.patch(`${URL}/restore/${id}`);

    return data;
  },
};
