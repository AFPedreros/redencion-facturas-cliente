'use client';
import Link from 'next/link';
import ReceiptTable from '../../components/ReceiptTable';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { redirect } from 'next/navigation';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { buttonVariants } from '@/components/ui/button';
import Notifications from '@/components/NotificationsCard';
import { useCollection } from 'react-firebase-hooks/firestore';
import { Loader2 } from 'lucide-react';

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

	const [receipts, setReceipts] = useState<any>();

	useEffect(() => {
		const fetchData = async () => {
			const querySnapshot = await getDocs(collection(db, 'users', user?.email, 'facturas'));
			setReceipts(querySnapshot);
		};

		try {
			fetchData();
		} catch (err) {
			console.log(err);
		}
	}, [value]);

	console.log(receipts);

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
				{!receipts ? (
					<Loader2 className="w-12 h-12 text-black animate-spin" />
				) : receipts.docs.length < 0 ? (
					<div className="min-h-min">
						<ReceiptTable receiptsData={receipts} />
					</div>
				) : (
					<Link className={`md:w-fit ${buttonVariants({ variant: 'default' })}`} href="/facturas/registro">
						Registra tu primer factura
					</Link>
				)}
			</main>
		</div>
	);
}
