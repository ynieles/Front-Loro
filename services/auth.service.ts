import { LoginPayLoad, LoginResponse, UserProfile } from "@/types/auth.types";
import api from "./api.service";

export const AuthService = {
  login: async (payload: LoginPayLoad): Promise<LoginResponse> => {
    const { data } = await api.post("/login", payload);

    if (data && data.token) {
      if (typeof window !== "undefined") {
        localStorage.setItem("token", data.token);
        if (data.data) {
          localStorage.setItem("user", JSON.stringify(data.data));
        }
      }
    }

    return data;
  },

  logout: () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }
  },

  getCurrentUser: (): UserProfile | null => {
    if (typeof window !== "undefined") {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        try {
          return JSON.parse(userStr);
        } catch {
          return null;
        }
      }
    }

    return null;
  },

  isAuthenticated: (): boolean => {
    if (typeof window !== undefined) {
      return Boolean(localStorage.getItem("token"));
    }

    return false;
  },
};
