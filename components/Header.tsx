'use client';
// Importa el hook useRouter de Next.js
import { useRouter } from 'next/navigation';
// Importa el hook personalizado useAuth
import { useAuth } from '../context/AuthContext';

export default function Header() {
	// Usa el hook useAuth para obtener el usuario y la función logout
	const { user, logout } = useAuth();
	// Usa el hook useRouter para obtener acceso al router de Next.js
	const router = useRouter();

	// Función para cerrar sesión y redirigir al usuario a la página de inicio.
	async function handleClickOut() {
		router.push('/');
		try {
			await logout();
		} catch (err) {
			console.log(err);
		}
	}

	// Función para redirigir al usuario a la página de perfil.
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
