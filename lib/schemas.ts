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
  documentType: z.enum(
    ["Cédula de ciudadanía", "Pasaporte", "Cédula extranjera"],
    {
      required_error: "Debes elegir un tipo de documento",
    }
  ),
});

export const errorReportSchema = z.object({
  email: z.string().email({
    message: "Por favor ingresa un correo válido",
  }),
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres",
  }),
  message: z.string().min(10, {
    message: "El mensaje debe tener al menos 10 caracteres",
  }),
});

export const uploadReceiptSchema = z.object({
  id: z
    .string()
    .min(5, {
      message: "El número de factura debe tener al menos 5 caracteres",
    })
    .max(20, {
      message: "El número de factura no debe exceder los 20 caracteres",
    }),
  value: z
    .string()
    .min(4, {
      message: "El valor debe tener al menos 4 dígitos",
    })
    .regex(/^[0-9]+$/, {
      message: "El valor solo debe contener números",
    }),
  image: z
    .unknown()
    .refine((val) => val !== null, {
      message: "Debes subir una foto de tu factura",
    })
    .refine((val) => Array.isArray(val), {
      message: "Debes subir una foto de tu factura",
    }),
});

export const newPasswordSchema = z
  .object({
    // ... tus otros campos
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
    newPassword: z
      .string()
      .min(8, {
        message: "La contraseña debe tener mínimo 8 caracteres",
      })
      .max(100)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/, {
        message:
          "La contraseña debe contener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial",
      }),
    confirmNewPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Las nuevas contraseñas no coinciden",
    path: ["confirmNewPassword"],
  })
  .refine(
    (data) => {
      // TODO Verificar que el password es el password anterior llamando a la base de datos pidiendo la contraseña
      // Por ahora, solo voy a devolver true como un placeholder.
      return true;
    },
    {
      message: "La contraseña ingresada no es correcta",
      path: ["password"],
    }
  )
  .refine((data) => data.password !== data.newPassword, {
    message: "La nueva contraseña no puede ser igual a la contraseña anterior",
    path: ["newPassword"],
  });

export const updateReceiptSchema = z.object({
  id: z
    .string()
    .min(5, {
      message: "El número de factura debe tener al menos 5 caracteres",
    })
    .max(20, {
      message: "El número de factura no debe exceder los 20 caracteres",
    }),
  value: z
    .string()
    .min(4, {
      message: "El valor debe tener al menos 4 dígitos",
    })
    .regex(/^[0-9]+$/, {
      message: "El valor solo debe contener números",
    }),
});
