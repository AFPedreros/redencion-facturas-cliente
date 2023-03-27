'use client';
// Importa los íconos de ReceiptPercentIcon, DocumentTextIcon y TicketIcon desde la biblioteca Heroicons
import { ReceiptPercentIcon } from '@heroicons/react/24/outline';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { TicketIcon } from '@heroicons/react/24/outline';
// Importa las funciones doc y setDoc de Firebase Firestore
import { doc, setDoc } from 'firebase/firestore';
// Importa el hook useState de React para usar el estado local
import { useState } from 'react';
// Importa el hook useRouter y el componente Link de Next.js
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// Importa la instancia de la base de datos de Firebase
import { db } from '../firebase';
// Importa el hook personalizado useAuth
import { useAuth } from '../context/AuthContext';

export default function SignUp() {
	// Usa el hook useAuth para obtener el usuario y la función signup
	const { user, signup } = useAuth();
	// Usa el hook useRouter para obtener acceso al router de Next.js
	const router = useRouter();

	// Estado inicial del formulario para crear la cuenta
	const [registrationForm, setRegistrationForm] = useState({
		email: '',
		password: '',
		confirmPassword: '',
	});

	// Estado inicial del formulario para agregar los datos personales
	const [personalInfoForm, setPersonalInfoForm] = useState({
		name: '',
		id: '',
		cellphone: '',
		check: false,
	});

	// Función para controlar los cambios de estado de los inputs del formulario para crear la cuenta
	function handleChangeRegistration(e: React.ChangeEvent<HTMLInputElement>) {
		const { value, name } = e.target;
		setRegistrationForm((prevState) => {
			return {
				...prevState,
				[name]: value,
			};
		});
	}

	// Función para controlar los cambios de estado de los inputs del formulario para agregar los datos personales
	function handleChangePersonalInfo(e: React.ChangeEvent<HTMLInputElement>) {
		const { value, name } = e.target;
		setPersonalInfoForm((prevState) => {
			return {
				...prevState,
				[name]: value,
			};
		});
	}

	// Función para manejar el envío de formulario de registro de usuario, validando los campos y llamando a la función de registro de usuario.
	async function handleOnSubmitRegistration(e: React.MouseEvent<HTMLButtonElement>) {
		e.preventDefault();

		if (!registrationForm.email) {
			alert('Por favor ingresa un email.');
			return false;
		} else if (!registrationForm.password || !registrationForm.confirmPassword) {
			alert('Por favor ingresa una contraseña.');
			return false;
		} else if (registrationForm.password.length < 6) {
			alert('La contraseña debe tener al menos 6 caracteres.');
			return false;
		} else if (registrationForm.password !== registrationForm.confirmPassword) {
			alert('Las contraseñas no coinciden.');
			return false;
		}

		try {
			await signup(registrationForm.email, registrationForm.password);
		} catch (e) {
			console.log(e);
		}

		setRegistrationForm({
			email: '',
			password: '',
			confirmPassword: '',
		});
	}

	// Función para manejar el envío de formulario de registro de datos del usuario, validando los campos y creando una colección de datos en la tabla de Firebase.
	async function handleOnSubmitPersonalInfo(e: React.MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		if (!personalInfoForm.name) {
			alert('Por favor ingresa tu nombre.');
			return false;
		} else if (!personalInfoForm.id) {
			alert('Por favor ingresa tu número de identidad.');
			return false;
		} else if (!personalInfoForm.cellphone) {
			alert('Por favor ingresa tu número de celular.');
			return false;
		} else if (personalInfoForm.check === false) {
			alert('Por favor acepta los términos y condiciones.');
			return false;
		}

		try {
			const docRef = await setDoc(doc(db, 'users', user?.email), {
				nombre: personalInfoForm.name,
				cedula: personalInfoForm.id,
				celular: personalInfoForm.cellphone,
			});
		} catch (e) {
			console.error(e);
		}

		setPersonalInfoForm({
			name: '',
			id: '',
			cellphone: '',
			check: false,
		});
		router.push('/facturas');
	}

	return (
		<div className="bg-white md:flex">
			<div className="flex flex-col items-center justify-center p-8 md:h-screen md:border-r md:border-black md:w-1/3">
				<h1 className="mb-12 text-4xl">Crea tu cuenta</h1>
				<div className="flex flex-col gap-4">
					<div className="flex w-full gap-2 md:max-w-3xl">
						<div className="w-12 h-12 p-2 bg-blue-700 rounded">
							<DocumentTextIcon className="text-white" />
						</div>
						<p className="w-4/5">Registra tus datos personales</p>
					</div>
					<div className="flex w-full gap-2 md:max-w-3xl">
						<div className="w-12 h-12 p-2 rounded bg-slate-200">
							<ReceiptPercentIcon className="text-white" />
						</div>
						<p className="w-4/5 text-slate-200">Agrega tus facturas y espera su aprobación</p>
					</div>
					<div className="flex w-full gap-2 md:max-w-3xl">
						<div className="w-12 h-12 p-2 rounded bg-slate-200">
							<TicketIcon className="text-white" />
						</div>
						<p className="w-4/5 text-slate-200">Obtén un código y participa en los sorteos</p>
					</div>
				</div>
			</div>
			{!user ? (
				<form className="flex flex-col justify-center p-8 mx-auto md:h-screen md:w-1/2 xl:w-1/3">
					<input
						className="bg-gray-50 md:w-full border mb-4 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						value={registrationForm.email}
						onChange={handleChangeRegistration}
						type="email"
						placeholder="Correo Electrónico"
						required
						name="email"
					/>
					<input
						value={registrationForm.password}
						onChange={handleChangeRegistration}
						type="password"
						className="bg-gray-50 mb-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						placeholder="Contraseña"
						required
						name="password"
					/>
					<input
						value={registrationForm.confirmPassword}
						onChange={handleChangeRegistration}
						type="password"
						className="bg-gray-50 mb-6 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						placeholder="Repetir contraseña"
						required
						name="confirmPassword"
					/>
					<div className="flex gap-2 mx-auto mb-4 text-sm h-fit">
						<p>¿Ya estás registrado?</p>
						<Link className="font-bold border-b-2 border-black" href="/">
							Inicia sesión aquí
						</Link>
					</div>
					<button
						type="button"
						onClick={handleOnSubmitRegistration}
						className="md:w-full focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-600 font-medium rounded-lg text-sm px-12 py-2.5"
					>
						Continuar
					</button>
				</form>
			) : (
				<form className="flex flex-col justify-center p-8 mx-auto md:h-screen md:w-1/2 xl:w-1/3">
					<input
						className="bg-gray-50 md:w-full border mb-4 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						value={personalInfoForm.name}
						onChange={handleChangePersonalInfo}
						type="text"
						placeholder="Nombre completo"
						required
						name="name"
					/>
					<input
						value={personalInfoForm.id}
						onChange={handleChangePersonalInfo}
						type="text"
						className="bg-gray-50 mb-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						placeholder="Número de documento"
						required
						name="id"
					/>
					<input
						value={personalInfoForm.cellphone}
						onChange={handleChangePersonalInfo}
						type="tel"
						className="bg-gray-50 mb-6 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						placeholder="Número de celular"
						required
						name="cellphone"
					/>
					<div className="flex items-start mb-6">
						<div className="flex items-center h-5">
							<input
								id="remember"
								type="checkbox"
								checked={personalInfoForm.check}
								value={personalInfoForm.check.toString()}
								onClick={() => {
									setPersonalInfoForm((prevState) => {
										return {
											...prevState,
											check: !personalInfoForm.check,
										};
									});
								}}
								className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
								required
							/>
						</div>
						<label className="ml-2 text-sm text-gray-900 dark:text-gray-300">Acepto términos y condiciones de la actividad</label>
					</div>
					<button
						type="button"
						onClick={handleOnSubmitPersonalInfo}
						className="md:w-full focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-600 font-medium rounded-lg text-sm px-12 py-2.5"
					>
						Continuar
					</button>
				</form>
			)}
		</div>
	);
}
