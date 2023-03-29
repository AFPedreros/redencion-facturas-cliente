'use client';
import { getStorage, ref, deleteObject } from 'firebase/storage';
import { doc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
// Importa el hook personalizado useAuth
import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';

// Crea un tipo Receipt para los objetos de factura.
type Props = { receiptsData: any };

export default function ReceiptTable({ receiptsData }: Props) {
	// Array para almacenar las facturas que tenga el usuario
	const [receipts, setReceipts] = useState<any[]>([]);
	// Usa el hook useAuth para obtener el usuario
	const { user } = useAuth();

	const [showModal, setShowModal] = useState(false);
	const [modalReceiptId, setModalReceiptId] = useState(null);

	useEffect(() => {
		// Si hay facturas, crear un array de objetos factura a partir de los datos obtenidos de Firebase.
		if (receiptsData) {
			const receiptsArray: { id: any; fecha: any; estado: any; valor: any; url: any }[] = [];
			receiptsData.forEach((doc: any) => {
				const receipt = {
					id: doc.data().id,
					fecha: doc.data().fechaRegistro,
					estado: doc.data().estado,
					valor: doc.data().valorTotal,
					url: doc.data().url,
				};
				receiptsArray.push(receipt);
			});

			// Ordena el array de facturas por fecha de registro y asigna el array ordenado a la variable facturas.
			const sortedReceipt = sortByRegistrationDate(receiptsArray);
			setReceipts(sortedReceipt);
		}
	}, [receiptsData]);

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
		setShowModal(!showModal);
	};

	function hideModal() {
		setShowModal(false);
	}

	return (
		<>
			{!receiptsData?.empty ? (
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
							{receipts.map((rec) => {
								const bg = rec.estado === 'Rechazada' ? 'text-black' : rec.estado === 'Aprobada' ? 'text-blue-700' : 'text-gray-500';

								return (
									<tr key={rec.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
										<td className="px-6 py-4">{shortenString(rec.id)}</td>
										<td className="px-6 py-4">{getDateFromString(rec.fecha)}</td>
										<td className="px-6 py-4">{rec.valor}</td>
										<td className="px-6 py-4">
											<label className={`text-sm ${bg} font-bold`}>{rec.estado}</label>
											<a href={rec.url} className="ml-4 font-medium underline hover:underline">
												Ver
											</a>
										</td>
										<td className="flex items-center px-6 py-4 space-x-3">
											<button onClick={() => toggleModal(rec.id)} className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
												Editar
											</button>
											{showModal && modalReceiptId === rec.id && (
												<div
													data-modal-backdrop="static"
													tabIndex={-1}
													aria-hidden="true"
													className="fixed top-0 left-0 right-0 z-50 w-full p-4 overflow-x-hidden overflow-y-auto md:inset-0 h-[calc(100%-1rem)] md:h-full"
												>
													<div className="relative w-full h-full max-w-2xl md:h-auto">
														<div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
															<div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
																<h3 className="text-xl font-semibold text-gray-900 dark:text-white">{rec.id}</h3>
																<button
																	type="button"
																	className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
																	onClick={hideModal}
																>
																	<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
																		<path
																			fillRule="evenodd"
																			d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
																			clipRule="evenodd"
																		></path>
																	</svg>
																</button>
															</div>

															<div className="p-6 space-y-6">
																<p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
																	With less than a month to go before the European Union enacts new consumer privacy laws for its citizens, companies around the world
																	are updating their terms of service agreements to comply.
																</p>
																<p className="text-base leading-relaxed text-gray-500 dark:text-gray-400">
																	The European Union’s General Data Protection Regulation (G.D.P.R.) goes into effect on May 25 and is meant to ensure a common set of
																	data rights in the European Union. It requires organizations to notify users as soon as possible of high-risk data breaches that
																	could personally affect them.
																</p>
															</div>
															<div className="flex items-center p-6 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
																<button
																	onClick={toggleModal}
																	type="button"
																	className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
																>
																	I accept
																</button>
																<button
																	onClick={toggleModal}
																	type="button"
																	className="text-gray-500 bg-white hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg border border-gray-200 text-sm font-medium px-5 py-2.5 hover:text-gray-900 focus:z-10 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-500 dark:hover:text-white dark:hover:bg-gray-600 dark:focus:ring-gray-600"
																>
																	Decline
																</button>
															</div>
														</div>
													</div>
												</div>
											)}
											<button
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
												className="font-medium text-red-600 hover:underline"
											>
												Borrar
											</button>
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
								<td className="flex items-center px-6 py-4 space-x-3">
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
