"use client";

import { useState } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Icons } from "@/components/icons";

export function ReceiptImageDialog() {
  const [loaded, setLoaded] = useState(false);
  return (
    <AlertDialog>
      <AlertDialogTrigger
        onClick={() => setLoaded(false)}
        className={`${buttonVariants({ variant: "secondary" })} mt-2 w-full`}
      >
        <Icons.eye className="mr-2 h-4 w-4" />
        Ver factura
      </AlertDialogTrigger>
      <AlertDialogContent className="flex h-[80vh] flex-col justify-between md:max-w-[480px]">
        <AlertDialogHeader>
          <AlertDialogTitle>
            {/* {shortenString(numeroFactura)} */}
            Factura
          </AlertDialogTitle>
        </AlertDialogHeader>
        {/* <ScrollArea className="h-[80%] rounded-md"> */}
        <div className="relative flex h-[100%] items-center justify-center">
          {!loaded && (
            <div className="flex h-72 items-center justify-center bg-transparent">
              <Loader2 className="h-12 w-12 animate-spin text-black" />
            </div>
          )}
          <Image
            src="https://firebasestorage.googleapis.com/v0/b/redencion-facturas-cliente.appspot.com/o/facturas%2Ffelipe%40partnercomunicacion.co%2F64483a77-43ed-47cf-822a-ea90699c1df5?alt=media&token=e8ac7215-dea1-4960-bdff-e67c4ed16b55"
            alt="Imagen de factura"
            fill
            onLoad={() => setLoaded(true)}
          />
        </div>
        {/* </ScrollArea> */}
        <AlertDialogFooter>
          <AlertDialogCancel>Cerrar</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
