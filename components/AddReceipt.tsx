'use client';
// Importa los íconos de ReceiptPercentIcon, DocumentTextIcon y TicketIcon desde la biblioteca Heroicons
import { ReceiptPercentIcon } from '@heroicons/react/24/outline';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { TicketIcon } from '@heroicons/react/24/outline';
// Importa el hook useState y useEffect de React para usar el estado local y verificar siel usuario está logueado cuando se carga la página
// Importa el hook ChangeEvent para cargar los archivos del input de archivos
import { useState, useEffect, ChangeEvent } from 'react';
// Importa la función para generar ids únicos para las facturas
import { v4 } from 'uuid';
// Importa las funciones para subir archivos a la base de datos de Firebase
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
// Importa las funciones doc y getDoc de Firebase Firestore
import { doc, setDoc } from 'firebase/firestore';
// Importa el hook useRouter de Next.js
import { useRouter } from 'next/navigation';
// Importa la instancia de la base de datos de Firebase
import { db } from '../firebase';
// Importa el hook personalizado useAuth
import { useAuth } from '../context/AuthContext';

type Props = { id: string; toggleModal: (receiptId: any) => void };

export default function AddReceipt({ id, toggleModal }: Props) {
	// Usa el hook useAuth para obtener el usuario
	const { user } = useAuth();
	// Usa el hook useRouter para obtener acceso al router de Next.js
	const router = useRouter();

	// Estado inicial que se usa para saber si ya se subió el archivo a la base de datos
	const [fileUpload, setFileUpload] = useState(false);
	// Estado inicial del archivo que se va a subir
	const [file, setFile] = useState<File>();

	const [isLoading, setIsLoading] = useState(false);

	// Hook que se usa para volver al estado inicial la variable 'fileUpload'
	useEffect(() => {
		setFileUpload(false);
	}, []);

	useEffect(() => {
		// Si 'user' es nulo, redirige al usuario a la página de inicio.
		if (user === null) {
			router.push('/');
		}
	}, [user, router]);

	// Función para poner el archivo del input en la variable file
	function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
		if (e.target.files) {
			setFile(e.target.files[0]);
		}
	}

	// Función para subir el archivo a la base de datos
	async function uploadFile() {
		setIsLoading((prev) => !prev);
		// Se verifica que exista un archivo seleccionado, de lo contrario la función no hace nada.
		if (!file) {
			return;
		}
		try {
			// Se accede al almacenamiento de Firebase y se establece la referencia donde se almacenará el archivo.
			const storage = getStorage();
			const storageRef = ref(storage, `facturas/${user.email}/${id}`);

			// Se carga el archivo a la referencia y se obtiene la URL de descarga del mismo.
			const snapshot = await uploadBytes(storageRef, file);
			const url = await getDownloadURL(storageRef);
			console.log('Uploaded a blob or file!', snapshot, url);

			// Se establece un documento en la base de datos que contiene la información de la factura.
			const docRef = await setDoc(doc(db, 'users', user?.email, 'facturas', id), {
				id: id,
				fechaRegistro: snapshot.metadata.timeCreated,
				valorTotal: '$0',
				estado: 'Por revisión',
				url: url,
			});
		} catch (e) {
			console.log(e);
		}
		// Se establece el estado de la variable fileUpload como verdadero para indicar que el archivo ha sido subido con éxito.
		setFileUpload(true);
		setIsLoading((prev) => !prev);
	}

	return (
		<div className="bg-white md:flex">
			{fileUpload ? (
				<div className="flex flex-col justify-center p-8 mx-auto md:h-fit">
					<h2 className="mb-12 text-2xl font-light text-center">¡Tu factura ha sido editada correctamente!</h2>
					<p className="mx-auto mb-12 text-[#707070] text-sm">Una vez sea aprobada se te notificará el código de participación generado.</p>
					<button
						type="button"
						onClick={toggleModal}
						className="focus:outline-none w-fit mx-auto mb-6 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-700 font-medium rounded-lg text-sm px-12 py-2.5"
					>
						Aceptar
					</button>{' '}
				</div>
			) : (
				<div className="flex flex-col justify-center p-8 mx-auto md:h-fit">
					{!file ? (
						<div className="flex items-center justify-center w-full mb-4">
							<label
								htmlFor="dropzone-file"
								className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
							>
								<div className="flex flex-col items-center justify-center pt-5 pb-6">
									<svg aria-hidden="true" className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
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
									<p className="text-xs text-gray-500 dark:text-gray-400">PNG or JPG (MAX. 2MB)</p>
								</div>
							</label>
							<input onChange={handleFileChange} id="dropzone-file" type="file" className="hidden" />
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

					<p className="mx-auto mb-12 text-[#707070] text-sm">
						Conoce más información <label className="font-bold text-black border-b-2 border-black cursor-pointer w-fit">aquí</label>.
					</p>
					{!file ? (
						<button type="button" className="text-white mb-6 bg-gray-200 cursor-not-allowed font-medium rounded-lg text-sm px-5 py-2.5 text-center" disabled>
							Subir factura
						</button>
					) : isLoading ? (
						<button
							type="button"
							onClick={() => console.log('hello')}
							className="focus:outline-none mb-6 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-700 font-medium rounded-lg text-sm px-12 py-2.5"
						>
							<svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-white animate-spin" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
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
							className="md:w-full focus:outline-none mb-6 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-600 font-medium rounded-lg text-sm px-12 py-2.5"
						>
							Subir factura
						</button>
					)}
				</div>
			)}
		</div>
	);
}