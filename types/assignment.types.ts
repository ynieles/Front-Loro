import { Item } from "./models.types";
export interface Assignment extends Item {
  equipo_id: number;
  empleado_id: number;
  fecha_inicio: string;
  fecha_fin?: string | null;
  codigo_equipo: string;
  nombre_equipo: string;
  modelo_equipo?: string;
  cedula_empleado: string;
  nombre_empleado: string;
  nombre_departamento?: string;
  activo: boolean;
}
export interface CreateAssignmentPayload {
  equipo_id: number | string;
  empleado_id: number | string;
}
