"use client";

import { ChangeEvent, useRef, useState } from "react";
import Image from "next/image";
import { collection, deleteDoc, doc, setDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";
import { Edit, Loader2, Trash2 } from "lucide-react";
import { useCollection } from "react-firebase-hooks/firestore";

import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

import { db } from "../lib/firebase";

type Props = {
  id: any;
  numeroFactura: any;
  ciudad: any;
  centroComercial: any;
  fecha: any;
  estado: any;
  valor: any;
  url: any;
  user: any;
  handleDelete: (id: string) => void;
};

export default function ReceiptCard({
  id,
  numeroFactura,
  ciudad,
  centroComercial,
  fecha,
  estado,
  valor,
  url,
  user,
  handleDelete,
}: Props) {
  const [loaded, setLoaded] = useState(false);
  const [file, setFile] = useState<File>();

  const { toast } = useToast();

  const [value, loading, error] = useCollection(
    collection(db, "users", user?.email, "facturas", id, estado),
    {
      snapshotListenOptions: { includeMetadataChanges: true },
    }
  );

  const formRef = useRef<any>({ totalValue: valor, invoiceNumber: null });

  function handleImageLoad() {
    setLoaded(true);
  }

  function getDateFromString(dateString: string) {
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, "0");
    const day = date.getUTCDate().toString().padStart(2, "0");
    return `${day}-${month}-${year}`;
  }

  function shortenString(str: string) {
    if (str.length > 12) {
      const firstChars = str.substring(0, 6);
      const lastChars = str.substring(str.length - 4);
      return `${firstChars}...${lastChars}`;
    } else {
      return str;
    }
  }

  function formatCurrency(amount: any) {
    const amountNumber = Number(
      amount.replace(/\./g, "").replace(/[^0-9.-]+/g, "")
    );
    const formatter = new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    });
    return formatter.format(amountNumber);
  }

  async function handleClick() {
    const newValue =
      formRef.current.totalValue.value !== ""
        ? formRef.current.totalValue.value
        : valor;
    const newInvoiceNumber =
      formRef.current.invoiceNumber.value !== ""
        ? formRef.current.invoiceNumber.value
        : numeroFactura;
    let newUrl = url;

    if (file) {
      const storage = getStorage();
      const storageRef = ref(storage, `facturas/${user.email}/${id}`);
      const snapshot = await uploadBytes(storageRef, file);
      newUrl = await getDownloadURL(storageRef);
    }

    try {
      await setDoc(doc(db, "users", user?.email, "facturas", id), {
        id: id,
        fechaRegistro: fecha,
        valorTotal: newValue,
        numeroFactura: newInvoiceNumber,
        ciudad: ciudad,
        centroComercial: centroComercial,
        estado: estado,
        url: newUrl,
      });
      toast({
        description: "Los datos de tu factura han sido actualizados",
      });
    } catch (e) {
      console.log(e);
    }

    setFile(undefined);
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  }

  function shortenImageName(imageName: string) {
    const extension = imageName.split(".").pop();
    const imageNameWithoutExtension = imageName.slice(
      0,
      imageName.lastIndexOf(".")
    );
    const firstSixCharacters = imageNameWithoutExtension.slice(0, 6);
    const lastFourCharacters = imageNameWithoutExtension.slice(-4);
    return `${firstSixCharacters}...${lastFourCharacters}.${extension}`;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {shortenString(numeroFactura)}
        </CardTitle>
        <div className="flex gap-3 md:gap-2">
          <AlertDialog>
            <AlertDialogTrigger className="text-sm font-medium text-primary">
              <Edit onClick={() => setFile(undefined)} className="h-4 w-4" />
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white">
              <AlertDialogHeader>
                <AlertDialogTitle>
                  {shortenString(numeroFactura)}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Edita los datos de tu factura.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="flex flex-col space-y-2">
                {!file ? (
                  <div className="flex shrink-0 items-center justify-between gap-4">
                    <label
                      className={buttonVariants({ variant: "default" })}
                      htmlFor="dropzone-file"
                    >
                      Cambiar foto
                    </label>
                    <input
                      onChange={handleFileChange}
                      id="dropzone-file"
                      type="file"
                      className="hidden"
                    />
                  </div>
                ) : (
                  <div className="flex shrink-0 items-center justify-between">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-card-foreground">
                        {file?.name.length > 30
                          ? shortenImageName(file?.name)
                          : file?.name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <label
                        className={buttonVariants({ variant: "default" })}
                        htmlFor="dropzone-file"
                      >
                        Cambiar foto
                      </label>
                      <input
                        onChange={handleFileChange}
                        id="dropzone-file"
                        type="file"
                        className="hidden"
                      />
                    </div>
                  </div>
                )}
                <Input
                  defaultValue={valor}
                  id="totalValue"
                  ref={(el) => (formRef.current.totalValue = el)}
                  type="number"
                  placeholder="Valor total de la factura"
                />
                <Input
                  defaultValue={numeroFactura}
                  id="invoiceNumber"
                  ref={(el) => (formRef.current.invoiceNumber = el)}
                  type="text"
                  placeholder="Número de la factura"
                />
              </div>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setFile(undefined)}>
                  Cancelar
                </AlertDialogCancel>
                <AlertDialogAction onClick={handleClick}>
                  Guardar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <AlertDialog>
            <AlertDialogTrigger className="text-sm font-medium text-destructive">
              <Trash2 className="h-4 w-4" />
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white">
              <AlertDialogHeader>
                <AlertDialogTitle>
                  ¿Estás seguro, completamente seguro?
                </AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Eliminará permanentemente tu
                  cuenta y eliminará tus datos de nuestros servidores.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    // Se accede al almacenamiento de Firebase y se establece la referencia donde se almacenará el archivo.
                    const storage = getStorage();
                    const storageRef = ref(
                      storage,
                      `facturas/${user.email}/${id}`
                    );
                    try {
                      await deleteObject(storageRef);
                      await deleteDoc(
                        doc(db, "users", user?.email, "facturas", id)
                      );
                      handleDelete(id);
                    } catch (e) {
                      console.log(e);
                    }
                  }}
                  className={buttonVariants({ variant: "destructive" })}
                >
                  Continuar
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatCurrency(valor)}</div>
        <div className="mt-1 flex items-center justify-between">
          <p
            className={`${
              estado === "Rechazada"
                ? "text-destructive"
                : estado === "Aprobada"
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            {estado}
          </p>
          <p className="text-xs text-muted-foreground">
            {getDateFromString(fecha)}
          </p>
        </div>
        <AlertDialog>
          <AlertDialogTrigger
            onClick={() => setLoaded(false)}
            className={`${buttonVariants({ variant: "default" })} mt-2 w-full`}
          >
            Ver factura
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-white">
            <AlertDialogHeader>
              <AlertDialogTitle>
                {shortenString(numeroFactura)}
              </AlertDialogTitle>
            </AlertDialogHeader>
            <ScrollArea className="h-72 w-full rounded-md">
              {!loaded && (
                <div className="flex h-72 items-center justify-center bg-transparent">
                  <Loader2 className="h-12 w-12 animate-spin text-black" />
                </div>
              )}
              <Image
                src={url}
                alt="Image"
                className="rounded-md object-cover"
                width={500}
                height={500}
                onLoad={handleImageLoad}
              />
            </ScrollArea>
            <AlertDialogFooter>
              <AlertDialogCancel
                className={buttonVariants({ variant: "default" })}
              >
                Cerrar
              </AlertDialogCancel>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
