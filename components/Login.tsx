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
		} else if (!formRef.current.password.value) {
			alert('Por favor ingresa una contraseña.');
			return false;
		}

		try {
			await login(formRef.current.email.value, formRef.current.password.value);
			router.push(routes.receipts);
		} catch (e) {
			console.log(e);
			alert('Usuario o contraseña incorrecta.');
		}
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
			<Input id="email" ref={(el) => (formRef.current.email = el)} placeholder="Correo Electrónico" type="email" onKeyDown={handleKeyDown} required />
			<Input id="password" ref={(el) => (formRef.current.password = el)} placeholder="•••••••••" type="password" onKeyDown={handleKeyDown} required />
			<Button onClick={handleOnSubmit}>Ingresar</Button>
		</form>
	);
}
