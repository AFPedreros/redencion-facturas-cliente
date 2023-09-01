"use client";

import Image from "next/image";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

import { cn } from "@/lib/utils";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { user } = useAuth();
  const pathname = usePathname();

  if (user) {
    redirect("/");
  }

  return (
    <main className="grid min-h-screen grid-cols-1 overflow-hidden lg:grid-cols-2">
      <AspectRatio ratio={16 / 9} className="md:bg-background">
        <Image
          src="/stacked-steps.svg"
          alt="Fondo rectángulos"
          priority
          fill
          className="absolute inset-0 object-cover lg:hidden"
        />
        {pathname !== "/datos-personales" ? (
          <Link
            className={cn(
              "absolute left-8 top-8 z-20 flex items-center backdrop-blur-md",
              buttonVariants({ variant: "ghost" })
            )}
            href="/"
          >
            <Icons.arrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
            <p className="font-semibold tracking-wide">Regresar al incio</p>
          </Link>
        ) : null}
      </AspectRatio>
      <div className="absolute top-1/2 col-span-1 flex w-full -translate-y-1/2 items-center justify-center lg:static lg:top-0 lg:col-span-1 lg:translate-y-0">
        {children}
      </div>
    </main>
  );
}
