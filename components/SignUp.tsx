'use client';
import { ReceiptPercentIcon } from '@heroicons/react/24/outline';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { TicketIcon } from '@heroicons/react/24/outline';
import { collection, addDoc } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';

export default function SignUp() {
	const { user, signup, logout } = useAuth();
	const [cacheUser, setCacheUser] = useState('');

	const [form, setForm] = useState({
		email: '',
		password: '',
		confirmPassword: '',
	});

	const [form2, setForm2] = useState({
		name: '',
		id: '',
		cellphone: '',
	});

	useEffect(() => {
		const fetchData = async () => {
			await logout();
		};

		try {
			fetchData();
		} catch (err) {
			console.log(err);
		}
	}, []);

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
		}

		try {
			const docRef = await addDoc(collection(db, 'users', user.email, 'data'), {
				nombre: form2.name,
				cedula: form2.id,
				celular: form2.cellphone,
			});
			console.log('Document written with ID: ', docRef.id);
		} catch (e) {
			console.error(e);
		}

		console.log(form2);

		setForm2({
			name: '',
			id: '',
			cellphone: '',
		});
	}

	return (
		<div className="bg-white md:flex">
			<div className="flex flex-col items-center justify-center h-screen p-8 md:border-r md:border-black md:w-1/3">
				<h1 className="mb-12 text-4xl">Crea tu cuenta</h1>
				<div className="flex flex-col gap-4">
					<div className="flex w-full gap-2 md:max-w-3xl">
						<div className="w-12 h-12 p-2 bg-yellow-400 rounded">
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
					<button
						type="button"
						onClick={handleOnSubmit}
						className="md:w-full focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-12 py-2.5 dark:focus:ring-yellow-900"
					>
						Continuar
					</button>
				</form>
			) : (
				<form className="flex flex-col justify-center h-screen p-8 mx-auto md:w-1/2 xl:w-1/3">
					<h1>{user.email}</h1>
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
					<button
						type="button"
						onClick={handleOnSubmit2}
						className="md:w-full focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-12 py-2.5 dark:focus:ring-yellow-900"
					>
						Continuar
					</button>
				</form>
			)}
		</div>
	);
}
