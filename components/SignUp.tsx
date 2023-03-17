'use client';
import { ReceiptPercentIcon } from '@heroicons/react/24/outline';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { TicketIcon } from '@heroicons/react/24/outline';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import Link from 'next/link';

export default function SignUp() {
	const { user, signup } = useAuth();
	const router = useRouter();

	const [form, setForm] = useState({
		email: '',
		password: '',
		confirmPassword: '',
	});

	const [form2, setForm2] = useState({
		name: '',
		id: '',
		cellphone: '',
		check: false,
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

	function handleChange2(e: React.ChangeEvent<HTMLInputElement>) {
		const { value, name } = e.target;
		setForm2((prevState) => {
			return {
				...prevState,
				[name]: value,
			};
		});
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
		}

		try {
			await signup(form.email, form.password);
		} catch (e) {
			console.log(e);
		}

		console.log(form);

		setForm({
			email: '',
			password: '',
			confirmPassword: '',
		});
	}

	async function handleOnSubmit2(e: React.MouseEvent<HTMLButtonElement>) {
		e.preventDefault();
		if (!form2.name) {
			alert('Por favor ingresa tu nombre.');
			return false;
		} else if (!form2.id) {
			alert('Por favor ingresa tu número de identidad.');
			return false;
		} else if (!form2.cellphone) {
			alert('Por favor ingresa tu número de celular.');
			return false;
		} else if (form2.check === false) {
			alert('Por favor acepta los términos y condiciones.');
			return false;
		}

		try {
			// const docRef = await addDoc(collection(db, 'users', user.email, 'data'), {
			// 	nombre: form2.name,
			// 	cedula: form2.id,
			// 	celular: form2.cellphone,
			// });

			const docRef = await setDoc(doc(db, 'users', user?.email), {
				nombre: form2.name,
				cedula: form2.id,
				celular: form2.cellphone,
			});
			// console.log('Document written with ID: ', docRef.id);
			router.push('/facturas');
		} catch (e) {
			console.error(e);
		}

		console.log(form2);

		setForm2({
			name: '',
			id: '',
			cellphone: '',
			check: false,
		});
	}

	return (
		<div className="bg-white md:flex">
			<div className="flex flex-col items-center justify-center h-screen p-8 md:border-r md:border-black md:w-1/3">
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
				<form className="flex flex-col justify-center h-screen p-8 mx-auto md:w-1/2 xl:w-1/3">
					<input
						className="bg-gray-50 md:w-full border mb-4 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						value={form.email}
						onChange={handleChange}
						type="email"
						placeholder="Correo Electrónico"
						required
						name="email"
					/>
					<input
						value={form.password}
						onChange={handleChange}
						type="password"
						className="bg-gray-50 mb-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						placeholder="Contraseña"
						required
						name="password"
					/>
					<input
						value={form.confirmPassword}
						onChange={handleChange}
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
						onClick={handleOnSubmit}
						className="md:w-full focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-600 font-medium rounded-lg text-sm px-12 py-2.5"
					>
						Continuar
					</button>
				</form>
			) : (
				<form className="flex flex-col justify-center h-screen p-8 mx-auto md:w-1/2 xl:w-1/3">
					<input
						className="bg-gray-50 md:w-full border mb-4 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						value={form2.name}
						onChange={handleChange2}
						type="text"
						placeholder="Nombre completo"
						required
						name="name"
					/>
					<input
						value={form2.id}
						onChange={handleChange2}
						type="text"
						className="bg-gray-50 mb-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
						placeholder="Número de documento"
						required
						name="id"
					/>
					<input
						value={form2.cellphone}
						onChange={handleChange2}
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
								checked={form2.check}
								value={form2.check.toString()}
								onClick={() => {
									setForm2((prevState) => {
										return {
											...prevState,
											check: !form2.check,
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
						onClick={handleOnSubmit2}
						className="md:w-full focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-600 font-medium rounded-lg text-sm px-12 py-2.5"
					>
						Continuar
					</button>
				</form>
			)}
		</div>
	);
}
