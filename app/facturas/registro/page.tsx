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

	const [isLoading, setIsLoading] = useState(false);
	const [showModal, setShowModal] = useState(false);

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
	async function handleClick() {
		setIsLoading((prev) => !prev);
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
		setIsLoading((prev) => !prev);
	}

	async function manualUpload() {
		console.log('hello');
	}

	function toggleModal() {
		setShowModal(!showModal);
		console.log(showModal);
	}

	return (
		<div className="bg-white md:flex">
			<div id="authentication-modal" className="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] md:h-full">
				<div className="relative w-full h-full max-w-md md:h-auto">
					<div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
						<button
							type="button"
							className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
							data-modal-hide="authentication-modal"
						>
							<svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
								<path
									fillRule="evenodd"
									d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
									clipRule="evenodd"
								></path>
							</svg>
							<span className="sr-only">Close modal</span>
						</button>
						<div className="px-6 py-6 lg:px-8">
							<h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">Sign in to our platform</h3>
							<form className="space-y-6" action="#">
								<div>
									<label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
										Your email
									</label>
									<input
										type="email"
										name="email"
										id="email"
										className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
										placeholder="name@company.com"
										required
									/>
								</div>
								<div>
									<label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
										Your password
									</label>
									<input
										type="password"
										name="password"
										id="password"
										placeholder="••••••••"
										className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
										required
									/>
								</div>
								<div className="flex justify-between">
									<div className="flex items-start">
										<div className="flex items-center h-5">
											<input
												id="remember"
												type="checkbox"
												value=""
												className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-600 dark:border-gray-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
												required
											/>
										</div>
										<label htmlFor="remember" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
											Remember me
										</label>
									</div>
									<a href="#" className="text-sm text-blue-700 hover:underline dark:text-blue-500">
										Lost Password?
									</a>
								</div>
								<button
									type="submit"
									className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
								>
									Login to your account
								</button>
								<div className="text-sm font-medium text-gray-500 dark:text-gray-300">
									Not registered?{' '}
									<a href="#" className="text-blue-700 hover:underline dark:text-blue-500">
										Create account
									</a>
								</div>
							</form>
						</div>
					</div>
				</div>
			</div>
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

					<p className="mx-auto mb-12 text-[#707070] text-sm">
						Conoce más información{' '}
						<label onClick={toggleModal} className="font-bold text-black border-b-2 border-black cursor-pointer w-fit">
							aquí
						</label>
						.
					</p>
					{showModal && (
						<div
							id="authentication-modal"
							tabIndex={-1}
							aria-hidden="true"
							className="fixed top-0 left-0 right-0 z-50 hidden w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] md:h-full"
						>
							<div className="relative w-full h-full max-w-md md:h-auto">
								<div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
									<button
										type="button"
										className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white"
										data-modal-hide="authentication-modal"
									>
										<svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
											<path
												fillRule="evenodd"
												d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
												clipRule="evenodd"
											></path>
										</svg>
										<span className="sr-only">Close modal</span>
									</button>
									<div className="px-6 py-6 lg:px-8">
										<h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">Sign in to our platform</h3>
										<form className="space-y-6" action="#">
											<div>
												<label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
													Your email
												</label>
												<input
													type="email"
													name="email"
													id="email"
													className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
													placeholder="name@company.com"
													required
												/>
											</div>
											<div>
												<label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
													Your password
												</label>
												<input
													type="password"
													name="password"
													id="password"
													placeholder="••••••••"
													className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
													required
												/>
											</div>
											<div className="flex justify-between">
												<div className="flex items-start">
													<div className="flex items-center h-5">
														<input
															id="remember"
															type="checkbox"
															value=""
															className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-600 dark:border-gray-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
															required
														/>
													</div>
													<label htmlFor="remember" className="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">
														Remember me
													</label>
												</div>
												<a href="#" className="text-sm text-blue-700 hover:underline dark:text-blue-500">
													Lost Password?
												</a>
											</div>
											<button
												type="submit"
												className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
											>
												Login to your account
											</button>
											<div className="text-sm font-medium text-gray-500 dark:text-gray-300">
												Not registered?{' '}
												<a href="#" className="text-blue-700 hover:underline dark:text-blue-500">
													Create account
												</a>
											</div>
										</form>
									</div>
								</div>
							</div>
						</div>
					)}
					{!file ? (
						<button type="button" className="text-white mb-6 bg-gray-200 cursor-not-allowed font-medium rounded-lg text-sm px-5 py-2.5 text-center" disabled>
							Subir factura
						</button>
					) : isLoading ? (
						<button
							type="button"
							onClick={handleClick}
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
							onClick={handleClick}
							className="md:w-full focus:outline-none mb-6 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-600 font-medium rounded-lg text-sm px-12 py-2.5"
						>
							Subir factura
						</button>
					)}
					{isLoading ? (
						<button
							type="button"
							onClick={handleClick}
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
							onClick={() => router.push('/facturas')}
							className="md:w-full focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-600 font-medium rounded-lg text-sm px-12 py-2.5"
						>
							Ver todas mis facturas
						</button>
					)}
				</div>
			)}
		</div>
	);
}
