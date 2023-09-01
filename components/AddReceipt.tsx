"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { doc, setDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

import { db } from "@/lib/firebase";

import { useAuth } from "../context/AuthContext";

type Props = { id: string; toggleModal: (receiptId: any) => void };

export default function AddReceipt({ id, toggleModal }: Props) {
  const { user } = useAuth();

  const [fileUpload, setFileUpload] = useState(false);
  const [file, setFile] = useState<File>();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setFileUpload(false);
  }, []);

  useEffect(() => {
    if (user === null) {
      redirect("/");
    }
  }, [user]);

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  }

  async function uploadFile() {
    setIsLoading((prev) => !prev);
    if (!file) {
      return;
    }
    try {
      const storage = getStorage();
      const storageRef = ref(storage, `facturas/${user.email}/${id}`);

      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      console.log("Uploaded a blob or file!", snapshot, url);

      const docRef = await setDoc(
        doc(db, "users", user?.email, "facturas", id),
        {
          id: id,
          fechaRegistro: snapshot.metadata.timeCreated,
          valorTotal: "$0",
          estado: "Por revisión",
          url: url,
        }
      );
    } catch (e) {
      console.log(e);
    }
    setFileUpload(true);
    setIsLoading((prev) => !prev);
  }

  return (
    <div className="bg-white md:flex">
      {fileUpload ? (
        <div className="mx-auto flex flex-col justify-center p-8 md:h-fit">
          <h2 className="mb-12 text-center text-2xl font-light">
            ¡Tu factura ha sido editada correctamente!
          </h2>
          <p className="mx-auto mb-12 text-sm text-[#707070]">
            Una vez sea aprobada se te notificará el código de participación
            generado.
          </p>
          <button
            type="button"
            onClick={toggleModal}
            className="mx-auto mb-6 w-fit rounded-lg bg-blue-700 px-12 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-700"
          >
            Aceptar
          </button>{" "}
        </div>
      ) : (
        <div className="mx-auto flex flex-col justify-center p-8 md:h-fit">
          {!file ? (
            <div className="mb-4 flex w-full items-center justify-center">
              <label
                htmlFor="dropzone-file"
                className="dark:hover:bg-bray-800 flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600"
              >
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg
                    aria-hidden="true"
                    className="mb-3 h-10 w-10 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    ></path>
                  </svg>
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Agregar factura</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    PNG or JPG (MAX. 2MB)
                  </p>
                </div>
              </label>
              <input
                onChange={handleFileChange}
                id="dropzone-file"
                type="file"
                className="hidden"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <p className="mb-2 text-sm text-gray-500">
                <span className="font-semibold">{file.name}</span>
              </p>
              <button
                onClick={() => {
                  setFile(undefined);
                }}
                className="font-medium underline hover:underline"
              >
                Cancelar
              </button>
            </div>
          )}

          <p className="mx-auto mb-12 text-sm text-[#707070]">
            Conoce más información{" "}
            <label className="w-fit cursor-pointer border-b-2 border-black font-bold text-black">
              aquí
            </label>
            .
          </p>
          {!file ? (
            <button
              type="button"
              className="mb-6 cursor-not-allowed rounded-lg bg-gray-200 px-5 py-2.5 text-center text-sm font-medium text-white"
              disabled
            >
              Subir factura
            </button>
          ) : isLoading ? (
            <button
              type="button"
              onClick={() => console.log("hello")}
              className="mb-6 rounded-lg bg-blue-700 px-12 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-700"
            >
              <svg
                aria-hidden="true"
                role="status"
                className="mr-3 inline h-4 w-4 animate-spin text-white"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="#E5E7EB"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentColor"
                />
              </svg>
              Cargando...
            </button>
          ) : (
            <button
              type="button"
              onClick={uploadFile}
              className="mb-6 rounded-lg bg-blue-700 px-12 py-2.5 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-600 md:w-full"
            >
              Subir factura
            </button>
          )}
        </div>
      )}
    </div>
  );
}
