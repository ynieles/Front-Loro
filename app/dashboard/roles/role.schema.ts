import { z } from "zod";

export const roleSchema = z.object({
  nombre: z.string().min(3, "El nombre debe contener al menos 3 caracteres"),
  departamento_id: z.string().nonempty("Debe seleccionar un departamento"),
});

export type RoleFormData = z.infer<typeof roleSchema>;
