import { Item } from "./models.types";

export interface Device extends Item {
  codigo_inventario: string;
  nombre?: string;
  categoria_id: string | number;
  departamento_id: string | number;
  nombre_categoria: string;
  nombre_departamento: string;
  estado?: string;
  ram?: string;
  rom?: string;
  modelo?: string;
  numero_telefono?: string;
  imei?: string;
  observaciones?: string;
  activo: boolean;
}

export interface CreateDevice {
  codigo_inventario: string;
  nombre?: string;
  categoria_id: string | number;
  departamento_id: string | number;
  estado?: string;
  ram?: string;
  rom?: string;
  modelo?: string;
  numero_telefono?: string;
  imei?: string;
  observaciones?: string;
}
