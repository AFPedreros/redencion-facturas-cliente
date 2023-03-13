'use client';
import { useRouter } from 'next/navigation';

export default function page() {
	const router = useRouter();

	return (
		<div className="pt-10 bg-white">
			<main className="flex flex-col h-screen p-4 mx-auto md:px-12 xl:px-24">
				<div className="px-6 pt-10 mb-6 text-left border-b-2 md:px-0 md:text-left border-slate-300">
					<div className="w-full mb-6 md:items-end md:flex md:justify-between">
						<h2 className="mb-2 text-2xl font-light mb:mb-0">Mi cuenta</h2>
						<button
							type="button"
							onClick={() => router.push('/facturas')}
							className="focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-12 py-2.5 dark:focus:ring-yellow-900"
						>
							Revisa tus facturas
						</button>
					</div>
				</div>
				<div className="pt-10 mb-6 text-center border-b-2 md:text-left border-slate-300">
					<div className="justify-between w-full text-left md:flex">
						<div className="w-full px-6 mb-6 md:px-0 md:w-2/5">
							<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Nombre completo</label>
							<input
								className="bg-gray-50 border w-full border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								// value={form2.name}
								// onChange={handleChange2}
								type="text"
								placeholder="Felipe Pedreros"
								required
								name="name"
								disabled={true}
							/>
						</div>
						<div className="w-full px-6 mb-6 md:px-0 md:w-2/5">
							<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Cédula</label>
							<input
								className="bg-gray-50 w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								// value={form2.name}
								// onChange={handleChange2}
								type="text"
								placeholder="1144074466"
								required
								name="id"
								disabled={true}
							/>
						</div>
					</div>
					<div className="justify-between w-full text-left md:flex">
						<div className="w-full px-6 mb-6 md:px-0 md:w-2/5">
							<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Celular</label>
							<input
								className="bg-gray-50 border w-full border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								// value={form2.name}
								// onChange={handleChange2}
								type="phone"
								placeholder="317 894 5388"
								required
								name="cel"
								disabled={true}
							/>
						</div>
						<div className="w-full px-6 mb-6 md:px-0 md:w-2/5">
							<label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Correo electrónico</label>
							<input
								className="bg-gray-50 w-full border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
								// value={form2.name}
								// onChange={handleChange2}
								type="email"
								placeholder="felipe.pedreros94@gmail.com"
								required
								name="emal"
								disabled={true}
							/>
						</div>
					</div>
					<button
						type="button"
						onClick={() => router.push('/facturas')}
						className="focus:outline-none mb-6 text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-12 py-2.5 dark:focus:ring-yellow-900"
					>
						Editar datos
					</button>
				</div>
			</main>
		</div>
	);
}
