import React from 'react';

export default function RaceiptTable() {
	return (
		<div className="relative overflow-x-auto shadow-md sm:rounded-lg">
			<table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
				<thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
					<tr>
						<th scope="col" className="px-6 py-3">
							Nº
						</th>
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
						<th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-wrap dark:text-white">
							01
						</th>
						<td className="px-6 py-4">ASC-20211502</td>
						<td className="px-6 py-4">04-02-2023</td>
						<td className="px-6 py-4">$101.120</td>
						<td className="px-6 py-4">
							<label className="text-white bg-yellow-400 focus:ring-4 font-medium rounded-lg text-sm px-12 py-2.5">Aprobado</label>
							<a href="#" className="ml-4 font-medium hover:underline">
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
					<tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
						<th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-wrap dark:text-white">
							02
						</th>
						<td className="px-6 py-4">ASC-20211502</td>
						<td className="px-6 py-4">04-02-2023</td>
						<td className="px-6 py-4">$58.740</td>
						<td className="px-6 py-4">
							<label className="bg-slate-300 text-black w-[2rem] focus:ring-4 font-medium rounded-lg text-sm px-12 py-2.5">Por revisión</label>
							<a href="#" className="ml-4 font-medium hover:underline">
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
					<tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
						<th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-wrap dark:text-white">
							03
						</th>
						<td className="px-6 py-4">ASC-20211502</td>
						<td className="px-6 py-4">04-02-2023</td>
						<td className="px-6 py-4">$251.059</td>
						<td className="px-6 py-4">
							<label className="text-white bg-black focus:ring-4 font-medium rounded-lg text-sm px-12 py-2.5">Rechazada</label>
							<a href="#" className="ml-4 font-medium hover:underline">
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
				</tbody>
			</table>
		</div>
	);
}
