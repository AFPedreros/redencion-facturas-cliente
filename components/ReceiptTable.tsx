'use client';
import { getStorage, ref, deleteObject } from 'firebase/storage';
import { doc, deleteDoc, collection } from 'firebase/firestore';
import { db } from '../firebase';
// Importa el hook personalizado useAuth
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import AddReceipt from './AddReceipt';

import { useCollection } from 'react-firebase-hooks/firestore';

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

// Crea un tipo Receipt para los objetos de factura.
type Props = { receiptsData: any };

export default function ReceiptTable({ receiptsData }: Props) {
	// Array para almacenar las facturas que tenga el usuario
	const [receipts, setReceipts] = useState<any[]>([]);
	// Usa el hook useAuth para obtener el usuario
	const { user } = useAuth();

	const [modalReceiptId, setModalReceiptId] = useState(null);
	const [receiptsState, setReceiptsState] = useState<any[]>([]);

	const [value, loading, error] = useCollection(collection(db, 'users', user?.email, 'facturas'), {
		snapshotListenOptions: { includeMetadataChanges: true },
	});

	useEffect(() => {
		//Si hay facturas, crear un array de objetos factura a partir de los datos obtenidos de Firebase.
		if (receiptsData) {
			const receiptsArray: { id: any; fecha: any; estado: any; valor: any; url: any }[] = [];
			const receiptsStateArray: any[] = [];
			receiptsData.forEach((doc: any) => {
				const receipt = {
					id: doc.data().id,
					fecha: doc.data().fechaRegistro,
					estado: doc.data().estado,
					valor: doc.data().valorTotal,
					url: doc.data().url,
				};
				receiptsArray.push(receipt);
				receiptsStateArray.push(receipt.estado);
			});
			// Ordena el array de facturas por fecha de registro y asigna el array ordenado a la variable facturas.
			const sortedReceipt = sortByRegistrationDate(receiptsArray);
			setReceipts(sortedReceipt);
		}
	}, [receiptsData]);

	useEffect(() => {}, [receipts]);

	// Función para convertir una fecha en formato de cadena a una fecha con formato 'dd-mm-yyyy' y devolver la cadena resultante.
	function getDateFromString(dateString: string) {
		const date = new Date(dateString);
		const year = date.getUTCFullYear();
		const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
		const day = date.getUTCDate().toString().padStart(2, '0');
		return `${day}-${month}-${year}`;
	}

	// Función para acortar una cadena a los primeros 6 caracteres y los últimos 4 caracteres, y devolver la cadena resultante con "..." en el medio.
	function shortenString(str: string) {
		const firstChars = str.substring(0, 6);
		const lastChars = str.substring(str.length - 4);
		return `${firstChars}...${lastChars}`;
	}

	// Función para ordenar un array de objetos por fecha de registro.
	function sortByRegistrationDate(objects: any) {
		objects.sort(function (a: any, b: any) {
			const aDate = a.fecha.split('T')[0];
			const bDate = b.fecha.split('T')[0];
			if (aDate < bDate) {
				return -1;
			} else if (aDate > bDate) {
				return 1;
			} else {
				const aTime = a.fecha.split('T')[1];
				const bTime = b.fecha.split('T')[1];
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
		const updatedReceipts = receipts.filter((rec) => rec.id !== id);
		setReceipts(updatedReceipts);
	}

	const toggleModal = (receiptId: any) => {
		if (modalReceiptId === receiptId) {
			setModalReceiptId(null); // close the modal if it's already open for this receipt
		} else {
			setModalReceiptId(receiptId); // open the modal for the clicked receipt
		}
	};

	function formatCurrency(amount: any) {
		const amountNumber = Number(amount.replace(/\./g, '').replace(/[^0-9.-]+/g, ''));
		const formatter = new Intl.NumberFormat('es-CO', {
			style: 'currency',
			currency: 'COP',
			minimumFractionDigits: 0,
		});
		return formatter.format(amountNumber);
	}

	console.log(value?.docs);

	return (
		<>
			{!receiptsData?.empty ? (
				<div className="overflow-x-auto shadow-md sm:rounded-lg">
					<table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
						<thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
							<tr>
								<th scope="col" className="px-6 py-3">
									ID Factura
								</th>
								<th scope="col" className="px-6 py-3">
									Fecha de registro
								</th>
								<th scope="col" className="px-6 py-3">
									Valor factura
								</th>
								<th scope="col" className="px-6 py-3">
									Estado factura
								</th>
								<th scope="col" className="px-6 py-3">
									Acción
								</th>
							</tr>
						</thead>
						<tbody>
							{receipts.map((rec) => {
								const bg = rec.estado === 'Rechazada' ? 'text-black' : rec.estado === 'Aprobada' ? 'text-blue-700' : 'text-gray-500';
								// let bg = 'text-gray-500';
								// if (rec.estado === 'Rechazada') {
								// 	bg = 'text-black';
								// } else if (rec.estado === 'Aprobada') {
								// 	bg = 'text-blue-700';
								// }

								return (
									<tr key={rec.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
										<td className="px-6 py-4">{shortenString(rec.id)}</td>
										<td className="px-6 py-4">{getDateFromString(rec.fecha)}</td>
										<td className="px-6 py-4">{formatCurrency(rec.valor)}</td>
										<td className="px-6 py-4">
											<label className={`text-sm ${bg} font-bold`}>{rec.estado}</label>
											<a target="_blank" href={rec.url} className="ml-4 font-medium underline hover:underline">
												Ver
											</a>
										</td>
										<td className="px-6 py-4">
											<div className="flex">
												<button onClick={() => toggleModal(rec.id)} className="mr-2 font-medium text-blue-600 dark:text-blue-500 hover:underline">
													Editar
												</button>
												{modalReceiptId === rec.id && (
													<div
														data-modal-backdrop="static"
														tabIndex={-1}
														aria-hidden="true"
														className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center w-full h-full p-4 m-0 overflow-hidden"
													>
														<div className="w-full max-w-2xl bg-white rounded-lg shadow-md">
															<div className="flex items-start justify-between p-4 border-b">
																<h3 className="text-lg font-semibold text-gray-900">Agrega tu factura</h3>
																<button type="button" className="text-gray-500 hover:text-gray-700 focus:outline-none focus:text-gray-700" onClick={toggleModal}>
																	<span className="sr-only">Close</span>
																	<svg className="w-6 h-6 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
																		<path
																			fillRule="evenodd"
																			d="M4.293 4.293a1 1 0 011.414 0L12 10.586l6.293-6.293a1 1 0 111.414 1.414L13.414 12l6.293 6.293a1 1 0 01-1.414 1.414L12 13.414l-6.293 6.293a1 1 0 01-1.414-1.414L10.586 12 4.293 5.707a1 1 0 010-1.414z"
																			clipRule="evenodd"
																		/>
																	</svg>
																</button>
															</div>
															<div className="p-4">
																<AddReceipt id={rec.id} toggleModal={toggleModal} />
															</div>
														</div>
													</div>
												)}
												<AlertDialog>
													<AlertDialogTrigger className="text-sm font-medium text-destructive">Borrar</AlertDialogTrigger>
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
																onClick={async () => {
																	// Se accede al almacenamiento de Firebase y se establece la referencia donde se almacenará el archivo.
																	const storage = getStorage();
																	const storageRef = ref(storage, `facturas/${user.email}/${rec.id}`);
																	try {
																		await deleteObject(storageRef);
																		await deleteDoc(doc(db, 'users', user?.email, 'facturas', rec.id));
																		handleDelete(rec.id);
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
										</td>
									</tr>
								);
							})}
						</tbody>
					</table>
				</div>
			) : (
				<div className="relative overflow-x-auto shadow-md sm:rounded-lg">
					<table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
						<thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
							<tr>
								<th scope="col" className="px-6 py-3">
									ID Factura
								</th>
								<th scope="col" className="px-6 py-3">
									Fecha de registro
								</th>
								<th scope="col" className="px-6 py-3">
									Valor factura
								</th>
								<th scope="col" className="px-6 py-3">
									Estado factura
								</th>
								<th scope="col" className="px-6 py-3">
									Acción
								</th>
							</tr>
						</thead>
						<tbody>
							<tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
								<td className="px-6 py-4">
									<div>
										<svg
											aria-hidden="true"
											role="status"
											className="inline w-4 h-4 mr-3 text-gray-200 animate-spin dark:text-gray-600"
											viewBox="0 0 100 101"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
												fill="currentColor"
											/>
											<path
												d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
												fill="#1C64F2"
											/>
										</svg>
									</div>
								</td>
								<td className="px-6 py-4">
									<div>
										<svg
											aria-hidden="true"
											role="status"
											className="inline w-4 h-4 mr-3 text-gray-200 animate-spin dark:text-gray-600"
											viewBox="0 0 100 101"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
												fill="currentColor"
											/>
											<path
												d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
												fill="#1C64F2"
											/>
										</svg>
									</div>
								</td>
								<td className="px-6 py-4">
									<div>
										<svg
											aria-hidden="true"
											role="status"
											className="inline w-4 h-4 mr-3 text-gray-200 animate-spin dark:text-gray-600"
											viewBox="0 0 100 101"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
												fill="currentColor"
											/>
											<path
												d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
												fill="#1C64F2"
											/>
										</svg>
									</div>
								</td>
								<td className="px-6 py-4">
									<label className="text-sm font-bold">
										<svg
											aria-hidden="true"
											role="status"
											className="inline w-4 h-4 mr-3 text-gray-200 animate-spin dark:text-gray-600"
											viewBox="0 0 100 101"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
												fill="currentColor"
											/>
											<path
												d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
												fill="#1C64F2"
											/>
										</svg>
									</label>
								</td>
								<td className="flex items-center px-6 py-4">
									<div>
										<svg
											aria-hidden="true"
											role="status"
											className="inline w-4 h-4 mr-3 text-gray-200 animate-spin dark:text-gray-600"
											viewBox="0 0 100 101"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
												fill="currentColor"
											/>
											<path
												d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
												fill="#1C64F2"
											/>
										</svg>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			)}
		</>
	);
}
