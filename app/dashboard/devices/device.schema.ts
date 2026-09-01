import { z } from "zod";

export const deviceSchema = z.object({
  codigo_inventario: z.string().min(2, "El código de inventario es requerido"),
  nombre: z.string().optional(),
  categoria_id: z.string().nonempty("Debe seleccionar una categoría"),
  departamento_id: z.string().nonempty("Debe seleccionar un departamento"),
  modelo: z.string().optional(),
  ram: z.string().optional(),
  rom: z.string().optional(),
  numero_telefono: z.string().optional(),
  imei: z.string().optional(),
  observaciones: z.string().optional(),
  estado: z.string().optional(),
});

export type DeviceFormData = z.infer<typeof deviceSchema>;
