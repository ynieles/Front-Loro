import { Item } from "./models.types";

export interface Department extends Item {
  nombre: string;
  activo: boolean;
}

export interface CreateDepartment {
  nombre: string;
}
