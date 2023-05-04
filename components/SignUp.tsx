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
	const { user, signup } = useAuth();
	const router = useRouter();

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

	const [form, setForm] = useState({
		name: '',
		id: '',
		cellphone: '',
		check: false,
		email: '',
		password: '',
		confirmPassword: '',
	});

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { value, name } = e.target;
		setForm((prevState) => {
			return {
				...prevState,
				[name]: value,
			};
		});
	}

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

		try {
			await signup(form.email, form.password);
		} catch (e) {
			console.log(e);
		}
	}

	// Función para manejar el envío de formulario de registro de datos del usuario, validando los campos y creando una colección de datos en la tabla de Firebase.
	async function handleOnSubmitPersonalInfo(e: React.MouseEvent<HTMLButtonElement>) {
		e.preventDefault();

		try {
			const docRef = await setDoc(doc(db, 'users', form.email), {
				nombre: form.name,
				cedula: form.id,
				celular: form.cellphone,
			});
		} catch (e) {
			console.error(e);
		}
	}

	async function handleOnSubmit(e: React.MouseEvent<HTMLButtonElement>) {
		e.preventDefault();

		if (!form.email) {
			alert('Por favor ingresa un email.');
			return false;
		} else if (!form.password || !form.confirmPassword) {
			alert('Por favor ingresa una contraseña.');
			return false;
		} else if (form.password.length < 6) {
			alert('La contraseña debe tener al menos 6 caracteres.');
			return false;
		} else if (form.password !== form.confirmPassword) {
			alert('Las contraseñas no coinciden.');
			return false;
		} else if (!form.name) {
			alert('Por favor ingresa tu nombre.');
			return false;
		} else if (!form.id) {
			alert('Por favor ingresa tu número de identidad.');
			return false;
		} else if (!form.cellphone) {
			alert('Por favor ingresa tu número de celular.');
			return false;
		} else if (form.check === false) {
			alert('Por favor acepta los términos y condiciones.');
			return false;
		}

		await handleOnSubmitRegistration(e);
		await handleOnSubmitPersonalInfo(e);

		setForm({
			name: '',
			id: '',
			cellphone: '',
			check: false,
			email: '',
			password: '',
			confirmPassword: '',
		});

		router.push('/facturas');
	}

	return (
		<form className="flex flex-col justify-center">
			<input
				className="bg-gray-50 md:w-full border mb-4 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
				value={form.email}
				onChange={handleChange}
				type="email"
				placeholder="Correo Electrónico"
				required
				name="email"
			/>
			<div className="flex w-full mb-4">
				<input
					value={form.password}
					onChange={handleChange}
					type="password"
					className="bg-gray-50 mr-1 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full md:w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
					placeholder="Contraseña"
					required
					name="password"
				/>
				<input
					value={form.confirmPassword}
					onChange={handleChange}
					type="password"
					className="bg-gray-50 ml-1 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full md:w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
					placeholder="Repetir contraseña"
					required
					name="confirmPassword"
				/>
			</div>

			<input
				className="bg-gray-50 md:w-full border mb-4 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
				value={form.name}
				onChange={handleChange}
				type="text"
				placeholder="Nombre completo"
				required
				name="name"
			/>
			<input
				value={form.id}
				onChange={handleChange}
				type="text"
				className="bg-gray-50 mb-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
				placeholder="Número de documento"
				required
				name="id"
			/>
			<input
				value={form.cellphone}
				onChange={handleChange}
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
						checked={form.check}
						value={form.check.toString()}
						onClick={() => {
							setForm((prevState) => {
								return {
									...prevState,
									check: !form.check,
								};
							});
						}}
						className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800"
						required
					/>
				</div>
				<label className="ml-2 text-sm text-gray-900 dark:text-gray-300">Acepto términos y condiciones de la actividad</label>
			</div>
			<div className="flex gap-2 mx-auto mb-4 text-sm h-fit">
				<p>¿Ya estás registrado?</p>
				<Link className="font-bold border-b-2 border-black" href="/">
					Inicia sesión aquí
				</Link>
			</div>
			<button
				type="button"
				onClick={handleOnSubmit}
				className="md:w-full focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-600 font-medium rounded-lg text-sm px-12 py-2.5"
			>
				Continuar
			</button>
		</form>
	);
}
