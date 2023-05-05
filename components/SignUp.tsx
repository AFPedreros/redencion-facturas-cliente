'use client';
// Importa los íconos de ReceiptPercentIcon, DocumentTextIcon y TicketIcon desde la biblioteca Heroicons
import { ReceiptPercentIcon } from '@heroicons/react/24/outline';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { TicketIcon } from '@heroicons/react/24/outline';
// Importa las funciones doc y setDoc de Firebase Firestore
import { doc, setDoc } from 'firebase/firestore';
import { useState, useRef } from 'react';
// Importa el hook useRouter y el componente Link de Next.js
import { useRouter } from 'next/navigation';
import Link from 'next/link';
// Importa la instancia de la base de datos de Firebase
import { db } from '../firebase';
// Importa el hook personalizado useAuth
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { useToast } from '@/components/ui/use-toast';

export default function SignUp() {
	const { signup } = useAuth();
	const router = useRouter();

	const { toast } = useToast();

	// Estado inicial del formulario para agregar los datos personales
	const formRef = useRef<any>({
		name: '',
		id: '',
		cellphone: '',
		email: '',
		password: '',
		confirmPassword: '',
	});

	// Función para manejar el envío de formulario de registro de usuario, validando los campos y llamando a la función de registro de usuario.
	async function handleOnSubmitRegistration(e: React.MouseEvent<HTMLButtonElement>) {
		e.preventDefault();

		const email = formRef.current.email.value;
		const password = formRef.current.password.value;

		try {
			await signup(email, password);
		} catch (e) {
			console.log(e);
		}
	}

	// Función para manejar el envío de formulario de registro de datos del usuario, validando los campos y creando una colección de datos en la tabla de Firebase.
	async function handleOnSubmitPersonalInfo(e: React.MouseEvent<HTMLButtonElement>) {
		e.preventDefault();

		const name = formRef.current.name.value;
		const id = formRef.current.id.value;
		const tel = formRef.current.cellphone.value;
		const email = formRef.current.email.value;

		try {
			await setDoc(doc(db, 'users', email), {
				nombre: name,
				cedula: id,
				celular: tel,
			});
		} catch (e) {
			console.error(e);
		}
	}

	async function handleOnSubmit(e: React.MouseEvent<HTMLButtonElement>) {
		e.preventDefault();

		const name = formRef.current.name.value;
		const id = formRef.current.id.value;
		const tel = formRef.current.cellphone.value;
		const email = formRef.current.email.value;
		const password = formRef.current.password.value;
		const confirmPassword = formRef.current.confirmPassword.value;

		if (!name) {
			toast({
				variant: 'destructive',
				description: 'Por favor ingresa tu nombre.',
			});
			return false;
		} else if (!id) {
			toast({
				variant: 'destructive',
				description: 'Por favor ingresa tu número de identidad.',
			});
			return false;
		} else if (!tel) {
			toast({
				variant: 'destructive',
				description: 'Por favor ingresa tu número de celular.',
			});
			return false;
		} else if (!email) {
			toast({
				variant: 'destructive',
				description: 'Por favor ingresa un email.',
			});
			return false;
		} else if (!password || !confirmPassword) {
			toast({
				variant: 'destructive',
				description: 'Por favor ingresa una contraseña.',
			});
			return false;
		} else if (password.length < 6) {
			toast({
				variant: 'destructive',
				description: 'La contraseña debe tener al menos 6 caracteres.',
			});
			return false;
		} else if (password !== confirmPassword) {
			toast({
				variant: 'destructive',
				description: 'Las contraseñas no coinciden.',
			});
			return false;
		}

		await handleOnSubmitRegistration(e);
		await handleOnSubmitPersonalInfo(e);

		router.push('/facturas');
	}

	function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === 'Enter') {
			handleOnSubmit(e as any);
		}
	}

	return (
		<form className="flex flex-col justify-center gap-3">
			<div className="mb-2">
				<h2 className="text-2xl font-semibold text-center">Crea una cuenta</h2>
				<p className="mx-auto text-sm text-center text-muted-foreground">Ingresa tus datos para crear una cuenta</p>
			</div>
			{/* <input
				className="bg-gray-50 md:w-full border  border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
				value={form.name}
				onChange={handleChange}
				type="text"
				placeholder="Nombre completo"
				required
				name="name"
			/> */}
			<Input id="name" ref={(el) => (formRef.current.name = el)} placeholder="Nombre completo" type="text" onKeyDown={handleKeyDown} required />
			{/* <input
				value={form.id}
				onChange={handleChange}
				type="text"
				className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
				placeholder="Número de documento"
				required
				name="id"
			/> */}
			<Input id="id" ref={(el) => (formRef.current.id = el)} placeholder="Número de documento" type="text" onKeyDown={handleKeyDown} required />
			{/* <input
				value={form.cellphone}
				onChange={handleChange}
				type="tel"
				className="bg-gray-50  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full md:w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
				placeholder="Número de celular"
				required
				name="cellphone"
			/> */}
			<Input id="cellphone" ref={(el) => (formRef.current.cellphone = el)} placeholder="Número de documento" type="tel" onKeyDown={handleKeyDown} required />
			{/* <input
				className="bg-gray-50 md:w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
				value={form.email}
				onChange={handleChange}
				type="email"
				placeholder="Correo Electrónico"
				required
				name="email"
			/> */}
			<Input id="email" ref={(el) => (formRef.current.email = el)} placeholder="Correo Electrónico" type="email" onKeyDown={handleKeyDown} required />
			<div className="flex w-full gap-2">
				{/* <input
					value={form.password}
					onChange={handleChange}
					type="password"
					className="bg-gray-50 mr-1 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full md:w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
					placeholder="Contraseña"
					required
					name="password"
				/> */}
				<Input id="password" ref={(el) => (formRef.current.password = el)} placeholder="•••••••••" type="password" onKeyDown={handleKeyDown} required />
				{/* <input
					value={form.confirmPassword}
					onChange={handleChange}
					type="password"
					className="bg-gray-50 ml-1 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-full md:w-1/2 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
					placeholder="Repetir contraseña"
					required
					name="confirmPassword"
				/> */}
				<Input id="confirmPassword" ref={(el) => (formRef.current.confirmPassword = el)} placeholder="•••••••••" type="password" onKeyDown={handleKeyDown} required />
			</div>

			<Button onClick={handleOnSubmit}>Continuar</Button>
			<div className="flex flex-col items-center mt-2">
				<p className="mx-auto text-sm text-center text-muted-foreground">Dando click en continuar aceptas nuestros</p>
				<Link className="mx-auto text-sm font-bold border-b-2 border-black" href="#">
					Términos & condiciones
				</Link>
			</div>
		</form>
	);
}
