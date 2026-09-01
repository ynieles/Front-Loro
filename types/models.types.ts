export interface Item {
  id?: number | null;
  [key: string]: unknown;
}

export interface DeactivationHistoryItem {
  id: number;
  entidad: string;
  entidad_id: number;
  motivo: string;
  created_at: string;
}

