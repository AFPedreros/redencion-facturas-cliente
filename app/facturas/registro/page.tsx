'use client';
// Importa los íconos de ReceiptPercentIcon, DocumentTextIcon y TicketIcon desde la biblioteca Heroicons
import { ReceiptPercentIcon } from '@heroicons/react/24/outline';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { TicketIcon } from '@heroicons/react/24/outline';
// Importa el hook useState y useEffect de React para usar el estado local y verificar siel usuario está logueado cuando se carga la página
// Importa el hook ChangeEvent para cargar los archivos del input de archivos
import { useState, useEffect, ChangeEvent, useRef } from 'react';
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

import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileUp, Plus, FileImage, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

interface Mall {
	[key: string]: string[];
}

const cities = ['Cali', 'Medellín', 'Bogotá'];

const malls: Mall = {
	Cali: ['Chipichape', 'Unicentro'],
	Medellín: ['Centro Comercial Santafé', 'El Tesoro Parque Comercial'],
	Bogotá: ['Centro Comercial Andino', 'Centro Comercial Gran Estación'],
};

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

	const formRef = useRef<any>({ totalValue: null, invoiceNumber: null, city: null, mall: null });
	const [selectedCity, setSelectedCity] = useState<string>('');
	const { toast } = useToast();

	// Hook que se usa para volver al estado inicial la variable 'fileUpload'
	useEffect(() => {
		setFileUpload(false);
	}, []);

	useEffect(() => {
		// Si 'user' es nulo, redirige al usuario a la página de inicio.
		if (user === null) {
			return router.push('/');
		}
	}, [user, router]);

	// Función para poner el archivo del input en la variable file
	function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
		if (e.target.files) {
			setFile(e.target.files[0]);
		}
	}

	function handleChangeSelectedCity() {
		const value = formRef.current.city.textContent;
		setSelectedCity(() => value);
	}

	// Función para subir el archivo a la base de datos
	async function handleForm(e: React.MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		const inputValue1 = formRef.current.totalValue.value;
		const inputValue2 = formRef.current.invoiceNumber.value;
		const inputValue3 = formRef.current.city.textContent;
		const inputValue4 = formRef.current.mall.textContent;

		if (!file || inputValue1 === null || inputValue2 === null || inputValue3 === 'Ciudad' || inputValue4 === 'Centro comercial') {
			toast({
				variant: 'destructive',
				title: 'Campos incompletos',
				description: 'Revisa que todos los campos estén diligenciados correctamente.',
			});

			return;
		}

		setIsLoading((prev) => !prev);

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
				valorTotal: inputValue1,
				numeroFactura: inputValue2,
				ciudad: inputValue3,
				centroComercial: inputValue4,
				estado: 'Por revisión',
				url: url,
			});
			toast({
				description: '¡Tu factura se subió exitosamente!',
			});
		} catch (e) {
			console.log(e);
			toast({
				variant: 'destructive',
				title: 'Algo salió mal.',
				description: 'Error',
			});
		}
		// Se establece el estado de la variable fileUpload como verdadero para indicar que el archivo ha sido subido con éxito.
		setIsLoading((prev) => !prev);

		formRef.current.invoiceNumber.value = '';
		formRef.current.totalValue.value = '';
		setFile(undefined);
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
			{isLoading ? (
				<div className="flex flex-col justify-center px-8 mx-auto md:h-screen md:w-1/2 xl:w-1/3">
					<div className="flex p-4 gap-4 flex-col h-[150px] shrink-0 items-center border-border justify-center rounded-md border-2 border-dashed">
						<Loader2 className="w-12 h-12 text-border animate-spin" />
						<input onChange={handleFileChange} id="dropzone-file" type="file" className="hidden" />
					</div>
					<form className="flex flex-col gap-4 my-4">
						<Input disabled id="totalValue" ref={(el) => (formRef.current.totalValue = el)} type="number" placeholder="Valor total de la factura" />
						<Input disabled id="invoiceNumber" ref={(el) => (formRef.current.invoiceNumber = el)} type="text" placeholder="Número de la factura" />
						<Select disabled onValueChange={handleChangeSelectedCity}>
							<SelectTrigger>
								<SelectValue id="city" ref={(el) => (formRef.current.city = el)} placeholder="Ciudad" />
							</SelectTrigger>
							<SelectContent></SelectContent>
						</Select>
						<Select disabled>
							<SelectTrigger>
								<SelectValue id="mall" ref={(el) => (formRef.current.mall = el)} placeholder="Centro comercial" />
							</SelectTrigger>
							<SelectContent></SelectContent>
						</Select>
						<Button disabled>Subir factura</Button>
					</form>
					<Button disabled variant="outline">
						Ver todas mis facturas
					</Button>
				</div>
			) : (
				<div className="flex flex-col justify-center px-8 mx-auto md:h-screen md:w-1/2 xl:w-1/3">
					{!file ? (
						<div className="flex p-4 gap-4 flex-col h-[150px] shrink-0 items-center border-border justify-center rounded-md border-2 border-dashed">
							<FileUp className="w-9 h-9 text-border" />
							<p className="text-sm font-semibold text-card-foreground dark:text-gray-400">No se ha agregado la foto de la factura</p>
							<label className={buttonVariants({ variant: 'default' })} htmlFor="dropzone-file">
								<Plus className="w-4 h-4 mr-2" />
								Agregar foto
							</label>
							<input onChange={handleFileChange} id="dropzone-file" type="file" className="hidden" />
						</div>
					) : (
						<div className="flex gap-4 flex-col h-[150px] shrink-0 items-center border-border justify-center rounded-md border-2 border-dashed">
							<div className="flex items-center gap-2">
								<FileImage className="w-9 h-9 text-border" />
								<p className="text-sm font-semibold text-card-foreground">{file?.name}</p>
							</div>
							<p className="text-sm font-semibold text-card-foreground">Ahora agrega los datos de tu factura</p>
							<div className="flex items-center gap-2">
								<label className={buttonVariants({ variant: 'default' })} htmlFor="dropzone-file">
									<Plus className="w-4 h-4 mr-2" />
									Cambiar foto
								</label>
								<input onChange={handleFileChange} id="dropzone-file" type="file" className="hidden" />
							</div>
						</div>
					)}
					<form className="flex flex-col gap-4 my-4">
						<Input id="totalValue" ref={(el) => (formRef.current.totalValue = el)} type="number" placeholder="Valor total de la factura" />
						<Input id="invoiceNumber" ref={(el) => (formRef.current.invoiceNumber = el)} type="text" placeholder="Número de la factura" />
						<Select onValueChange={handleChangeSelectedCity}>
							<SelectTrigger>
								<SelectValue id="city" ref={(el) => (formRef.current.city = el)} placeholder="Ciudad" />
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
								<SelectValue id="mall" ref={(el) => (formRef.current.mall = el)} placeholder="Centro comercial" />
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
						<Button onClick={handleForm}>Subir factura</Button>
					</form>
					<Button onClick={() => router.push('/facturas')} variant="outline">
						Ver todas mis facturas
					</Button>
				</div>
			)}
		</div>
	);
}
