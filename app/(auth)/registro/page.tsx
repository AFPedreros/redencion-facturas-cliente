"use client";

import Link from "next/link";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Shell } from "@/components/shell";
import { SignUpForm } from "@/components/signup-form";

const routes = {
  receipts: "/facturas",
};

export default function SignUpPage() {
  return (
    <Shell className="max-w-md mx-auto">
      <div className="flex items-center justify-center w-full">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary">
          <p className="text-primary-foreground">1</p>
        </div>
        <Separator className="mx-4 w-10 bg-[#B8B8B8]" />
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#B8B8B8]">
          <p className="text-primary-foreground">2</p>
        </div>
      </div>
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">Regístrate</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
          </div>
          <SignUpForm />
          {/* <Button variant={"outline"}><Icons.google className="w-4 h-4 mr-2" /> Regístrate con Google</Button> */}
        </CardContent>
        <CardFooter className="grid gap-4 text-center">
          <div className="text-sm text-muted-foreground">
            ¿Ya tienes una cuenta?{" "}
            <Link
              aria-label="Iniciar sesión"
              href="/iniciar-sesion"
              className="text-[#0000EE] underline-offset-4 transition-colors hover:underline"
            >
              Inicia sesión
            </Link>
          </div>
        </CardFooter>
      </Card>
    </Shell>
  );
}
