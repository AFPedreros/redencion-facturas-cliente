'use client';
import { doc, getDoc, setDoc, collection } from 'firebase/firestore';
import { useState, useEffect, useRef } from 'react';
// Importa el hook useRouter de Next.js
import { redirect } from 'next/navigation';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { Input } from '@/components/ui/input';
import { Button, buttonVariants } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import { useCollection } from 'react-firebase-hooks/firestore';

const routes = {
	receipts: '/',
};

export default function page() {
	const { user } = useAuth();

	if (!user) {
		redirect(routes.receipts);
	}

	const [value, loading, error] = useCollection(collection(db, 'users'), {
		snapshotListenOptions: { includeMetadataChanges: true },
	});

	const formRef = useRef<any>({ name: '', id: '', tel: '' });
	const [formChange, setFormChange] = useState<any>({ name: false, id: false, tel: false });
	const { toast } = useToast();

	const [userData, setUserData] = useState<any>();
	const [loadingNewData, setLoadingNewData] = useState(false);

	useEffect(() => {
		const docRef = doc(db, 'users', user?.email);
		const fetchData = async () => {
			const docSnap = await getDoc(docRef);
			setUserData(docSnap?.data());
		};
		try {
			fetchData();
		} catch (err) {
			console.log(err);
		}
	}, [value]);

	useEffect(() => {
		if (userData !== undefined) {
			formRef.current.name.value = userData?.nombre;
			formRef.current.id.value = userData?.cedula;
			formRef.current.tel.value = userData?.celular;
		}
	}, [userData]);

	function handleFormChange(name: string) {
		setFormChange((prevState: any) => {
			return {
				...prevState,
				[name]: !prevState[name],
			};
		});
	}

	async function animateTyping(inputField: any, value: string) {
		const chars = value.split('');

		for (let i = 0; i < chars.length; i++) {
			inputField.value = chars.slice(0, i + 1).join('');
			await new Promise((resolve) => setTimeout(resolve, 50));
		}
	}

	function findEnabledInputs(formRef: any) {
		const enabledInputs: any[] = [];

		if (!formRef.current) {
			return enabledInputs;
		}
		if (!formRef.current.name.disabled) {
			enabledInputs.push(formRef.current.name);
		}
		if (!formRef.current.id.disabled) {
			enabledInputs.push(formRef.current.id);
		}
		if (!formRef.current.tel.disabled) {
			enabledInputs.push(formRef.current.tel);
		}

		return enabledInputs;
	}

	async function handleClick() {
		setLoadingNewData(true);

		const name = formRef.current.name.value !== '' ? formRef.current.name.value : userData?.nombre;
		const id = formRef.current.id.value !== '' ? formRef.current.id.value : userData?.cedula;
		const tel = formRef.current.tel.value !== '' ? formRef.current.tel.value : userData?.celular;

		const changingFields = findEnabledInputs(formRef);

		for (const field of changingFields) {
			field.disabled = true;
			const valueField = field.id === 'name' ? name : field.id === 'id' ? id : tel;
			// await animateTyping(field, value);
			field.value = '';
			field.value = valueField;
		}
		try {
			await setDoc(doc(db, 'users', user?.email), {
				nombre: name,
				cedula: id,
				celular: tel,
			});
			toast({
				description: 'Tus datos se han actualizado correctamente.',
			});
		} catch (e) {
			console.log(e);
		}

		formRef.current.name.value = name;
		formRef.current.id.value = id;
		formRef.current.tel.value = tel;

		setFormChange({ name: false, id: false, tel: false });
		setLoadingNewData(false);
	}

	return (
		<div className="bg-white">
			<main className="flex flex-col h-screen px-4 pt-16 mx-auto md:px-12 xl:px-24">
				<div className="px-6 pt-10 mb-6 text-left border-b-2 md:px-0 md:text-left border-border">
					<div className="w-full mb-4 text-center md:text-left md:items-end md:flex md:justify-between">
						<h2 className="mb-2 text-2xl font-light mb:mb-0">Mi cuenta</h2>
						<Link className={buttonVariants({ variant: 'outline' })} href="/facturas">
							Revisa tus facturas
						</Link>
					</div>
				</div>
				{!userData ? (
					<div className="flex flex-col items-center mb-4">
						<div className="justify-between w-full max-w-6xl text-left md:flex">
							<div className="w-full px-6 mb-6 md:px-0 md:w-2/5">
								<Skeleton className="w-[100px] mb-2 mt-1 h-4 rounded-full" />
								<div className="flex w-full space-x-2">
									<Skeleton className="w-full h-10" />
								</div>
							</div>
							<div className="w-full px-6 mb-6 md:px-0 md:w-2/5">
								<Skeleton className="w-[100px] mb-2 mt-1 h-4 rounded-full" />
								<div className="flex w-full space-x-2">
									<Skeleton className="w-full h-10" />
									<Skeleton className="w-24 h-10" />
								</div>
							</div>
						</div>
						<div className="justify-between w-full max-w-6xl text-left md:flex">
							<div className="w-full px-6 mb-6 md:px-0 md:w-2/5">
								<Skeleton className="w-[100px] mb-2 mt-1 h-4 rounded-full" />
								<div className="flex w-full space-x-2">
									<Skeleton className="w-full h-10" />
									<Skeleton className="w-24 h-10" />
								</div>
							</div>
							<div className="w-full px-6 mb-6 md:px-0 md:w-2/5">
								<Skeleton className="w-[100px] mb-2 mt-1 h-4 rounded-full" />
								<div className="flex w-full space-x-2">
									<Skeleton className="w-full h-10" />
									<Skeleton className="w-24 h-10" />
								</div>
							</div>
						</div>
					</div>
				) : (
					<div className="flex flex-col items-center mb-4">
						<div className="justify-between w-full max-w-6xl text-left md:flex">
							<div className="flex justify-center w-full px-6 mb-6 md:block md:px-0 md:w-2/5">
								<div className="flex flex-col w-full max-w-md">
									<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Correo electrónico</label>
									<Input id="email" type="email" placeholder={user?.email} disabled />
								</div>
							</div>
							<div className="flex justify-center w-full px-6 mb-6 md:block md:px-0 md:w-2/5">
								<div className="flex flex-col w-full max-w-md">
									<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre completo</label>
									<div className="flex space-x-2">
										<Input id="name" ref={(el) => (formRef.current.name = el)} type="text" className="bg-transparent" disabled={!formChange.name} />
										{!formChange.name ? (
											<Button variant="default" onClick={() => handleFormChange('name')} disabled={loadingNewData}>
												Editar
											</Button>
										) : (
											<Button variant="default" onClick={handleClick} disabled={loadingNewData}>
												Guardar
											</Button>
										)}
									</div>
								</div>
							</div>
						</div>
						<div className="justify-between w-full max-w-6xl text-left md:flex">
							<div className="flex justify-center w-full px-6 mb-6 md:block md:px-0 md:w-2/5">
								<div className="flex flex-col w-full max-w-md">
									<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cédula</label>
									<div className="flex space-x-2">
										<Input id="id" ref={(el) => (formRef.current.id = el)} type="text" disabled={!formChange.id} />
										{!formChange.id ? (
											<Button variant="default" onClick={() => handleFormChange('id')} disabled={loading}>
												Editar
											</Button>
										) : (
											<Button variant="default" onClick={handleClick} disabled={loading}>
												Guardar
											</Button>
										)}
									</div>
								</div>
							</div>
							<div className="flex justify-center w-full px-6 mb-6 md:block md:px-0 md:w-2/5">
								<div className="flex flex-col w-full max-w-md">
									<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Celular</label>
									<div className="flex space-x-2">
										<Input id="tel" ref={(el) => (formRef.current.tel = el)} type="tel" disabled={!formChange.tel} />
										{!formChange.tel ? (
											<Button variant="default" onClick={() => handleFormChange('tel')} disabled={loading}>
												Editar
											</Button>
										) : (
											<Button variant="default" onClick={handleClick} disabled={loading}>
												Guardar
											</Button>
										)}
									</div>
								</div>
							</div>
						</div>
					</div>
				)}
			</main>
		</div>
	);
}