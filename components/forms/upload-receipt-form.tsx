"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { FileWithPreview } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateReactHelpers } from "@uploadthing/react/hooks";
import { useForm } from "react-hook-form";
import type { z } from "zod";

import { uploadReceiptSchema } from "@/lib/schemas";
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
import { FileDialog } from "@/components/file-dialog";
import { Icons } from "@/components/icons";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

type Inputs = z.infer<typeof uploadReceiptSchema>;

export function UploadReceiptForm() {
  const { toast } = useToast();
  const { useUploadThing } = generateReactHelpers<OurFileRouter>();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [files, setFiles] = useState<FileWithPreview[] | null>(null);
  const { isUploading, startUpload } = useUploadThing("productImage");
  const [isPending, startTransition] = useTransition();

  const form = useForm<Inputs>({
    resolver: zodResolver(uploadReceiptSchema),
    defaultValues: {
      id: "",
      value: "",
    },
  });

  async function onSubmit(data: Inputs) {
    setIsLoading(true);
    try {
      //   await signUp(data.email, data.password);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log(data);
      form.reset();
      setFiles(null);
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
          name="image"
          render={() => (
            <FormItem>
              <FormLabel>Foto de la factura</FormLabel>
              <FormControl>
                <FileDialog
                  setValue={form.setValue}
                  name="image"
                  maxFiles={1}
                  maxSize={1024 * 1024 * 4}
                  files={files}
                  setFiles={setFiles}
                  isUploading={isUploading}
                  disabled={isPending}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de factura</FormLabel>
              <FormControl>
                <Input placeholder="Cosmocentro-123" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor total</FormLabel>
              <FormControl>
                <Input placeholder="10000" {...field} />
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
          Registrar factura
          <span className="sr-only">Enviar mensaje con un error</span>
        </Button>
      </form>
    </Form>
  );
}
