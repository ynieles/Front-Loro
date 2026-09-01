import { CreateAssignmentPayload } from "@/types/assignment.types";
import api from "./api.service";
interface Filters {
  page?: string;
  limit?: string;
  activo?: boolean;
  search?: string;
  empleado_id?: string;
  equipo_id?: string;
}
const URL = "/assignment";
export const AssignmentService = {
  getAll: async (filters: Filters = {}) => {
    const { data } = await api.get(URL, {
      params: {
        limit: "5",
        ...filters,
      },
    });
    return data;
  },
  new: async (payload: CreateAssignmentPayload) => {
    const { data } = await api.post(URL, payload);
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
};
