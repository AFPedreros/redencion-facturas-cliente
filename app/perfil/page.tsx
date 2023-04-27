'use client';
// Importa las funciones doc, setDoc y getDoc de Firebase Firestore
import { doc, getDoc, setDoc, collection } from 'firebase/firestore';
// Importa el hook useState y useEffect de React para usar el estado local y verificar siel usuario está logueado cuando se carga la página
import { useState, useEffect, useRef } from 'react';
// Importa el hook useRouter de Next.js
import { useRouter, redirect } from 'next/navigation';
// Importa la instancia de la base de datos de Firebase
import { db } from '../../firebase';
// Importa el hook personalizado useAuth
import { useAuth } from '../../context/AuthContext';
import { Input } from '@/components/ui/input';
import { Button, buttonVariants } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

import Link from 'next/link';

import { useCollection } from 'react-firebase-hooks/firestore';

export default function page() {
	// Usa el hook useAuth para obtener el usuario
	const { user } = useAuth();

	if (user === null) {
		redirect('/');
	}

	// Usa el hook useRouter para obtener acceso al router de Next.js
	const router = useRouter();

	const [value, loading, error] = useCollection(collection(db, 'users'), {
		snapshotListenOptions: { includeMetadataChanges: true },
	});

	const formRef = useRef<any>({ name: '', id: '', tel: '' });
	const [formChange, setFormChange] = useState<any>({ name: false, id: false, tel: false });
	const { toast } = useToast();

	// Estado inicial de la información del usuario
	const [userData, setUserData] = useState<any>();

	// Estado inicial del formulario

	useEffect(() => {
		const docRef = doc(db, 'users', user?.email);
		const fetchData = async () => {
			const docSnap = await getDoc(docRef);
			setUserData(docSnap?.data());
		};
		try {
			fetchData();
		} catch (err) {
			console.log(err);
		}
	}, [value]);

	function handleFormChange(name: string) {
		setFormChange((prevState: any) => {
			return {
				...prevState,
				[name]: !prevState[name],
			};
		});
	}

	async function handleClick() {
		const name = formRef.current.name.value !== '' ? formRef.current.name.value : userData?.nombre;
		const id = formRef.current.id.value !== '' ? formRef.current.id.value : userData?.cedula;
		const tel = formRef.current.tel.value !== '' ? formRef.current.tel.value : userData?.celular;

		try {
			await setDoc(doc(db, 'users', user?.email), {
				nombre: name,
				cedula: id,
				celular: tel,
			});
			toast({
				description: 'Tus datos se han actualizado correctamente.',
			});
		} catch (e) {
			console.error(e);
		}

		formRef.current.name.value = '';
		formRef.current.id.value = '';
		formRef.current.tel.value = '';

		setFormChange({ name: false, id: false, tel: false });
	}

	return (
		<div className="bg-white">
			<main className="flex flex-col h-screen px-4 pt-16 mx-auto md:px-12 xl:px-24">
				<div className="px-6 pt-10 mb-6 text-left border-b-2 md:px-0 md:text-left border-border">
					<div className="w-full mb-4 text-center md:text-left md:items-end md:flex md:justify-between">
						<h2 className="mb-2 text-2xl font-light mb:mb-0">Mi cuenta</h2>
						<Link className={buttonVariants({ variant: 'outline' })} href="/facturas">
							Revisa tus facturas
						</Link>
					</div>
				</div>
				{!userData ? (
					<div className="flex flex-col items-center mb-4">
						<div className="justify-between w-full max-w-6xl text-left md:flex">
							<div className="w-full px-6 mb-6 md:px-0 md:w-2/5">
								<Skeleton className="w-[100px] mb-2 mt-1 h-4 rounded-full" />
								<div className="flex w-full space-x-2">
									<Skeleton className="w-full h-10" />
								</div>
							</div>
							<div className="w-full px-6 mb-6 md:px-0 md:w-2/5">
								<Skeleton className="w-[100px] mb-2 mt-1 h-4 rounded-full" />
								<div className="flex w-full space-x-2">
									<Skeleton className="w-full h-10" />
									<Skeleton className="w-24 h-10" />
								</div>
							</div>
						</div>
						<div className="justify-between w-full max-w-6xl text-left md:flex">
							<div className="w-full px-6 mb-6 md:px-0 md:w-2/5">
								<Skeleton className="w-[100px] mb-2 mt-1 h-4 rounded-full" />
								<div className="flex w-full space-x-2">
									<Skeleton className="w-full h-10" />
									<Skeleton className="w-24 h-10" />
								</div>
							</div>
							<div className="w-full px-6 mb-6 md:px-0 md:w-2/5">
								<Skeleton className="w-[100px] mb-2 mt-1 h-4 rounded-full" />
								<div className="flex w-full space-x-2">
									<Skeleton className="w-full h-10" />
									<Skeleton className="w-24 h-10" />
								</div>
							</div>
						</div>
					</div>
				) : (
					<div className="flex flex-col items-center mb-4">
						<div className="justify-between w-full max-w-6xl text-left md:flex">
							<div className="flex justify-center w-full px-6 mb-6 md:block md:px-0 md:w-2/5">
								<div className="flex flex-col w-full max-w-md">
									<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Correo electrónico</label>
									<Input id="email" type="email" placeholder={user?.email} disabled />
								</div>
							</div>
							<div className="flex justify-center w-full px-6 mb-6 md:block md:px-0 md:w-2/5">
								<div className="flex flex-col w-full max-w-md">
									<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre completo</label>
									<div className="flex space-x-2">
										<Input
											id="name"
											ref={(el) => (formRef.current.name = el)}
											type="text"
											placeholder={formChange.name ? 'Nuevo nombre de usuario' : userData?.nombre}
											disabled={!formChange.name}
										/>
										{!formChange.name ? (
											<Button variant="default" onClick={() => handleFormChange('name')}>
												Editar
											</Button>
										) : (
											<Button variant="default" onClick={handleClick}>
												Guardar
											</Button>
										)}
									</div>
								</div>
							</div>
						</div>
						<div className="justify-between w-full max-w-6xl text-left md:flex">
							<div className="flex justify-center w-full px-6 mb-6 md:block md:px-0 md:w-2/5">
								<div className="flex flex-col w-full max-w-md">
									<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cédula</label>
									<div className="flex space-x-2">
										<Input
											id="id"
											ref={(el) => (formRef.current.id = el)}
											type="text"
											placeholder={formChange.id ? 'Nuevo número de documento' : userData?.cedula}
											disabled={!formChange.id}
										/>
										{!formChange.id ? (
											<Button variant="default" onClick={() => handleFormChange('id')}>
												Editar
											</Button>
										) : (
											<Button variant="default" onClick={handleClick}>
												Guardar
											</Button>
										)}
									</div>
								</div>
							</div>
							<div className="flex justify-center w-full px-6 mb-6 md:block md:px-0 md:w-2/5">
								<div className="flex flex-col w-full max-w-md">
									<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Celular</label>
									<div className="flex space-x-2">
										<Input
											id="tel"
											ref={(el) => (formRef.current.tel = el)}
											type="tel"
											placeholder={formChange.tel ? 'Nuevo número de celular' : userData?.celular}
											disabled={!formChange.tel}
										/>
										{!formChange.tel ? (
											<Button variant="default" onClick={() => handleFormChange('tel')}>
												Editar
											</Button>
										) : (
											<Button variant="default" onClick={handleClick}>
												Guardar
											</Button>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</main>
		</div>
	);
}
