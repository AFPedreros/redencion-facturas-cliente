'use client';
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
		<div className="pt-10 bg-white">
			<main className="flex flex-col h-screen p-4 mx-auto md:px-12 xl:px-24">
				<div className="pt-10 mb-6 text-center border-b-2 md:text-left border-slate-300">
					<h2 className="mb-6 text-2xl font-light">Facturas registradas</h2>
					<div className="w-full mb-6 md:items-end md:flex md:justify-between">
						<p className="mb-2 md:mb-0 text-[#707070] text-base">Gestiona todas tus facturas aquí.</p>
						<button
							type="button"
							onClick={() => router.push('/facturas/registro')}
							className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-600 font-medium rounded-lg text-sm px-12 py-2.5"
						>
							Agregar factura
						</button>
					</div>
				</div>
				<div className="flex w-full mb-6 rounded-lg md:h-24 bg-slate-200">
					<div className="flex items-center justify-center w-20 h-full p-2 bg-blue-700 rounded-l-lg">
						<ExclamationCircleIcon className="h-10 text-white" />
					</div>
					<div className="text-[#707070] p-6">
						Te recordamos que una vez registres tus facturas en la plataforma, estas entrarán en etapa de revisión, donde podrán ser aprobadas o rechazadas según los{' '}
						<span className="font-bold text-black ">Criterios de aprobación de facturas</span> de la actividad.
					</div>
				</div>
				<ReceiptTable receiptsData={receipts} />
			</main>
		</div>
	);
}
