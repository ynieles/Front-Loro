import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .nonempty("EL correo electrónico es requerido")
    .email("Ingrese un correo electóonico valido"),
  password: z.string().nonempty("La contraseña es requerida"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
