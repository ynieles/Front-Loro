import { z } from "zod";

export const categorySchema = z.object({
  nombre: z
    .string()
    .trim()
    .min(1, "El nombre de la categoría es obligatorio")
    .max(100, "El nombre no puede exceder los 100 caracteres"),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
