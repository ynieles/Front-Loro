import type { CreateEmployee } from "@/types/employees.types";
import api from "./api.service";

interface Filters {
  page?: string;
  limit?: string;
  activo?: boolean;
  search?: string;
}

const URL = "/employee";

export const EmployeeService = {
  getAll: async (filters: Filters) => {
    const { data } = await api.get(URL, {
      params: {
        limit: "5",
        ...filters,
      },
    });

    return data;
  },

  new: async (employee: CreateEmployee) => {
    const { data } = await api.post(URL, employee);

    return data;
  },

  update: async (id: number | string, employee: CreateEmployee) => {
    const { data } = await api.put(`${URL}/${id}`, employee);

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
