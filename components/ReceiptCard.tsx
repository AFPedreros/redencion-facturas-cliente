'use client';
import { getStorage, ref, deleteObject } from 'firebase/storage';
import { doc, deleteDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { Trash2, Edit, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import Image from 'next/image';
import { useState } from 'react';

type Props = { id: any; fecha: any; estado: any; valor: any; url: any; user: any; handleDelete: (id: string) => void };

export default function ReceiptCard({ id, fecha, estado, valor, url, user, handleDelete }: Props) {
	const [loaded, setLoaded] = useState(false);

	function handleImageLoad() {
		console.log('loaded');
		setLoaded(true);
	}

	function getDateFromString(dateString: string) {
		const date = new Date(dateString);
		const year = date.getUTCFullYear();
		const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
		const day = date.getUTCDate().toString().padStart(2, '0');
		return `${day}-${month}-${year}`;
	}

	function shortenString(str: string) {
		const firstChars = str.substring(0, 6);
		const lastChars = str.substring(str.length - 4);
		return `${firstChars}...${lastChars}`;
	}

	function formatCurrency(amount: any) {
		const amountNumber = Number(amount.replace(/\./g, '').replace(/[^0-9.-]+/g, ''));
		const formatter = new Intl.NumberFormat('es-CO', {
			style: 'currency',
			currency: 'COP',
			minimumFractionDigits: 0,
		});
		return formatter.format(amountNumber);
	}

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
				<CardTitle className="text-sm font-medium">{shortenString(id)}</CardTitle>
				<div className="flex gap-1">
					<Edit className="w-4 h-4 text-primary" />
					<AlertDialog>
						<AlertDialogTrigger className="text-sm font-medium text-destructive">
							<Trash2 className="w-4 h-4 text-destructive" />
						</AlertDialogTrigger>
						<AlertDialogContent className="bg-white">
							<AlertDialogHeader>
								<AlertDialogTitle>¿Estás seguro, completamente seguro?</AlertDialogTitle>
								<AlertDialogDescription>Esta acción no se puede deshacer. Eliminará permanentemente tu cuenta y eliminará tus datos de nuestros servidores.</AlertDialogDescription>
							</AlertDialogHeader>
							<AlertDialogFooter>
								<AlertDialogCancel>Cancelar</AlertDialogCancel>
								<AlertDialogAction
									onClick={async () => {
										// Se accede al almacenamiento de Firebase y se establece la referencia donde se almacenará el archivo.
										const storage = getStorage();
										const storageRef = ref(storage, `facturas/${user.email}/${id}`);
										try {
											await deleteObject(storageRef);
											await deleteDoc(doc(db, 'users', user?.email, 'facturas', id));
											handleDelete(id);
										} catch (e) {
											console.log(e);
										}
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
				<div className="text-2xl font-bold">{formatCurrency(valor)}</div>
				<div className="flex items-center justify-between mt-1">
					<p className={`${estado === 'Rechazada' ? 'text-destructive' : estado === 'Aprobada' ? 'text-primary' : 'text-muted-foreground'}`}>{estado}</p>
					<p className="text-xs text-muted-foreground">{getDateFromString(fecha)}</p>
				</div>
				<AlertDialog>
					<AlertDialogTrigger className={`${buttonVariants({ variant: 'default' })} mt-2 w-full`}>Ver factura</AlertDialogTrigger>
					<AlertDialogContent className="bg-white">
						<AlertDialogHeader>
							<AlertDialogTitle>{shortenString(id)}</AlertDialogTitle>
						</AlertDialogHeader>
						<ScrollArea className="w-full rounded-md h-72">
							{!loaded && (
								<div className="flex items-center justify-center bg-transparent h-72">
									<Loader2 className="w-12 h-12 text-black animate-spin" />
								</div>
							)}
							<Image src={url} alt="Image" className={`object-cover rounded-md ${loaded ? '' : 'hidden'}`} width={500} height={500} onLoad={handleImageLoad} />
						</ScrollArea>
						<AlertDialogFooter>
							<AlertDialogCancel className={buttonVariants({ variant: 'destructive' })}>Cerrar</AlertDialogCancel>
						</AlertDialogFooter>
					</AlertDialogContent>
				</AlertDialog>
			</CardContent>
		</Card>
	);
}
