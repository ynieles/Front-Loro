import type { CreateCategory } from "@/types/category.types";
import api from "./api.service";

interface Filters {
  page?: string;
  limit?: string;
  activo?: boolean;
  search?: string;
}

const URL = "/category";

export const CategoryService = {
  getAll: async (filters: Filters = {}) => {
    const { data } = await api.get(URL, {
      params: {
        limit: "5",
        ...filters,
      },
    });

    return data;
  },

  new: async (category: CreateCategory) => {
    const { data } = await api.post(URL, category);

    return data;
  },

  update: async (id: number | string, category: CreateCategory) => {
    const { data } = await api.put(`${URL}/${id}`, category);

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
