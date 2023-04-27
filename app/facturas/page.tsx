'use client';
// Importa el hook useRouter y el componente Link de Next.js
import Link from 'next/link';
// Importa el componente ReceiptTable desde el directorio /components
import ReceiptTable from '../../components/ReceiptTable';
// Importa los íconos de ExclamationCircleIcon desde la biblioteca Heroicons
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
// Importa el hook useState y useEffect de React para usar el estado local y verificar siel usuario está logueado cuando se carga la página
import { useEffect, useState } from 'react';
// Importa las funciones collection y getDoc de Firebase Firestore
import { collection, getDocs } from 'firebase/firestore';
// Importa el hook useRouter de Next.js
import { useRouter } from 'next/navigation';
// Importa la instancia de la base de datos de Firebase
import { db } from '../../firebase';
// Importa el hook personalizado useAuth
import { useAuth } from '../../context/AuthContext';

import { buttonVariants } from '@/components/ui/button';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import Notifications from '@/components/NotificationsCard';

export default function page() {
	// Usa el hook useAuth para obtener el usuario
	const { user } = useAuth();
	// Usa el hook useRouter para obtener acceso al router de Next.js
	const router = useRouter();

	// Estado inicial de las facturas del usuario
	const [receipts, setReceipts] = useState<any>();

	// Este hook vuelve y renderiza la pantalla cada vez que cambia el valor de 'user' o 'router'.
	useEffect(() => {
		// Si 'user' es nulo, redirige al usuario a la página de inicio.
		// Si 'user' tiene un valor, obtiene los datos de las facturas en Firestore y los almacena en el estado local 'receipts'.
		if (user === null) {
			router.push('/');
		} else {
			const fetchData = async () => {
				const querySnapshot = await getDocs(collection(db, 'users', user?.email, 'facturas'));

				setReceipts(querySnapshot);
			};

			try {
				fetchData();
			} catch (err) {}
		}
	}, [user, router]);

	return (
		<div className="bg-white">
			<main className="flex flex-col h-screen px-4 pt-16 mx-auto md:px-12 xl:px-24">
				<div className="px-6 pt-10 mb-6 text-left border-b-2 md:px-0 md:text-left border-slate-300">
					<div className="w-full mb-4 text-center md:text-left md:items-end md:flex md:justify-between">
						<h2 className="mb-2 text-2xl font-light mb:mb-0">Facturas registradas</h2>
						<Link className={buttonVariants({ variant: 'outline' })} href="/facturas/registro">
							Registrar factura
						</Link>
					</div>
				</div>
				<Notifications
					className="mb-6"
					title="Recordatorio"
					text="Una vez registres tus facturas en la plataforma, estas entrarán en etapa de revisión, donde podrán ser aprobadas o rechazadas según los Criterios de aprobación de facturas de la actividad."
				/>
				{receipts?.empty ? (
					<Link className={`md:w-fit ${buttonVariants({ variant: 'default' })}`} href="/facturas/registro">
						Registra tu primer factura
					</Link>
				) : (
					<div className="min-h-min">
						<ReceiptTable receiptsData={receipts} />
					</div>
				)}
			</main>
		</div>
	);
}
