import {
  CreateUser,
  UpdateUser,
  UpdateUserPassword,
} from "@/types/users.types";
import api from "./api.service";

interface Filters {
  page?: string;
  limit?: string;
  activo?: boolean;
  search?: string;
}

const URL = "/user";

export const UserService = {
  getAll: async (filters: Filters = {}) => {
    const { data } = await api.get(URL, {
      params: {
        ...filters,
      },
    });

    return data;
  },

  getById: async (id: number | string) => {
    const { data } = await api.get(`${URL}/${id}`);
    return data;
  },

  new: async (user: CreateUser) => {
    const { data } = await api.post(URL, user);

    return data;
  },

  update: async (id: number | string, user: UpdateUser) => {
    const { data } = await api.put(`${URL}/${id}`, user);

    return data;
  },

  updatePassword: async (
    id: number | string,
    passwordData: UpdateUserPassword,
  ) => {
    const { data } = await api.patch(`${URL}/password/${id}`, passwordData);

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
