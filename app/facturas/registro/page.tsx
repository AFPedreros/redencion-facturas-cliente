'use client';
import { ReceiptPercentIcon } from '@heroicons/react/24/outline';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { TicketIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect, ChangeEvent } from 'react';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';
import { useAuth } from '../../../context/AuthContext';

export default function page() {
	const [fileUpload, setFileUpload] = useState(false);
	const [file, setFile] = useState<File>();

	const { user } = useAuth();
	const router = useRouter();

	useEffect(() => {
		setFileUpload(false);
	}, []);

	if (user === null) {
		router.push('/');
	}

	function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
		if (e.target.files) {
			setFile(e.target.files[0]);
		}
	}

	async function handleClick() {
		if (!file) {
			return;
		}
		try {
			const storage = getStorage();
			const storageRef = ref(storage, `facturas/${user.email}/${v4()}`);

			const snapshot = await uploadBytes(storageRef, file);
			const url = await getDownloadURL(storageRef);
			console.log('Uploaded a blob or file!', snapshot, url);

			// router.push('/facturas'); // Redirect to the new page
		} catch (e) {
			console.log(e);
		}
		// console.log(file);
		setFileUpload(true);
	}

	return (
		<div className="bg-white md:flex">
			<div className="flex flex-col items-center justify-center h-screen p-8 md:border-r md:border-black md:w-1/3">
				<h1 className="mb-12 text-4xl">Agrega tus facturas</h1>
				<div className="flex flex-col gap-4">
					<div className="flex w-full gap-2 md:max-w-3xl">
						<div className="w-12 h-12 p-2 rounded bg-slate-200">
							<DocumentTextIcon className="text-white" />
						</div>
						<p className="w-4/5">Registra tus datos personales</p>
					</div>
					<div className="flex w-full gap-2 md:max-w-3xl">
						<div className="w-12 h-12 p-2 bg-yellow-400 rounded">
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
				<div className="flex flex-col justify-center h-screen p-8 mx-auto md:w-1/2 xl:w-1/3">
					<h2 className="mb-12 text-2xl font-light text-center">¡Tus facturas han sido registradas!</h2>
					<p className="mx-auto mb-12 text-[#707070] text-sm">Una vez sean aprobadas se te notificará el código de participación generado.</p>
					<button
						type="button"
						onClick={() => {
							setFileUpload(false);
							setFile(undefined);
						}}
						className="md:w-full focus:outline-none mb-6 text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-12 py-2.5 dark:focus:ring-yellow-900"
					>
						Agregar nueva factura
					</button>
					<button
						type="button"
						onClick={() => router.push('/facturas')}
						className="md:w-full focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-12 py-2.5 dark:focus:ring-yellow-900"
					>
						Ver todas mis facturas
					</button>
				</div>
			) : (
				<div className="flex flex-col justify-center h-screen p-8 mx-auto md:w-1/2 xl:w-1/3">
					<div className="flex items-center justify-center w-full mb-4">
						<label
							htmlFor="dropzone-file"
							className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
						>
							{!file ? (
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
							) : (
								<div className="flex flex-col items-center justify-center pt-5 pb-6">
									<p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
										<span className="font-semibold">{file.name}</span>
									</p>
								</div>
							)}
							<input onChange={handleFileChange} id="dropzone-file" type="file" className="hidden" />
						</label>
					</div>
					<p className="mx-auto mb-12 text-[#707070] text-sm">Conoce más información aquí.</p>
					<button
						type="button"
						onClick={handleClick}
						className="md:w-full focus:outline-none mb-6 text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-12 py-2.5 dark:focus:ring-yellow-900"
					>
						Subir factura
					</button>
					<button
						type="button"
						onClick={() => router.push('/facturas')}
						className="md:w-full focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-12 py-2.5 dark:focus:ring-yellow-900"
					>
						Ver todas mis facturas
					</button>
				</div>
			)}
		</div>
	);
}
