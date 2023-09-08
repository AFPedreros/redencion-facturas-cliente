"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { errorReportSchema } from "@/lib/schemas";
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
import { Textarea } from "@/components/ui/textarea";
import { Icons } from "@/components/icons";

type Inputs = z.infer<typeof errorReportSchema>;

export function ErrorReportForm() {
  const { toast } = useToast();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<Inputs>({
    resolver: zodResolver(errorReportSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Pedro" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Correo</FormLabel>
              <FormControl>
                <Input placeholder="correo@gmail.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción del error</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Escribe tu comentario"
                  className="h-40 resize-none"
                  {...field}
                />
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
          <Icons.send className="mr-2 h-4 w-4" />
          Enviar formulario
          <span className="sr-only">Enviar mensaje con un error</span>
        </Button>
      </form>
    </Form>
  );
}
