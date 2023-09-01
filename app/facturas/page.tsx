"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { collection, getDocs } from "firebase/firestore";
import { useCollection } from "react-firebase-hooks/firestore";

import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Notifications from "@/components/NotificationsCard";
import ReceiptCard from "@/components/ReceiptCard";

const routes = {
  receipts: "/",
};

export default function page() {
  const { user } = useAuth();
  if (!user) {
    redirect(routes.receipts);
  }

  const [value, loading, error] = useCollection(
    collection(db, "users", user?.email, "facturas"),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  const { toast } = useToast();

  const [receiptsInfo, setReceiptsInfo] = useState<JSX.Element[]>();

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(
        collection(db, "users", user?.email, "facturas")
      );
      const receiptCards = querySnapshot.docs.map((doc) => {
        return (
          <ReceiptCard
            key={doc.data().id}
            id={doc.data().id}
            numeroFactura={doc.data().numeroFactura}
            fecha={doc.data().fechaRegistro}
            estado={doc.data().estado}
            ciudad={doc.data().ciudad}
            centroComercial={doc.data().centroComercial}
            valor={doc.data().valorTotal}
            url={doc.data().url}
            user={user}
            handleDelete={handleDelete}
          />
        );
      });
      const sortedReceiptCards = sortByRegistrationDate(receiptCards);
      setReceiptsInfo(sortedReceiptCards);
    };
    fetchData();
  }, [value]);

  function sortByRegistrationDate(objects: JSX.Element[]) {
    objects.sort(function (a: any, b: any) {
      const aDate = a.props.fecha.split("T")[0];
      const bDate = b.props.fecha.split("T")[0];
      if (aDate < bDate) {
        return -1;
      } else if (aDate > bDate) {
        return 1;
      } else {
        const aTime = a.props.fecha.split("T")[1];
        const bTime = b.props.fecha.split("T")[1];
        if (aTime < bTime) {
          return -1;
        } else if (aTime > bTime) {
          return 1;
        } else {
          return 0;
        }
      }
    });
    return objects;
  }

  function handleDelete(id: string) {
    toast({
      variant: "destructive",
      title: "Factura eliminada",
      description: "Su factura ha sido eliminada correctamente.",
    });
  }

  return (
    <div className="bg-white">
      <main className="mx-auto flex h-screen flex-col px-4 pt-16 md:px-12 xl:px-24">
        <div className="mb-6 border-b-2 border-slate-300 pt-10 text-left md:px-0 md:text-left">
          <div className="mb-4 w-full text-center md:flex md:items-end md:justify-between md:text-left">
            <h2 className="mb:mb-0 mb-2 text-2xl font-light">
              Facturas registradas
            </h2>
            <Link
              className={buttonVariants({ variant: "outline" })}
              href="/facturas/registro"
            >
              Registrar factura
            </Link>
          </div>
        </div>
        <div className="px-6">
          <Notifications
            className="mb-6"
            title="Recordatorio"
            text="Una vez registres tus facturas en la plataforma, estas entrarán en etapa de revisión, donde podrán ser aprobadas o rechazadas según los Criterios de aprobación de facturas de la actividad."
          />
          {!receiptsInfo ? (
            <div className="min-h-min justify-center pb-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Skeleton className="h-44 w-full" />
                <Skeleton className="h-44 w-full" />
                <Skeleton className="h-44 w-full" />
                <Skeleton className="h-44 w-full" />
                <Skeleton className="h-44 w-full" />
                <Skeleton className="h-44 w-full" />
                <Skeleton className="h-44 w-full" />
                <Skeleton className="h-44 w-full" />
              </div>
            </div>
          ) : receiptsInfo.length > 0 ? (
            <div className="min-h-min justify-center pb-6">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {receiptsInfo}
              </div>
            </div>
          ) : (
            <Link
              className={`md:w-fit ${buttonVariants({ variant: "default" })}`}
              href="/facturas/registro"
            >
              Registra tu primer factura
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
