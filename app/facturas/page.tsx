'use client';
import Link from 'next/link';
import ReceiptTable from '../../components/ReceiptTable';
import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { redirect } from 'next/navigation';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { buttonVariants, Button } from '@/components/ui/button';
import Notifications from '@/components/NotificationsCard';
import { useCollection } from 'react-firebase-hooks/firestore';
import ReceiptCard from '@/components/ReceiptCard';
import { useToast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

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
import Image from 'next/image';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Trash2, Edit } from 'lucide-react';
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const routes = {
	receipts: '/',
};

export default function page() {
	const { user } = useAuth();

	if (!user) {
		redirect(routes.receipts);
	}

	const [value, loading, error] = useCollection(collection(db, 'users', user?.email, 'facturas'), {
		snapshotListenOptions: { includeMetadataChanges: true },
	});

	const { toast } = useToast();

	const [receiptsInfo, setReceiptsInfo] = useState<JSX.Element[]>();

	useEffect(() => {
		const fetchData = async () => {
			// Fetch the receipts from the Firestore
			const querySnapshot = await getDocs(collection(db, 'users', user?.email, 'facturas'));
			// Create an array of receipt cards from the fetched receipts
			const receiptCards = querySnapshot.docs.map((doc) => {
				return (
					<ReceiptCard
						key={doc.data().id}
						id={doc.data().id}
						fecha={doc.data().fechaRegistro}
						estado={doc.data().estado}
						valor={doc.data().valorTotal}
						url={doc.data().url}
						user={user}
						handleDelete={handleDelete}
					/>
				);
			});
			// Sort the receipt cards by registration date
			const sortedReceiptCards = sortByRegistrationDate(receiptCards);
			// Update the state to re-render the receipt cards
			setReceiptsInfo(sortedReceiptCards);
		};
		fetchData();
	}, [value]);

	function sortByRegistrationDate(objects: JSX.Element[]) {
		objects.sort(function (a: any, b: any) {
			const aDate = a.props.fecha.split('T')[0];
			const bDate = b.props.fecha.split('T')[0];
			if (aDate < bDate) {
				return -1;
			} else if (aDate > bDate) {
				return 1;
			} else {
				const aTime = a.props.fecha.split('T')[1];
				const bTime = b.props.fecha.split('T')[1];
				if (aTime < bTime) {
					return -1;
				} else if (aTime > bTime) {
					return 1;
				} else {
					return 0;
				}
			}
		});
		return objects;
	}

	function handleDelete(id: string) {
		// delete the document from Firebase...
		const updatedReceipts = receiptsInfo?.filter((rec) => rec.props.id !== id);
		setReceiptsInfo(updatedReceipts);
		toast({
			variant: 'destructive',
			title: 'Factura eliminada',
			description: 'Su factura ha sido eliminada correctamente.',
		});
	}

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
				{!receiptsInfo ? (
					// <Loader2 className="w-12 h-12 text-black animate-spin" />
					<div className="justify-center pb-6 min-h-min">
						{/* <ReceiptTable receiptsData={receipts} /> */}
						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
							<Skeleton className="w-full h-44" />
							<Skeleton className="w-full h-44" />
							<Skeleton className="w-full h-44" />
							<Skeleton className="w-full h-44" />
							<Skeleton className="w-full h-44" />
							<Skeleton className="w-full h-44" />
							<Skeleton className="w-full h-44" />
							<Skeleton className="w-full h-44" />
						</div>
					</div>
				) : receiptsInfo.length > 0 ? (
					<div className="justify-center pb-6 min-h-min">
						{/* <ReceiptTable receiptsData={receipts} /> */}
						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{receiptsInfo}</div>
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