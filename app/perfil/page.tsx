'use client';
// Importa las funciones doc, setDoc y getDoc de Firebase Firestore
import { doc, getDoc, setDoc } from 'firebase/firestore';
// Importa el hook useState y useEffect de React para usar el estado local y verificar siel usuario está logueado cuando se carga la página
import { useState, useEffect, useRef } from 'react';
// Importa el hook useRouter de Next.js
import { useRouter, redirect } from 'next/navigation';
// Importa la instancia de la base de datos de Firebase
import { db } from '../../firebase';
// Importa el hook personalizado useAuth
import { useAuth } from '../../context/AuthContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

export default function page() {
	// Usa el hook useAuth para obtener el usuario
	const { user } = useAuth();

	// Usa el hook useRouter para obtener acceso al router de Next.js
	const router = useRouter();

	const formRef = useRef<any>({ name: null, id: null, tel: null });
	const [formChange, setFormChange] = useState<any>({ name: false, id: false, tel: false });
	const { toast } = useToast();

	// Estado inicial de la información del usuario
	const [userData, setUserData] = useState<any>();

	//Este hook vuelve y renderiza la pantalla cada vez que cambia el valor de 'user' o 'router'.
	useEffect(() => {
		if (user === null) {
			redirect('/');
		}
		//Si 'user' es nulo, redirige al usuario a la página de inicio.
		//Si 'user' tiene un valor, obtiene los datos del usuario en Firestore y los almacena en el estado local 'userData'.
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
	}, [user, formChange]);

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
			<main className="flex flex-col h-screen px-4 pt-10 mx-auto md:px-12 xl:px-24">
				<div className="px-6 pt-10 text-left border-b-2 md:mb-6 md:px-0 md:text-left border-slate-300">
					<div className="w-full mb-4 text-center md:text-left md:items-end md:flex md:justify-between">
						<h2 className="mb-2 text-2xl font-light mb:mb-0">Mi cuenta</h2>
						<Button variant="outline" onClick={() => router.push('/facturas')}>
							Revisa tus facturas
						</Button>
					</div>
				</div>
				{!userData ? (
					<div className="pt-6 mb-4 text-center border-b-2 md:pt-10 md:text-left border-slate-300">
						<div className="justify-between w-full text-left md:flex">
							<div className="w-full px-6 mb-6 md:px-0 md:w-2/5">
								<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Correo electrónico</label>
								<Input id="email" type="email" placeholder="Cargando..." disabled />
							</div>
							<div className="w-full px-6 mb-6 md:px-0 md:w-2/5">
								<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre completo</label>
								<Input id="email" type="email" placeholder="Cargando..." disabled />
							</div>
						</div>
						<div className="justify-between w-full text-left md:flex">
							<div className="w-full px-6 mb-6 md:px-0 md:w-2/5">
								<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cédula</label>
								<Input id="email" type="email" placeholder="Cargando..." disabled />
							</div>
							<div className="w-full px-6 mb-6 md:px-0 md:w-2/5">
								<label className="block mb-2 text-sm font-medium text-gray-900">Celular</label>
								<Input id="email" type="email" placeholder="Cargando..." disabled />
							</div>
						</div>
					</div>
				) : (
					<div className="pt-6 text-center border-b-2 md:pt-10 md:mb-6 md:text-left border-slate-300">
						<div className="justify-between w-full text-left md:flex">
							<div className="w-full px-6 mb-6 md:px-0 md:w-2/5">
								<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Correo electrónico</label>
								<Input id="email" type="email" placeholder={user?.email} disabled />
							</div>
							<div className="w-full px-6 mb-6 md:px-0 md:w-2/5">
								<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre completo</label>
								<div className="flex gap-2">
									<div className="flex items-center w-full max-w-sm space-x-2">
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
						<div className="justify-between w-full text-left md:flex">
							<div className="w-full px-6 mb-6 md:px-0 md:w-2/5">
								<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cédula</label>
								<div className="flex items-center w-full max-w-sm space-x-2">
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
							<div className="w-full px-6 mb-6 md:px-0 md:w-2/5">
								<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Celular</label>
								<div className="flex items-center w-full max-w-sm space-x-2">
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
				)}
			</main>
		</div>
	);
}
