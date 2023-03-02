'use client';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

export default function page() {
	const router = useRouter();

	return (
		<div className="pt-10 bg-white">
			<main className="flex flex-col h-screen p-4 mx-auto md:px-12 xl:px-24">
				<div className="pt-10 mb-6 text-center border-b-2 md:text-left border-slate-300">
					<h2 className="mb-6 text-2xl font-light">Facturas registradas</h2>
					<div className="w-full mb-6 md:items-end md:flex md:justify-between">
						<p className="mb-2 md:mb-0 text-[#707070] text-sm">Gestiona todas tus facturas aquí.</p>
						<button
							type="button"
							onClick={() => router.push('/facturas/registro')}
							className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-12 py-2.5 dark:focus:ring-yellow-900"
						>
							Agregar factura
						</button>
					</div>
				</div>
				<div className="w-full h-24 rounded-lg bg-slate-200">
					<div className="flex items-center justify-center w-20 h-full p-2 bg-yellow-400 rounded-l-lg">
						<ExclamationCircleIcon className="h-12 text-white" />
					</div>
				</div>
			</main>
		</div>
	);
}
