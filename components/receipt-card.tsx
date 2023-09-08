import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Icons } from "@/components/icons";
import { ReceiptMenu } from "@/components/receipt-card-menu";
import { ReceiptImageDialog } from "@/components/receipt-image-dialog";

export function ReceiptCard() {
  return (
    <Card className="w-full">
      <CardHeader className="relative">
        {/* <Button
          variant={"ghost"}
          size={"icon"}
          className="absolute top-0 right-0 cursor-pointer hover:bg-transparent"
        > */}
        <ReceiptMenu />
        {/* </Button> */}
        <CardTitle className="font text-sm font-medium tracking-wide">
          Cosmocentro-123
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-bold">45,000</p>
        <div className="flex justify-between">
          <p className="text-sm text-[#B8B8B8]">Por revisión</p>
          <p className="text-sm text-[#B8B8B8]">15-09-2023</p>
        </div>
      </CardContent>
      <CardFooter>
        {/* <Button variant="secondary" className="w-full">
          <Icons.eye className="w-4 h-4 mr-2" />
          Ver factura
        </Button> */}
        <ReceiptImageDialog />
      </CardFooter>
    </Card>
  );
}
