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
									<tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
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
				<h2 className="mb-6 text-2xl font-light">¡Por favor ingresa tu primera factura!</h2>
			)}
		</>
	);
}
