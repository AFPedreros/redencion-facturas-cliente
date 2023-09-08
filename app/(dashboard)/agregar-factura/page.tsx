import Link from "next/link";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { UploadReceiptForm } from "@/components/forms/upload-receipt-form";
import { Icons } from "@/components/icons";
import { Shell } from "@/components/shell";

export default function UploadReceiptPage() {
  return (
    <Shell className="mt-2 max-w-[400px] sm:mt-0" variant="sidebar">
      <section className="w-full pt-9">
        <h2 className="mb-6 text-2xl font-semibold ">Subir facturas</h2>

        <Card className="w-full">
          <CardContent className="grid gap-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
            </div>
            <UploadReceiptForm />
          </CardContent>
          <Separator className="mb-6" />
          <CardFooter>
            <Link
              className={cn("", buttonVariants({ variant: "outline" }))}
              href="/facturas"
            >
              Ver todas mis facturas
              <Icons.arrowRight className="ml-2 h-4 w-4" />
            </Link>
          </CardFooter>
        </Card>
      </section>
    </Shell>
  );
}
