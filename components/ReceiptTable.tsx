'use client';
import { disconnect } from 'process';
import { SetStateAction, useEffect, useState } from 'react';
type Props = { receipts: any };

export default function ReceiptTable({ receipts }: Props) {
	const [facturas, setFacturas] = useState<any>();

	//let facturas = null;
	const facArr: { id: any; fecha: any; estado: any; valor: any; url: any }[] = [];

	if (receipts) {
		receipts.forEach((doc: any) => {
			// console.log(doc.id, ' => ', doc.data());
			const factura = {
				id: doc.data().id,
				fecha: doc.data().fechaRegistro,
				estado: doc.data().estado,
				valor: doc.data().valorTotal,
				url: doc.data().url,
			};
			facArr.push(factura);
		});

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

	function shortenString(str) {
		const firstChars = str.substring(0, 6);
		const lastChars = str.substring(str.length - 4);
		return `${firstChars}...${lastChars}`;
	}

	return (
		<div className="relative overflow-x-auto shadow-md sm:rounded-lg">
			{receipts?.docs.length > 0 ? (
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
										<label className="text-white bg-blue-600 focus:ring-4 font-medium rounded-lg text-sm px-12 py-2.5">{fac.estado}</label>
										<a href={fac.url} className="ml-4 font-medium hover:underline">
											Ver factura
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
			) : (
				'¡Por favor ingresa tu primera factura!'
			)}
		</div>
	);
}
