import { CreateDepartment } from "@/types/department.types";
import api from "./api.service";

const URL = "/department";

interface Filters {
  page?: string;
  limit?: string;
  activo?: boolean;
  search?: string;
}

export const DepartmentService = {
  getAll: async (filters: Filters) => {
    const { data } = await api.get(URL, {
      params: {
        limit: 5,
        ...filters,
      },
    });

    return data;
  },

  new: async (department: CreateDepartment) => {
    const { data } = await api.post(URL, department);

    return data;
  },

  update: async (id: number | string, department: CreateDepartment) => {
    const { data } = await api.put(`${URL}/${id}`, department);

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
