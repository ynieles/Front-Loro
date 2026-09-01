import { Item } from "./models.types";

export interface Category extends Item {
  id: number;
  nombre: string;
  activo: boolean;
}

export interface CreateCategory {
  nombre: string;
}
