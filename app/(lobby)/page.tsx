import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { Icons } from "@/components/icons";

export default function Home() {
  return (
    <section className="flex h-screen flex-col items-center justify-center gap-4 overflow-hidden bg-gradient-to-bl from-[#6C7C67]/5 via-[#6C7C67]/25 to-[#6C7C67]/50">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
          <div className="hidden sm:mb-8 sm:flex sm:justify-center"></div>
          <Icons.receipt className="mx-auto mb-12 h-32 w-32" />
          <div className="text-center">
            <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">
              Redime tus <span className="text-primary">facturas</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-foreground/50">
              Transforma tu experiencia de compra en el centro comercial con
              nuestra plataforma intuitiva. Además, al subir tus facturas,
              ¡participa automáticamente en nuestros sorteos exclusivos!
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                className={buttonVariants({ size: "lg" })}
                href="/iniciar-sesion"
              >
                Comienza a redimir
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
