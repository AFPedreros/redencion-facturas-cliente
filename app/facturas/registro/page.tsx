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
import { db } from '../../../firebase';
// Importa el hook personalizado useAuth
import { useAuth } from '../../../context/AuthContext';

export default function page() {
	// Usa el hook useAuth para obtener el usuario
	const { user } = useAuth();
	// Usa el hook useRouter para obtener acceso al router de Next.js
	const router = useRouter();

	// Estado inicial que se usa para saber si ya se subió el archivo a la base de datos
	const [fileUpload, setFileUpload] = useState(false);
	// Estado inicial del archivo que se va a subir
	const [file, setFile] = useState<File>();

	// Hook que se usa para volver al estado inicial la variable 'fileUpload'
	useEffect(() => {
		setFileUpload(false);
	}, []);

	// if (user === null) {
	// 	router.push('/');
	// }
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
	async function handleClick() {
		// Se verifica que exista un archivo seleccionado, de lo contrario la función no hace nada.
		if (!file) {
			return;
		}
		try {
			// Se genera un ID único para la factura que se está subiendo.
			const id = v4();

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
	}

	return (
		<div className="bg-white md:flex">
			<div className="flex flex-col items-center justify-center p-8 pt-20 md:pt-0 md:h-screen md:border-r md:border-black md:w-1/3">
				<h1 className="mb-12 text-4xl">Agrega tus facturas</h1>
				<div className="flex flex-col gap-4">
					<div className="flex w-full gap-2 md:max-w-3xl">
						<div className="w-12 h-12 p-2 rounded bg-slate-200">
							<DocumentTextIcon className="text-white" />
						</div>
						<p className="w-4/5">Registra tus datos personales</p>
					</div>
					<div className="flex w-full gap-2 md:max-w-3xl">
						<div className="w-12 h-12 p-2 bg-blue-700 rounded">
							<ReceiptPercentIcon className="text-white" />
						</div>
						<p className="w-4/5">Agrega tus facturas y espera su aprobación</p>
					</div>
					<div className="flex w-full gap-2 md:max-w-3xl">
						<div className="w-12 h-12 p-2 rounded bg-slate-200">
							<TicketIcon className="text-white" />
						</div>
						<p className="w-4/5">Obtén un código y participa en los sorteos</p>
					</div>
				</div>
			</div>
			{fileUpload ? (
				<div className="flex flex-col justify-center p-8 mx-auto md:h-screen md:w-1/2 xl:w-1/3">
					<h2 className="mb-12 text-2xl font-light text-center">¡Tus facturas han sido registradas!</h2>
					<p className="mx-auto mb-12 text-[#707070] text-sm">Una vez sean aprobadas se te notificará el código de participación generado.</p>
					<button
						type="button"
						onClick={() => {
							setFileUpload(false);
							setFile(undefined);
						}}
						className="md:w-full focus:outline-none mb-6 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-600 font-medium rounded-lg text-sm px-12 py-2.5"
					>
						Agregar nueva factura
					</button>
					<button
						type="button"
						onClick={() => router.push('/facturas')}
						className="md:w-full focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-600 font-medium rounded-lg text-sm px-12 py-2.5"
					>
						Ver todas mis facturas
					</button>
				</div>
			) : (
				<div className="flex flex-col justify-center p-8 mx-auto md:h-screen md:w-1/2 xl:w-1/3">
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

					<p className="mx-auto mb-12 text-[#707070] text-sm">Conoce más información aquí.</p>
					{!file ? (
						<button type="button" className="text-white mb-6 bg-gray-200 cursor-not-allowed font-medium rounded-lg text-sm px-5 py-2.5 text-center" disabled>
							Subir factura
						</button>
					) : (
						<button
							type="button"
							onClick={handleClick}
							className="md:w-full focus:outline-none mb-6 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-600 font-medium rounded-lg text-sm px-12 py-2.5"
						>
							Subir factura
						</button>
					)}
					<button
						type="button"
						onClick={() => router.push('/facturas')}
						className="md:w-full focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-600 font-medium rounded-lg text-sm px-12 py-2.5"
					>
						Ver todas mis facturas
					</button>
				</div>
			)}
		</div>
	);
}
