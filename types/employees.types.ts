import { Item } from "./models.types";

export interface Employee extends Item {
  ci: string;
  nombre_empleado: string;
  nombre_departamento: string;
  nombre_rol: string;
  rol_id?: string;
  activo: boolean;
}

export interface CreateEmployee {
  ci: string;
  nombre: string;
  rol_id: string;
}
