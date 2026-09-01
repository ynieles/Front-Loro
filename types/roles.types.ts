import { Item } from "./models.types";

export interface Role extends Item {
  nombre_rol: string;
  nombre_departamento: string;
  departamento_id?: string | number;
  activo: boolean;
}

export interface CreateRole {
  nombre: string;
  departamento_id: string | number;
}
