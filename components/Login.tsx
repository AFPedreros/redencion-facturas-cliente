'use client';
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
		<form className="flex flex-col justify-center p-8 mx-auto md:h-screen md:w-1/2 xl:w-1/3">
			<h2 className="text-2xl font-semibold text-center">Bienvenido de nuevo</h2>
			<p className="mx-auto mb-4 text-sm text-muted-foreground">Ingresa tu correo y contraseña</p>
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
			<button
				type="button"
				onClick={handleOnSubmit}
				className="md:w-full focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-600 font-medium rounded-lg text-sm px-12 py-2.5"
			>
				Ingresar
			</button>
			<div className="flex gap-2 mx-auto mb-4 text-sm h-fit">
				<p>¿Aún no estas registrado?</p>
				<Link className="font-bold border-b-2 border-black" href="/registro">
					Regístrate aquí
				</Link>
			</div>
		</form>
	);
}
