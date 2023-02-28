'use client';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function Header() {
	const router = useRouter();
	const { user, logout } = useAuth();

	console.log(user);

	function handleClickLogin() {
		console.log('login');
	}

	async function handleClickOut() {
		try {
			await logout();
			router.push('/');
		} catch (err) {
			console.log(err);
		}
	}

	return (
		<div className="absolute gap-4 flex justify-end items-center left-0 right-0 w-full bg-slate-50 px-4 py-2.5">
			<p className="text-sm font-medium cursor-pointer" onClick={handleClickOut}>
				Cerrar Sesión
			</p>
			<button
				type="button"
				className="text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-5 py-2.5 focus:outline-none dark:focus:ring-yellow-900"
				onClick={handleClickLogin}
			>
				Inicia Sesión
			</button>
		</div>
	);
}
