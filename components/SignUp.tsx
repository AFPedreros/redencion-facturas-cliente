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
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';

export default function SignUp() {
	const { signup } = useAuth();
	const router = useRouter();

	const { toast } = useToast();

	// Estado inicial del formulario para agregar los datos personales
	const formRef = useRef<any>({
		name: '',
		lastName: '',
		typeId: null,
		id: '',
		confirmId: '',
		cellphone: '',
		email: '',
		password: '',
		confirmPassword: '',
	});

	const [selectedId, setSelectedId] = useState<string>('');

	function handleSelectChange() {
		const value = formRef.current.typeId.textContent;
		setSelectedId(() => value);
	}

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
		const lastName = formRef.current.lastName.value;
		const id = formRef.current.id.value;
		const tel = formRef.current.cellphone.value;
		const email = formRef.current.email.value;

		try {
			await setDoc(doc(db, 'users', email), {
				nombre: name,
				apellido: lastName,
				tipoIdentificacion: selectedId,
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
		const lastName = formRef.current.lastName.value;
		const id = formRef.current.id.value;
		const confirmId = formRef.current.confirmId.value;
		const tel = formRef.current.cellphone.value;
		const email = formRef.current.email.value;
		const password = formRef.current.password.value;
		const confirmPassword = formRef.current.confirmPassword.value;

		if (!name || !lastName) {
			toast({
				variant: 'destructive',
				description: 'Por favor ingresa tu nombre completo.',
			});
			return false;
		} else if (!id || !confirmId) {
			toast({
				variant: 'destructive',
				description: 'Por favor ingresa tu número de identidad.',
			});
			return false;
		} else if (!selectedId) {
			toast({
				variant: 'destructive',
				description: 'Por favor elige un tipo de documento.',
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
		} else if (id !== confirmId) {
			toast({
				variant: 'destructive',
				description: 'Los números de cédula no coinciden.',
			});
			return false;
		}

		await handleOnSubmitPersonalInfo(e);
		await handleOnSubmitRegistration(e);
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
			<div className="flex w-full">
				<Input className="mr-1" id="name" ref={(el) => (formRef.current.name = el)} placeholder="Nombre" type="text" onKeyDown={handleKeyDown} required />
				<Input className="ml-1" id="lastName" ref={(el) => (formRef.current.lastName = el)} placeholder="Apellido" type="text" onKeyDown={handleKeyDown} required />
			</div>
			<Select onValueChange={handleSelectChange}>
				<SelectTrigger>
					<SelectValue id="typeId" ref={(el) => (formRef.current.typeId = el)} placeholder="Tipo de documento" />
				</SelectTrigger>
				<SelectContent>
					<SelectGroup>
						<SelectItem value="C.C.">C.C.</SelectItem>
					</SelectGroup>
				</SelectContent>
			</Select>
			<div className="flex w-full">
				<Input className="mr-1" id="id" ref={(el) => (formRef.current.id = el)} placeholder="Documento" type="text" onKeyDown={handleKeyDown} required />
				<Input className="ml-1" id="confirmId" ref={(el) => (formRef.current.confirmId = el)} placeholder="Confirmar documento" type="text" onKeyDown={handleKeyDown} required />
			</div>
			<Input id="cellphone" ref={(el) => (formRef.current.cellphone = el)} placeholder="Número de celular" type="tel" onKeyDown={handleKeyDown} required />
			<Input id="email" ref={(el) => (formRef.current.email = el)} placeholder="Correo electrónico" type="email" onKeyDown={handleKeyDown} required />
			<div className="flex w-full">
				<Input className="mr-1" id="password" ref={(el) => (formRef.current.password = el)} placeholder="•••••••••" type="password" onKeyDown={handleKeyDown} required />
				<Input className="ml-1" id="confirmPassword" ref={(el) => (formRef.current.confirmPassword = el)} placeholder="•••••••••" type="password" onKeyDown={handleKeyDown} required />
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
