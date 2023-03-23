'use client';
// Importa los íconos de ReceiptPercentIcon, DocumentTextIcon y TicketIcon desde la biblioteca Heroicons
import { ReceiptPercentIcon } from '@heroicons/react/24/outline';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { TicketIcon } from '@heroicons/react/24/outline';
// Importa el hook useRouter y el componente Link de Next.js
import Link from 'next/link';
import { useRouter } from 'next/navigation';
// Importa los hooks useState y useRef Link de React.js
import { useState, useRef } from 'react';
// Importa el hook personalizado useAuth
import { useAuth } from '../context/AuthContext';

// Define el objeto de rutas como una constante
const routes = {
	receipts: '/facturas',
};

export default function Login() {
	// Usa el hook useAuth para obtener la función login
	const { login } = useAuth();
	// Usa el hook useRouter para obtener acceso al router de Next.js
	const router = useRouter();

	// Referencia para el campo de contraseña
	const passwordRef = useRef<HTMLInputElement>(null);

	// Estado inicial del formulario
	const [form, setForm] = useState({
		email: '',
		password: '',
	});

	// Función para controlar los cambios de estado de los inputs
	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const { value, name } = e.target;
		// Actualiza el estado del formulario cuando se cambia algún campo
		setForm((prevState) => {
			return {
				...prevState,
				[name]: value,
			};
		});
	}

	// Función para enviar el formulario de inicio de sesión utilizando Firebase
	async function handleOnSubmit(e: React.MouseEvent<HTMLButtonElement>) {
		e.preventDefault();

		// Valida que se hayan ingresado valores en ambos campos
		if (!form.email) {
			alert('Por favor ingresa un email.');
			return false;
		} else if (!form.password) {
			alert('Por favor ingresa una contraseña.');
			return false;
		}

		try {
			// Intenta iniciar sesión con el email y la contraseña ingresados
			await login(form.email, form.password);
			// Redirecciona al usuario a la página de facturas
			router.push(routes.receipts);
		} catch (e) {
			console.log(e);
			// Muestra una alerta en caso de que las credenciales sean incorrectas
			alert('Usuario o contraseña incorrecta.');
		}

		// Restablece el estado del formulario
		setForm({
			email: '',
			password: '',
		});
	}

	// Función para manejar el evento de presionar la tecla Enter en el campo de contraseña
	function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === 'Enter') {
			// Hace que el campo de contraseña deje de estar seleccionado
			passwordRef.current?.blur();
			// Envía el formulario
			handleOnSubmit(e as any);
		}
	}

	return (
		<div className="bg-white md:flex">
			<div className="flex flex-col items-center justify-center p-8 md:h-screen md:border-r md:border-black md:w-1/3">
				<h1 className="mb-12 text-4xl">¡Redime tus facturas y participa en increíbles sorteos!</h1>
				<div className="flex flex-col gap-4">
					<div className="flex w-full gap-2 md:max-w-3xl">
						<div className="w-12 h-12 p-2 bg-blue-700 rounded">
							<DocumentTextIcon className="text-white" />
						</div>
						<p className="w-4/5">Registra tus datos personales</p>
					</div>
					<div className="flex w-full gap-2 md:max-w-3xl">
						<div className="w-12 h-12 p-2 bg-blue-700 rounded">
							<ReceiptPercentIcon className="text-white" />
						</div>
						<p className="w-4/5">Agrega tus facturas y espera su aprobación</p>
					</div>
					<div className="flex w-full gap-2 md:max-w-3xl">
						<div className="w-12 h-12 p-2 bg-blue-700 rounded">
							<TicketIcon className="text-white" />
						</div>
						<p className="w-4/5">Obtén un código y participa en los sorteos</p>
					</div>
				</div>
			</div>
			<form className="flex flex-col justify-center p-8 mx-auto md:h-screen md:w-1/2 xl:w-1/3">
				<h2 className="mb-12 text-2xl font-light text-center">Iniciar sesión</h2>
				<input
					value={form.email}
					onChange={handleChange}
					type="email"
					className="bg-gray-50 md:w-full border mb-4 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
					placeholder="Correo Electrónico"
					required
					name="email"
				/>
				<input
					value={form.password}
					onChange={handleChange}
					type="password"
					className="bg-gray-50 mb-4 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
					placeholder="•••••••••"
					required
					name="password"
					ref={passwordRef}
					onKeyDown={handleKeyDown}
				/>
				<p className="mx-auto mb-2 text-[#707070] text-sm">Olvidé mi contraseña</p>
				<div className="flex gap-2 mx-auto mb-4 text-sm h-fit">
					<p>¿Aún no estas registrado?</p>
					<Link className="font-bold border-b-2 border-black" href="/registro">
						Regístrate aquí
					</Link>
				</div>
				<button
					type="button"
					onClick={handleOnSubmit}
					className="md:w-full focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-600 font-medium rounded-lg text-sm px-12 py-2.5"
				>
					Ingresar
				</button>
			</form>
		</div>
	);
}
