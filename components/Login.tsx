'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';

const routes = {
	receipts: '/facturas',
};

export default function Login() {
	const { login } = useAuth();
	const router = useRouter();

	const passwordRef = useRef<HTMLInputElement>(null);
	const formRef = useRef<any>({ email: '', password: '' });

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

		if (!formRef.current.email.value) {
			alert('Por favor ingresa un email.');
			return false;
		} else if (!form.password) {
			alert('Por favor ingresa una contraseña.');
			return false;
		}

		try {
			await login(formRef.current.email.value, form.password);
			router.push(routes.receipts);
		} catch (e) {
			console.log(e);
			alert('Usuario o contraseña incorrecta.');
		}

		setForm({
			email: '',
			password: '',
		});
	}

	function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === 'Enter') {
			passwordRef.current?.blur();
			handleOnSubmit(e as any);
		}
	}

	return (
		<form className="flex flex-col justify-center gap-3">
			<div>
				<h2 className="text-2xl font-semibold text-center">Bienvenido de nuevo</h2>
				<p className="mx-auto text-sm text-center text-muted-foreground">Ingresa tu correo y contraseña</p>
			</div>
			<Input id="email" ref={(el) => (formRef.current.email = el)} placeholder="Correo Electrónico" type="email" required />
			{/* <input
				value={form.email}
				onChange={handleChange}
				type="email"
				className="bg-gray-50 md:w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
				placeholder="Correo Electrónico"
				required
				name="email"
			/> */}
			<input
				value={form.password}
				onChange={handleChange}
				type="password"
				className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
				placeholder="•••••••••"
				required
				name="password"
				ref={passwordRef}
				onKeyDown={handleKeyDown}
			/>
			<Button onClick={handleOnSubmit}>Ingresar</Button>
			<div className="flex flex-col items-center">
				<p className="mx-auto text-sm text-center text-muted-foreground">Dando click en continuar aceptas nuestros</p>
				<Link className="mx-auto text-sm font-bold border-b-2 border-black" href="#">
					Términos & condiciones
				</Link>
			</div>
		</form>
	);
}
