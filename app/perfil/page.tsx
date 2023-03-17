'use client';
import { useRouter } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';

export default function page() {
	const [userData, setUserData] = useState<any>();

	const router = useRouter();
	const { user } = useAuth();
	const docRef = doc(db, 'users', user.email);

	useEffect(() => {
		const fetchData = async () => {
			const docSnap = await getDoc(docRef);
			setUserData(docSnap?.data());
		};

		try {
			fetchData();
		} catch (err) {
			console.log(err);
		}
	}, []);

	async function handleClick() {
		console.log('Próximamente');
	}

	return (
		<div className="pt-10 bg-white">
			<main className="flex flex-col h-screen p-4 mx-auto md:px-12 xl:px-24">
				<div className="px-6 pt-10 mb-6 text-left border-b-2 md:px-0 md:text-left border-slate-300">
					<div className="w-full mb-6 md:items-end md:flex md:justify-between">
						<h2 className="mb-2 text-2xl font-light mb:mb-0">Mi cuenta</h2>
						<button
							type="button"
							onClick={() => router.push('/facturas')}
							className="focus:outline-none text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-600 font-medium rounded-lg text-sm px-12 py-2.5"
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
								placeholder={userData?.nombre}
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
								placeholder={userData?.cedula}
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
								placeholder={userData?.celular}
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
								placeholder={user.email}
								required
								name="email"
								disabled={true}
							/>
						</div>
					</div>
					<button
						type="button"
						onClick={handleClick}
						className="focus:outline-none mb-6 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-700 font-medium rounded-lg text-sm px-12 py-2.5"
					>
						Editar datos
					</button>
				</div>
			</main>
		</div>
	);
}
