'use client';
import { Verified } from 'lucide-react';
import { useState, useEffect, ChangeEvent, useRef } from 'react';
import { v4 } from 'uuid';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { doc, setDoc } from 'firebase/firestore';
import { useRouter, redirect } from 'next/navigation';
import { db } from '../../../firebase';
import { useAuth } from '../../../context/AuthContext';

import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileUp, Plus, FileImage, Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

import Link from 'next/link';

interface Mall {
	[key: string]: string[];
}

const routes = {
	receipts: '/',
};

const cities = ['Cali', 'Medellín', 'Bogotá'];

const malls: Mall = {
	Cali: ['Chipichape', 'Unicentro'],
	Medellín: ['Centro Comercial Santafé', 'El Tesoro Parque Comercial'],
	Bogotá: ['Centro Comercial Andino', 'Centro Comercial Gran Estación'],
};

export default function page() {
	const { user } = useAuth();
	if (!user) {
		redirect(routes.receipts);
	}

	const [file, setFile] = useState<File>();

	const [isLoading, setIsLoading] = useState(false);

	const formRef = useRef<any>({ totalValue: null, invoiceNumber: null, city: null, mall: null });
	const [selectedCity, setSelectedCity] = useState<string>('');
	const { toast } = useToast();

	function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
		if (e.target.files) {
			setFile(e.target.files[0]);
		}
	}

	function shortenImageName(imageName: string) {
		const extension = imageName.split('.').pop();
		const imageNameWithoutExtension = imageName.slice(0, imageName.lastIndexOf('.'));
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

		if (!file || inputValue1 === '' || inputValue2 === '' || inputValue3 === 'Ciudad' || inputValue4 === 'Centro comercial') {
			toast({
				variant: 'destructive',
				title: 'Campos incompletos',
				description: 'Revisa que todos los campos estén diligenciados correctamente.',
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

			await setDoc(doc(db, 'users', user?.email, 'facturas', id), {
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
		setIsLoading((prev) => !prev);

		formRef.current.invoiceNumber.value = '';
		formRef.current.totalValue.value = '';
		setFile(undefined);
	}

	return (
		<div className="bg-white">
			<main className="flex flex-col h-screen px-4 pt-16 mx-auto md:px-12 xl:px-24">
				<div className="px-6 pt-10 mb-6 text-left border-b-2 md:px-0 md:text-left border-border">
					<div className="flex flex-col items-center w-full mb-4 text-center md:flex-row md:text-left md:items-end md:justify-between">
						<h2 className="mb-2 text-2xl font-light min-w-max mb:mb-0">Agrega tus facturas</h2>
						<div className="flex items-center w-fit">
							<div className="w-10 h-10 p-2 m-auto mr-2 rounded-full bg-primary">
								<Verified className="w-6 h-6 text-white" />
							</div>
							<p className="text-left">Agrega tus facturas y espera su aprobación</p>
						</div>
					</div>
				</div>
				{isLoading ? (
					<div className="flex justify-center w-full">
						<div className="flex flex-col w-full max-w-md px-8 pb-6 md:w-1/2 xl:w-1/3">
							<div className="flex p-4 gap-4 flex-col h-[200px] shrink-0 items-center border-border justify-center rounded-md border-2 border-dashed">
								<Loader2 className="w-12 h-12 text-border animate-spin" />
								<input onChange={handleFileChange} id="dropzone-file" type="file" className="hidden" />
							</div>
							<form className="flex flex-col gap-4 my-4">
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
								<Input disabled id="totalValue" ref={(el) => (formRef.current.totalValue = el)} type="number" placeholder="Valor total de la factura" />
								<Input disabled id="invoiceNumber" ref={(el) => (formRef.current.invoiceNumber = el)} type="text" placeholder="Número de la factura" />
								<Button disabled>Subir factura</Button>
							</form>
							<Button disabled variant="outline">
								Ver todas mis facturas
							</Button>
						</div>
					</div>
				) : (
					<div className="flex justify-center w-full">
						<div className="flex flex-col w-full max-w-md px-8 pb-6 md:w-1/2 xl:w-1/3">
							{!file ? (
								<div className="flex p-4 gap-4 flex-col h-[200px] shrink-0 items-center border-border justify-center rounded-md border-2 border-dashed">
									<FileUp className="w-9 h-9 text-border" />
									<p className="text-sm font-semibold text-center text-card-foreground dark:text-gray-400">No se ha agregado la foto de la factura</p>
									<label className={buttonVariants({ variant: 'default' })} htmlFor="dropzone-file">
										<Plus className="w-4 h-4 mr-2" />
										Agregar foto
									</label>
									<input onChange={handleFileChange} id="dropzone-file" type="file" className="hidden" />
								</div>
							) : (
								<div className="flex p-4 gap-4 flex-col h-[200px] shrink-0 items-center border-border justify-center rounded-md border-2 border-dashed">
									<div className="flex items-center gap-2">
										<FileImage className="w-9 h-9 text-border" />
										<p className="text-sm font-semibold text-card-foreground">{file?.name.length > 30 ? shortenImageName(file?.name) : file?.name}</p>
									</div>
									<p className="text-sm font-semibold text-center text-card-foreground">Ahora agrega los datos de tu factura</p>
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
								<Input id="totalValue" ref={(el) => (formRef.current.totalValue = el)} type="number" placeholder="Valor total de la factura" />
								<Input id="invoiceNumber" ref={(el) => (formRef.current.invoiceNumber = el)} type="text" placeholder="Número de la factura" />
								<Button onClick={handleForm}>Subir factura</Button>
							</form>
							<Link className={buttonVariants({ variant: 'outline' })} href="/facturas">
								Ver todas mis facturas
							</Link>
						</div>
					</div>
				)}
			</main>
		</div>
	);
}
