import { z } from "zod";

export const employeeSchema = z.object({
  nombre: z.string().min(3, "El nombre debe contener al menos 3 caracteres"),
  ci: z
    .string()
    .min(6, "La cédula debe ser válida")
    .max(8, "La a cédula debe ser válida"),
  rol_id: z.string().nonempty("Debe seleccionar un rol"),
});

export type EmployeeFormData = z.infer<typeof employeeSchema>;
