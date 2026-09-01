import { z } from "zod";
export const assignmentSchema = z.object({
  empleado_id: z.string().nonempty("Debe seleccionar un empleado"),
  equipo_id: z.string().nonempty("Debe seleccionar un equipo disponible"),
});
export type AssignmentFormData = z.infer<typeof assignmentSchema>;
