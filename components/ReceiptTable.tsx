'use client';
import { disconnect } from 'process';
import { SetStateAction, useEffect, useState } from 'react';
type Props = { receipts: any };

export default function ReceiptTable({ receipts }: Props) {
	let facArr: { id: any; fecha: any; estado: any; valor: any; url: any }[] = [];

	if (receipts) {
		const arr: { id: any; fecha: any; estado: any; valor: any; url: any }[] = [];
		receipts.forEach((doc: any) => {
			// console.log(doc.id, ' => ', doc.data());
			const factura = {
				id: doc.data().id,
				fecha: doc.data().fechaRegistro,
				estado: doc.data().estado,
				valor: doc.data().valorTotal,
				url: doc.data().url,
			};
			arr.push(factura);
		});

		const sortedReceipts = sortByFechaRegistro(arr);
		facArr = sortedReceipts;

		// console.log(facArr);
		// facArr.map((fac) => console.log(`Esta es la id ${fac.id}`));
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

	function sortByFechaRegistro(objects: any) {
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

	return (
		<>
			{receipts?.docs.length > 0 ? (
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
							{facArr.map((fac) => {
								return (
									<tr key={fac.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
										<td className="px-6 py-4">{shortenString(fac.id)}</td>
										<td className="px-6 py-4">{getDateFromString(fac.fecha)}</td>
										<td className="px-6 py-4">{fac.valor}</td>
										<td className="px-6 py-4">
											<label className="text-sm font-bold">{fac.estado}</label>
											<a href={fac.url} className="ml-4 font-medium underline hover:underline">
												Ver
											</a>
										</td>
										<td className="flex items-center px-6 py-4 space-x-3">
											<a href="#" className="font-medium text-blue-600 dark:text-blue-500 hover:underline">
												Editar
											</a>
											<a href="#" className="font-medium text-red-600 dark:text-red-500 hover:underline">
												Borrar
											</a>
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
