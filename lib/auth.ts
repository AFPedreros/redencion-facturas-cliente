import * as z from "zod";

export const signUpSchema = z
  .object({
    email: z.string().email({
      message: "Por favor ingresa un correo válido",
    }),
    password: z
      .string()
      .min(8, {
        message: "La contraseña debe tener mínimo 8 caracteres",
      })
      .max(100)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, {
        message:
          "La contraseña debe contener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export const signInSchema = z.object({
  email: z.string().email({
    message: "Por favor ingresa un correo válido",
  }),
  password: z
    .string()
    .min(8, {
      message: "La contraseña debe tener mínimo 8 caracteres",
    })
    .max(100)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, {
      message:
        "La contraseña debe contener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial",
    }),
});

export const onboardingSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres",
  }),
  lastName: z.string().min(2, {
    message: "Los apellidos deben tener al menos 2 caracteres",
  }),
  id: z.string().min(6, {
    message: "La cédula debe tener al menos 6 dígitos",
  }),
  phone: z
    .string()
    .min(10, {
      message: "El número de celular debe tener mínimo 10 dígitos",
    })
    .max(15, {
      message: "El número de celular no debe exceder los 15 dígitos",
    })
    .regex(/^[0-9]+$/, {
      message: "El número de celular solo debe contener dígitos, sin espacios",
    }),
  documentType: z.enum(["Cédula de ciudadanía"], {
    required_error: "Debes elegir un tipo de documento",
  }),
});
