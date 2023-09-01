"use client";

import { ChangeEvent, useRef, useState } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { FileImage, FileUp, Loader2, Plus, Verified } from "lucide-react";
import { v4 } from "uuid";

import { db } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Mall {
  [key: string]: string[];
}

const routes = {
  receipts: "/",
};

const cities = ["Cali", "Medellín", "Bogotá"];

const malls: Mall = {
  Cali: ["Chipichape", "Unicentro"],
  Medellín: ["Centro Comercial Santafé", "El Tesoro Parque Comercial"],
  Bogotá: ["Centro Comercial Andino", "Centro Comercial Gran Estación"],
};

export default function page() {
  const { user } = useAuth();
  if (!user) {
    redirect(routes.receipts);
  }

  const [file, setFile] = useState<File>();

  const [isLoading, setIsLoading] = useState(false);

  const formRef = useRef<any>({
    totalValue: null,
    invoiceNumber: null,
    city: null,
    mall: null,
  });
  const [selectedCity, setSelectedCity] = useState<string>("");
  const { toast } = useToast();

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

  function handleChangeSelectedCity() {
    const value = formRef.current.city.textContent;
    setSelectedCity(() => value);
  }

  async function handleForm(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    const inputValue1 = formRef.current.totalValue.value;
    const inputValue2 = formRef.current.invoiceNumber.value;
    const inputValue3 = formRef.current.city.textContent;
    const inputValue4 = formRef.current.mall.textContent;

    if (
      !file ||
      inputValue1 === "" ||
      inputValue2 === "" ||
      inputValue3 === "Ciudad" ||
      inputValue4 === "Centro comercial"
    ) {
      toast({
        variant: "destructive",
        title: "Campos incompletos",
        description:
          "Revisa que todos los campos estén diligenciados correctamente.",
      });

      return;
    }

    setIsLoading((prev) => !prev);

    try {
      const id = v4();

      const storage = getStorage();
      const storageRef = ref(storage, `facturas/${user.email}/${id}`);

      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      await setDoc(doc(db, "users", user?.email, "facturas", id), {
        id: id,
        fechaRegistro: snapshot.metadata.timeCreated,
        valorTotal: inputValue1,
        numeroFactura: inputValue2,
        ciudad: inputValue3,
        centroComercial: inputValue4,
        estado: "Por revisión",
        url: url,
      });
      toast({
        description: "¡Tu factura se subió exitosamente!",
      });
    } catch (e) {
      console.log(e);
      toast({
        variant: "destructive",
        title: "Algo salió mal.",
        description: "Error",
      });
    }
    setIsLoading((prev) => !prev);

    formRef.current.invoiceNumber.value = "";
    formRef.current.totalValue.value = "";
    setFile(undefined);
  }

  return (
    <div className="bg-white">
      <main className="mx-auto flex h-screen flex-col px-4 pt-16 md:px-12 xl:px-24">
        <div className="mb-6 border-b-2 border-border px-6 pt-10 text-left md:px-0 md:text-left">
          <div className="mb-4 flex w-full flex-col items-center text-center md:flex-row md:items-end md:justify-between md:text-left">
            <h2 className="mb:mb-0 mb-2 min-w-max text-2xl font-light">
              Agrega tus facturas
            </h2>
            <div className="flex w-fit items-center">
              <div className="m-auto mr-2 h-10 w-10 rounded-full bg-primary p-2">
                <Verified className="h-6 w-6 text-white" />
              </div>
              <p className="text-left">
                Agrega tus facturas y espera su aprobación
              </p>
            </div>
          </div>
        </div>
        {isLoading ? (
          <div className="flex w-full justify-center">
            <div className="flex w-full max-w-md flex-col px-8 pb-6 md:w-1/2 xl:w-1/3">
              <div className="flex h-[200px] shrink-0 flex-col items-center justify-center gap-4 rounded-md border-2 border-dashed border-border p-4">
                <Loader2 className="h-12 w-12 animate-spin text-border" />
                <input
                  onChange={handleFileChange}
                  id="dropzone-file"
                  type="file"
                  className="hidden"
                />
              </div>
              <form className="my-4 flex flex-col gap-4">
                <Select disabled onValueChange={handleChangeSelectedCity}>
                  <SelectTrigger>
                    <SelectValue
                      id="city"
                      ref={(el) => (formRef.current.city = el)}
                      placeholder="Ciudad"
                    />
                  </SelectTrigger>
                  <SelectContent></SelectContent>
                </Select>
                <Select disabled>
                  <SelectTrigger>
                    <SelectValue
                      id="mall"
                      ref={(el) => (formRef.current.mall = el)}
                      placeholder="Centro comercial"
                    />
                  </SelectTrigger>
                  <SelectContent></SelectContent>
                </Select>
                <Input
                  disabled
                  id="totalValue"
                  ref={(el) => (formRef.current.totalValue = el)}
                  type="number"
                  placeholder="Valor total de la factura"
                />
                <Input
                  disabled
                  id="invoiceNumber"
                  ref={(el) => (formRef.current.invoiceNumber = el)}
                  type="text"
                  placeholder="Número de la factura"
                />
                <Button disabled>Subir factura</Button>
              </form>
              <Button disabled variant="outline">
                Ver todas mis facturas
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex w-full justify-center">
            <div className="flex w-full max-w-md flex-col px-8 pb-6 md:w-1/2 xl:w-1/3">
              {!file ? (
                <div className="flex h-[200px] shrink-0 flex-col items-center justify-center gap-4 rounded-md border-2 border-dashed border-border p-4">
                  <FileUp className="h-9 w-9 text-border" />
                  <p className="text-center text-sm font-semibold text-card-foreground dark:text-gray-400">
                    No se ha agregado la foto de la factura
                  </p>
                  <label
                    className={buttonVariants({ variant: "default" })}
                    htmlFor="dropzone-file"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Agregar foto
                  </label>
                  <input
                    onChange={handleFileChange}
                    id="dropzone-file"
                    type="file"
                    className="hidden"
                  />
                </div>
              ) : (
                <div className="flex h-[200px] shrink-0 flex-col items-center justify-center gap-4 rounded-md border-2 border-dashed border-border p-4">
                  <div className="flex items-center gap-2">
                    <FileImage className="h-9 w-9 text-border" />
                    <p className="text-sm font-semibold text-card-foreground">
                      {file?.name.length > 30
                        ? shortenImageName(file?.name)
                        : file?.name}
                    </p>
                  </div>
                  <p className="text-center text-sm font-semibold text-card-foreground">
                    Ahora agrega los datos de tu factura
                  </p>
                  <div className="flex items-center gap-2">
                    <label
                      className={buttonVariants({ variant: "default" })}
                      htmlFor="dropzone-file"
                    >
                      <Plus className="mr-2 h-4 w-4" />
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
              <form className="my-4 flex flex-col gap-4">
                <Select onValueChange={handleChangeSelectedCity}>
                  <SelectTrigger>
                    <SelectValue
                      id="city"
                      ref={(el) => (formRef.current.city = el)}
                      placeholder="Ciudad"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger>
                    <SelectValue
                      id="mall"
                      ref={(el) => (formRef.current.mall = el)}
                      placeholder="Centro comercial"
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {malls[selectedCity] &&
                      malls[selectedCity].map((mall: any) => (
                        <SelectItem key={mall} value={mall}>
                          {mall}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <Input
                  id="totalValue"
                  ref={(el) => (formRef.current.totalValue = el)}
                  type="number"
                  placeholder="Valor total de la factura"
                />
                <Input
                  id="invoiceNumber"
                  ref={(el) => (formRef.current.invoiceNumber = el)}
                  type="text"
                  placeholder="Número de la factura"
                />
                <Button onClick={handleForm}>Subir factura</Button>
              </form>
              <Link
                className={buttonVariants({ variant: "outline" })}
                href="/facturas"
              >
                Ver todas mis facturas
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
