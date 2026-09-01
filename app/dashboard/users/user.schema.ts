import { z } from "zod";

export const createUserSchema = z.object({
  nombre: z.string().min(3, "El nombre debe contener al menos 3 caracteres"),
  email: z.string().email("Debe ingresar un correo electrónico válido"),
  password: z
    .string()
    .min(6, "La contraseña debe contener al menos 6 caracteres"),
  rol: z.enum(["admin", "user"]),
});

export type CreateUserFormData = z.infer<typeof createUserSchema>;

export const editUserSchema = z.object({
  nombre: z.string().min(3, "El nombre debe contener al menos 3 caracteres"),
  rol: z.enum(["admin", "user"]),
});

export type EditUserFormData = z.infer<typeof editUserSchema>;

export const updatePasswordSchema = z
  .object({
    password: z
      .string()
      .min(6, "La contraseña debe contener al menos 6 caracteres"),
    confirmPassword: z.string().min(1, "Confirme la contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type UpdatePasswordFormData = z.infer<typeof updatePasswordSchema>;
