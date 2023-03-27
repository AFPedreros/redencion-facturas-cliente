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

	const [isChangingData, setIsChangingData] = useState(false);

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
	}, [user, router, isChangingData]);

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
		setIsChangingData((prev) => !prev);

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
						</div>
					</main>
				</div>
			) : (
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
										placeholder={isChangingData ? 'Nuevo número de nombre de usuario' : userData?.nombre}
										required
										name="name"
										disabled={!isChangingData}
									/>
								</div>
								<div className="w-full px-6 mb-6 md:px-0 md:w-2/5">
									<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cédula</label>
									<input
										className="bg-gray-50 w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
										value={form.id}
										onChange={handleChange}
										type="text"
										placeholder={isChangingData ? 'Nuevo número de cédula' : userData?.cedula}
										required
										name="id"
										disabled={!isChangingData}
									/>
								</div>
							</div>
							<div className="justify-between w-full text-left md:flex">
								<div className="w-full px-6 mb-6 md:px-0 md:w-2/5">
									<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Celular</label>
									<input
										className="bg-gray-50 w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
										value={form.tel}
										onChange={handleChange}
										type="tel"
										placeholder={isChangingData ? 'Nuevo número de celular' : userData?.celular}
										required
										name="tel"
										disabled={!isChangingData}
									/>
								</div>
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
							</div>
							{!isChangingData ? (
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
							)}
						</div>
					</main>
				</div>
			)}
		</>
	);
}
