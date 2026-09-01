import { Item } from "./models.types";

export interface User extends Item {
  nombre: string;
  email: string;
  rol: "admin" | "user";
  activo: boolean;
}

export interface CreateUser {
  nombre: string;
  email: string;
  password: string;
  rol: "admin" | "user";
}

export interface UpdateUser {
  nombre: string;
  rol: "admin" | "user";
}

export interface UpdateUserPassword {
  password: string;
}
