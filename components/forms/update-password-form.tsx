"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { newPasswordSchema } from "@/lib/schemas";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Icons } from "@/components/icons";
import { PasswordInput } from "@/components/password-input";

type Inputs = z.infer<typeof newPasswordSchema>;

export function UpdatePasswordForm() {
  const { toast } = useToast();
  const { signUp } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<Inputs>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: "",
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  async function onSubmit(data: Inputs) {
    setIsLoading(true);
    try {
      //   await signUp(data.email, data.password);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(data);
      form.reset();
      //   router.push("/agregar-datos");
    } catch (error) {
      const firebaseError = error as { code?: string };

      switch (firebaseError.code) {
        case "auth/email-already-in-use":
          toast({
            variant: "destructive",
            title: "Error",
            description: "Este correo ya está registrado",
          });
          break;
        default:
          toast({
            variant: "destructive",
            title: "Error",
            description: "Ocurrió un error al iniciar sesión",
          });
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña actual</FormLabel>
              <FormControl>
                <PasswordInput placeholder="**********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="newPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nueva contraseña</FormLabel>
              <FormControl>
                <PasswordInput placeholder="**********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmNewPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar nueva contraseña</FormLabel>
              <FormControl>
                <PasswordInput placeholder="**********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-fit" disabled={isLoading}>
          {isLoading && (
            <Icons.spinner
              className="mr-2 h-4 w-4 animate-spin"
              aria-hidden="true"
            />
          )}
          Guardar cambios
          <span className="sr-only">Guardar los cambios del perfil</span>
        </Button>
      </form>
    </Form>
  );
}
