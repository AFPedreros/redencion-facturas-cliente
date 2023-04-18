'use client';
// Importa las funciones doc, setDoc y getDoc de Firebase Firestore
import { doc, getDoc, setDoc } from 'firebase/firestore';
// Importa el hook useState y useEffect de React para usar el estado local y verificar siel usuario está logueado cuando se carga la página
import { useState, useEffect } from 'react';
// Importa el hook useRouter de Next.js
import { useRouter } from 'next/navigation';
// Importa la instancia de la base de datos de Firebase
import { db } from '../../firebase';
// Importa el hook personalizado useAuth
import { useAuth } from '../../context/AuthContext';

export default function page() {
	// Usa el hook useAuth para obtener el usuario
	const { user } = useAuth();
	// Usa el hook useRouter para obtener acceso al router de Next.js
	const router = useRouter();

	const [form, setForm] = useState({
		name: '',
		id: '',
		tel: '',
	});

	// Estado inicial de la información del usuario
	const [userData, setUserData] = useState<any>();

	const [changingData, setIsChangingData] = useState(false);
	const [isChangingName, setIsChangingName] = useState(false);
	const [isChangingId, setIsChangingId] = useState(false);
	const [isChangingCel, setIsChangingCel] = useState(false);

	// Este hook vuelve y renderiza la pantalla cada vez que cambia el valor de 'user' o 'router'.
	useEffect(() => {
		// Si 'user' es nulo, redirige al usuario a la página de inicio.
		// Si 'user' tiene un valor, obtiene los datos del usuario en Firestore y los almacena en el estado local 'userData'.
		if (user === null) {
			router.push('/');
		} else {
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
		}
	}, [user, router, isChangingName, isChangingId, isChangingCel]);

	// Función para controlar los cambios de estado de los inputs del formulario para crear la cuenta
	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { value, name } = e.target;
		setForm((prevState) => {
			return {
				...prevState,
				[name]: value,
			};
		});
	}

	// ToDo: Función para sobreescribir los datos del usuario en la base de datos
	async function handleClick() {
		const name = form.name !== '' ? form.name : userData?.nombre;
		const id = form.id !== '' ? form.id : userData?.cedula;
		const tel = form.tel !== '' ? form.tel : userData?.celular;

		try {
			await setDoc(doc(db, 'users', user?.email), {
				nombre: name,
				cedula: id,
				celular: tel,
			});
		} catch (e) {
			console.error(e);
		}
		// setIsChangingData((prev) => !prev);
		setIsChangingName(false);
		setIsChangingId(false);
		setIsChangingCel(false);

		setForm({
			name: '',
			id: '',
			tel: '',
		});
	}

	return (
		<>
			{!userData ? (
				<div className="pt-10 bg-white">
					<main className="flex flex-col h-screen p-4 mx-auto md:px-12 xl:px-24">
						<div className="px-6 pt-10 mb-6 text-left border-b-2 md:px-0 md:text-left border-slate-300">
							<div className="w-full mb-6 md:items-end md:flex md:justify-between">
								<h2 className="mb-2 text-2xl font-light mb:mb-0">Mi cuenta</h2>
								<button
									type="button"
									onClick={() => router.push('/facturas')}
									className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-600 font-medium rounded-lg text-sm px-12 py-2.5"
								>
									Revisa tus facturas
								</button>
							</div>
						</div>
						<div className="pt-10 mb-6 text-center border-b-2 md:text-left border-slate-300">
							<div className="justify-between w-full text-left md:flex">
								<div className="w-full px-6 mb-6 md:px-0 md:w-2/5">
									<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre completo</label>
									<input
										className="bg-gray-50 border w-full border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
										value={form.name}
										onChange={handleChange}
										type="text"
										placeholder="Cargando..."
										required
										name="name"
										disabled={true}
									/>
								</div>
								<div className="w-full px-6 mb-6 md:px-0 md:w-2/5">
									<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cédula</label>
									<input
										className="bg-gray-50 w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
										value={form.id}
										onChange={handleChange}
										type="text"
										placeholder="Cargando..."
										required
										name="id"
										disabled={true}
									/>
								</div>
							</div>
							<div className="justify-between w-full text-left md:flex">
								<div className="w-full px-6 mb-6 md:px-0 md:w-2/5">
									<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Celular</label>
									<input
										className="bg-gray-50 border w-full border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
										value={form.tel}
										onChange={handleChange}
										type="phone"
										placeholder="Cargando..."
										required
										name="cel"
										disabled={true}
									/>
								</div>
								<div className="w-full px-6 mb-6 md:px-0 md:w-2/5">
									<label className="block mb-2 text-sm font-medium text-gray-900">Correo electrónico</label>
									<input
										className="bg-gray-50 w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
										type="email"
										placeholder="Cargando..."
										required
										name="email"
										disabled={true}
									/>
								</div>
							</div>
						</div>
					</main>
				</div>
			) : (
				<div className="pt-10 bg-white">
					<main className="flex flex-col h-screen p-4 mx-auto md:px-12 xl:px-24">
						<div className="px-6 pt-10 mb-6 text-left border-b-2 md:px-0 md:text-left border-slate-300">
							<div className="w-full mb-6 text-center md:items-end md:flex md:justify-between">
								<h2 className="mb-2 text-2xl font-light mb:mb-0">Mi cuenta</h2>
								<button
									type="button"
									onClick={() => router.push('/facturas')}
									className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-600 font-medium rounded-lg text-sm px-12 py-2.5"
								>
									Revisa tus facturas
								</button>
							</div>
						</div>
						<div className="pt-10 mb-6 text-center border-b-2 md:text-left border-slate-300">
							<div className="justify-between w-full text-left md:flex">
								<div className="w-full px-6 mb-6 md:px-0 md:w-2/5">
									<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Correo electrónico</label>
									<input
										className="bg-gray-50 w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
										type="email"
										placeholder={user?.email}
										required
										name="email"
										disabled={true}
									/>
								</div>
								<div className="w-full px-6 mb-6 md:px-0 md:w-2/5">
									<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre completo</label>
									<div className="flex gap-2">
										<input
											className="bg-gray-50 border w-full border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
											value={form.name}
											onChange={handleChange}
											type="text"
											placeholder={isChangingName ? 'Nuevo nombre de usuario' : userData?.nombre}
											required
											name="name"
											disabled={!isChangingName}
										/>
										{!isChangingName ? (
											<button
												type="button"
												onClick={() => setIsChangingName(true)}
												className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-700 font-medium rounded-lg text-sm px-6 md:px-12 py-2.5"
											>
												Editar
											</button>
										) : (
											<button
												type="button"
												onClick={handleClick}
												className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-700 font-medium rounded-lg text-sm px-6 md:px-12 py-2.5"
											>
												Guardar
											</button>
										)}
									</div>
								</div>
							</div>
							<div className="justify-between w-full text-left md:flex">
								<div className="w-full px-6 mb-6 md:px-0 md:w-2/5">
									<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cédula</label>
									<div className="flex gap-2">
										<input
											className="bg-gray-50 w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
											value={form.id}
											onChange={handleChange}
											type="text"
											placeholder={isChangingId ? 'Nuevo número de cédula' : userData?.cedula}
											required
											name="id"
											disabled={!isChangingId}
										/>
										{!isChangingId ? (
											<button
												type="button"
												onClick={() => setIsChangingId(true)}
												className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-700 font-medium rounded-lg text-sm px-6 md:px-12 py-2.5"
											>
												Editar
											</button>
										) : (
											<button
												type="button"
												onClick={handleClick}
												className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-700 font-medium rounded-lg text-sm px-6 md:px-12 py-2.5"
											>
												Guardar
											</button>
										)}
									</div>
								</div>
								<div className="w-full px-6 mb-6 md:px-0 md:w-2/5">
									<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Celular</label>
									<div className="flex gap-2">
										<input
											className="bg-gray-50 w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
											value={form.tel}
											onChange={handleChange}
											type="tel"
											placeholder={isChangingCel ? 'Nuevo número de celular' : userData?.celular}
											required
											name="tel"
											disabled={!isChangingCel}
										/>
										{!isChangingCel ? (
											<button
												type="button"
												onClick={() => setIsChangingCel((prev) => !prev)}
												className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-700 font-medium rounded-lg text-sm px-6 md:px-12 py-2.5"
											>
												Editar
											</button>
										) : (
											<button
												type="button"
												onClick={handleClick}
												className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-700 font-medium rounded-lg text-sm px-6 md:px-12 py-2.5"
											>
												Guardar
											</button>
										)}
									</div>
								</div>
							</div>
							{/* {!isChangingData ? (
								<button
									type="button"
									onClick={() => setIsChangingData((prev) => !prev)}
									className="focus:outline-none mb-6 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-700 font-medium rounded-lg text-sm px-12 py-2.5"
								>
									Editar datos
								</button>
							) : (
								<button
									type="button"
									onClick={handleClick}
									className="focus:outline-none mb-6 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-700 font-medium rounded-lg text-sm px-12 py-2.5"
								>
									Guardar cambios
								</button>
							)} */}
						</div>
					</main>
				</div>
			)}
		</>
	);
}
