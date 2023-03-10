'use client';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

export default function Header() {
	const router = useRouter();
	const { user, logout } = useAuth();

	console.log(user);

	async function handleClickOut() {
		try {
			await logout();
			router.push('/');
		} catch (err) {
			console.log(err);
		}
	}

	function handleUserProfile() {
		router.push('/perfil');
	}

	return (
		<>
			{' '}
			{user ? (
				<div className="flex justify-between w-full absolute gap-4 items-center left-0 right-0 bg-slate-200 md:px-10 px-4 py-2.5">
					<p className="text-sm rounded-lg px-5 bg-white font-medium cursor-pointer py-2.5" onClick={handleUserProfile}>
						{user.email}
					</p>
					<p className="text-sm font-medium cursor-pointer py-2.5" onClick={handleClickOut}>
						Cerrar Sesión
					</p>
				</div>
			) : (
				<div></div>
			)}
		</>
	);
}
