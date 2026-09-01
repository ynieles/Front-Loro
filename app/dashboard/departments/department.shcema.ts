import { z } from "zod";

export const departmentShema = z.object({
  nombre: z.string().min(3, "El nombre debe contener al menos 3 caracteres"),
});

export type DepartmentFormData = z.infer<typeof departmentShema>;
