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

	const [value, loading, error] = useCollection(collection(db, 'users'), {
		snapshotListenOptions: { includeMetadataChanges: true },
	});

	const { toast } = useToast();

	const [receipts, setReceipts] = useState<any>();
	const [receiptsInfo, setReceiptsInfo] = useState<JSX.Element[]>();

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
	}, [value, receiptsInfo]);

	useEffect(() => {
		const receiptCards: JSX.Element[] = [];
		receipts?.forEach((doc: any) => {
			receiptCards.push(
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

		const sortedReceiptCards = sortByRegistrationDate(receiptCards);
		setReceiptsInfo(sortedReceiptCards);
	}, [receipts]);

	function sortByRegistrationDate(objects: any) {
		objects.sort(function (a: any, b: any) {
			// console.log(a.props.fecha);
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
				{!receipts ? (
					// <Loader2 className="w-12 h-12 text-black animate-spin" />
					<div className="min-h-min justify-center pb-6">
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
				) : receipts.docs.length > 0 ? (
					<div className="min-h-min justify-center pb-6">
						{/* <ReceiptTable receiptsData={receipts} /> */}
						<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{receiptsInfo}</div>
					</div>
				) : (
					<Link className={`md:w-fit ${buttonVariants({ variant: 'default' })}`} href="/facturas/registro">
						Registra tu primer factura
					</Link>
				)}
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
							<CardTitle className="text-sm font-medium">ID</CardTitle>
							<div className="flex gap-1">
								<Edit className="w-4 h-4 text-primary" />
								<AlertDialog>
									<AlertDialogTrigger className="text-sm font-medium text-destructive">
										<Trash2 className="w-4 h-4 text-destructive" />
									</AlertDialogTrigger>
									<AlertDialogContent className="bg-white">
										<AlertDialogHeader>
											<AlertDialogTitle>¿Estás seguro, completamente seguro?</AlertDialogTitle>
											<AlertDialogDescription>
												Esta acción no se puede deshacer. Eliminará permanentemente tu cuenta y eliminará tus datos de nuestros servidores.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Cancelar</AlertDialogCancel>
											<AlertDialogAction
												onClick={() => {
													console.log('hello');
												}}
												className={buttonVariants({ variant: 'destructive' })}
											>
												Continuar
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</div>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">$100.000</div>
							<div className="flex justify-between items-center mt-1">
								<p className="text-muted-foreground">Por revisión</p>
								<p className="text-xs text-muted-foreground">30/4/2023</p>
							</div>
							<AlertDialog>
								<AlertDialogTrigger className={`${buttonVariants({ variant: 'default' })} mt-2 w-full`}>Ver factura</AlertDialogTrigger>
								<AlertDialogContent className="bg-white w-full">
									<AlertDialogHeader>
										<AlertDialogTitle>0000</AlertDialogTitle>
									</AlertDialogHeader>
									<ScrollArea className="h-72 w-full rounded-md">
										<Image src="/ffc127d-sample_receipt.jpg" alt="Image" className="rounded-md object-cover" width={500} height={500} />
									</ScrollArea>
									<AlertDialogFooter>
										<AlertDialogCancel className={buttonVariants({ variant: 'destructive' })}>Cerrar</AlertDialogCancel>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
							<CardTitle className="text-sm font-medium">ID</CardTitle>
							<div className="flex gap-1">
								<Edit className="w-4 h-4 text-primary" />
								<AlertDialog>
									<AlertDialogTrigger className="text-sm font-medium text-destructive">
										<Trash2 className="w-4 h-4 text-destructive" />
									</AlertDialogTrigger>
									<AlertDialogContent className="bg-white">
										<AlertDialogHeader>
											<AlertDialogTitle>¿Estás seguro, completamente seguro?</AlertDialogTitle>
											<AlertDialogDescription>
												Esta acción no se puede deshacer. Eliminará permanentemente tu cuenta y eliminará tus datos de nuestros servidores.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Cancelar</AlertDialogCancel>
											<AlertDialogAction
												onClick={() => {
													console.log('hello');
												}}
												className={buttonVariants({ variant: 'destructive' })}
											>
												Continuar
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</div>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">$100.000</div>
							<div className="flex justify-between items-center mt-1">
								<p className="text-destructive">Rechazada</p>
								<p className="text-xs text-muted-foreground">30/4/2023</p>
							</div>
							<AlertDialog>
								<AlertDialogTrigger className={`${buttonVariants({ variant: 'default' })} mt-2 w-full`}>Ver factura</AlertDialogTrigger>
								<AlertDialogContent className="bg-white w-full">
									<AlertDialogHeader>
										<AlertDialogTitle>0000</AlertDialogTitle>
									</AlertDialogHeader>
									<ScrollArea className="h-72 w-full rounded-md">
										<Image src="/ffc127d-sample_receipt.jpg" alt="Image" className="rounded-md object-cover" width={500} height={500} />
									</ScrollArea>
									<AlertDialogFooter>
										<AlertDialogCancel className={buttonVariants({ variant: 'destructive' })}>Cerrar</AlertDialogCancel>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</CardContent>
					</Card>
					<Card>
						<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
							<CardTitle className="text-sm font-medium">ID</CardTitle>
							<div className="flex gap-1">
								<Edit className="w-4 h-4 text-primary" />
								<AlertDialog>
									<AlertDialogTrigger className="text-sm font-medium text-destructive">
										<Trash2 className="w-4 h-4 text-destructive" />
									</AlertDialogTrigger>
									<AlertDialogContent className="bg-white">
										<AlertDialogHeader>
											<AlertDialogTitle>¿Estás seguro, completamente seguro?</AlertDialogTitle>
											<AlertDialogDescription>
												Esta acción no se puede deshacer. Eliminará permanentemente tu cuenta y eliminará tus datos de nuestros servidores.
											</AlertDialogDescription>
										</AlertDialogHeader>
										<AlertDialogFooter>
											<AlertDialogCancel>Cancelar</AlertDialogCancel>
											<AlertDialogAction
												onClick={() => {
													console.log('hello');
												}}
												className={buttonVariants({ variant: 'destructive' })}
											>
												Continuar
											</AlertDialogAction>
										</AlertDialogFooter>
									</AlertDialogContent>
								</AlertDialog>
							</div>
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">$100.000</div>
							<div className="flex justify-between items-center mt-1">
								<p className="text-primary">Aprovada</p>
								<p className="text-xs text-muted-foreground">30/4/2023</p>
							</div>
							<AlertDialog>
								<AlertDialogTrigger className={`${buttonVariants({ variant: 'default' })} mt-2 w-full`}>Ver factura</AlertDialogTrigger>
								<AlertDialogContent className="bg-white w-full">
									<AlertDialogHeader>
										<AlertDialogTitle>0000</AlertDialogTitle>
									</AlertDialogHeader>
									<ScrollArea className="h-72 w-full rounded-md">
										<Image src="/ffc127d-sample_receipt.jpg" alt="Image" className="rounded-md object-cover" width={500} height={500} />
									</ScrollArea>
									<AlertDialogFooter>
										<AlertDialogCancel className={buttonVariants({ variant: 'destructive' })}>Cerrar</AlertDialogCancel>
									</AlertDialogFooter>
								</AlertDialogContent>
							</AlertDialog>
						</CardContent>
					</Card>
				</div>
			</main>
		</div>
	);
}
