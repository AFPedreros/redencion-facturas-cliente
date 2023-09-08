import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Icons } from "@/components/icons";
import { ReceiptCard } from "@/components/receipt-card";
import { Shell } from "@/components/shell";

export default function ReceiptsPage() {
  return (
    <Shell className="mt-2 md:mt-0" variant="sidebar">
      {/* <PageHeader id="account-header" aria-labelledby="account-header-heading">
        <PageHeaderHeading size="sm">Account</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Manage your account settings
        </PageHeaderDescription>
      </PageHeader> */}
      <section className="w-full pt-9">
        {/* <UserProfile /> */}
        <h2 className="mb-6 text-2xl font-semibold ">Mis facturas</h2>
        <div className="flex w-full flex-col gap-6">
          <Card className="w-full">
            <CardHeader className="relative">
              <CardTitle className="tracking-wide">Recordatorio</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                Una vez registres tus facturas en la plataforma, estas entrarán
                en etapa de revisión, donde podrán ser aprobadas o rechazadas
                según los criterios de aprobación de facturas de la actividad
              </p>
            </CardContent>
            <Separator className="mb-6" />
            <CardFooter>
              <Link
                className={buttonVariants({ variant: "default" })}
                href="/agregar-factura"
              >
                Registra tu primer factura
                <Icons.arrowRight className="ml-2 h-4 w-4" />
              </Link>
            </CardFooter>
          </Card>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <ReceiptCard />
            <ReceiptCard />
            <ReceiptCard />
            <ReceiptCard />
            <ReceiptCard />
            <ReceiptCard />
            <ReceiptCard />
            <ReceiptCard />
          </div>
        </div>
      </section>
    </Shell>
  );
}
