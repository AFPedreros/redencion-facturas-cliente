'use client';
import { ReceiptPercentIcon } from '@heroicons/react/24/outline';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { TicketIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';

export default function Login() {
	// const { user, signup } = useAuth();

	const [form, setForm] = useState({
		email: '',
		password: '',
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

	async function handleOnSubmit(e: React.MouseEvent<HTMLButtonElement>) {
		e.preventDefault();

		// if (!form.email) {
		// 	alert('Please enter your email.');
		// 	return false;
		// } else if (!form.password) {
		// 	alert('Please enter your password.');
		// 	return false;
		// }

		// try {
		// 	await signup(form.email, form.password);
		// } catch (err) {
		// 	console.log(err);
		// }

		console.log(form);

		setForm({
			email: '',
			password: '',
		});
	}

	return (
		<div className="bg-white md:flex">
			<div className="flex flex-col items-center justify-center h-screen p-8 md:border-r md:border-black md:w-1/3">
				<h1 className="mb-12 text-4xl">¡Redime tus facturas y participa en increíbles sorteos!</h1>
				<div className="flex flex-col gap-4">
					<div className="flex w-full gap-2 md:max-w-3xl">
						<div className="w-12 h-12 p-2 bg-yellow-400 rounded">
							<DocumentTextIcon className="text-white" />
						</div>
						<p className="w-4/5">Registra tus datos personales</p>
					</div>
					<div className="flex w-full gap-2 md:max-w-3xl">
						<div className="w-12 h-12 p-2 bg-yellow-400 rounded">
							<ReceiptPercentIcon className="text-white" />
						</div>
						<p className="w-4/5">Agrega tus facturas y espera su aprobación</p>
					</div>
					<div className="flex w-full gap-2 md:max-w-3xl">
						<div className="w-12 h-12 p-2 bg-yellow-400 rounded">
							<TicketIcon className="text-white" />
						</div>
						<p className="w-4/5">Obtén un código y participa en los sorteos</p>
					</div>
				</div>
			</div>
			<form className="flex flex-col justify-center h-screen p-8 mx-auto md:w-2/3">
				<h2 className="mb-12 text-2xl font-light text-center">Iniciar sesión</h2>
				<input
					value={form.email}
					onChange={handleChange}
					type="email"
					className="bg-gray-50 md:max-w-md md:mx-auto border mb-4 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
					placeholder="Correo Electrónico"
					required
					name="email"
				/>
				<input
					value={form.password}
					onChange={handleChange}
					type="password"
					className="bg-gray-50 mb-12 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:max-w-md md:mx-auto p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
					placeholder="•••••••••"
					required
					name="password"
				/>
				<p className="mx-auto mb-2 text-[#707070] text-sm">Olvidé mi contraseña</p>
				<div className="flex gap-2 mx-auto text-sm h-fit">
					<p>¿Aún no estas registrado?</p>
					<a className="font-bold border-b-2 border-black" href="https://heroicons.com/">
						Regístrate aquí
					</a>
				</div>
				<button
					type="button"
					onClick={handleOnSubmit}
					className="mt-8 md:w-fit focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-12 md:mx-auto py-2.5 mr-2 mb-2 dark:focus:ring-yellow-900"
				>
					Ingresar
				</button>
			</form>
		</div>
	);
}
