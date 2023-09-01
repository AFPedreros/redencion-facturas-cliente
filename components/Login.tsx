"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { useToast } from "@/hooks/use-toast";

import { useAuth } from "../context/AuthContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const routes = {
  receipts: "/facturas",
};

export default function Login() {
  const { login } = useAuth();
  const router = useRouter();

  const { toast } = useToast();

  const formRef = useRef<any>({ email: "", password: "" });

  async function handleOnSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();

    if (!formRef.current.email.value) {
      toast({
        variant: "destructive",
        title: "Ingresar email",
        description: "Por favor ingresa un email.",
      });
      return false;
    } else if (!formRef.current.password.value) {
      toast({
        variant: "destructive",
        title: "Ingresar contraseña",
        description: "Por favor ingresa una contraseña.",
      });
      return false;
    }

    try {
      await login(formRef.current.email.value, formRef.current.password.value);
      router.push(routes.receipts);
    } catch (e) {
      console.log(e);
      toast({
        variant: "destructive",
        title: "Datos incorrectos",
        description: " El usuario o contraseña ingresada incorrecta.",
      });
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      handleOnSubmit(e as any);
    }
  }

  return (
    <form className="flex flex-col justify-center gap-3">
      <div className="mb-2">
        <h2 className="text-center text-2xl font-semibold">
          Bienvenido de nuevo
        </h2>
        <p className="mx-auto text-center text-sm text-muted-foreground">
          Ingresa tu correo y contraseña
        </p>
      </div>
      <Input
        id="email"
        ref={(el) => (formRef.current.email = el)}
        placeholder="Correo Electrónico"
        type="email"
        onKeyDown={handleKeyDown}
        required
      />
      <Input
        id="password"
        ref={(el) => (formRef.current.password = el)}
        placeholder="•••••••••"
        type="password"
        onKeyDown={handleKeyDown}
        required
      />
      <Button onClick={handleOnSubmit}>Ingresar</Button>
    </form>
  );
}
