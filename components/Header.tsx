'use client';
// Importa el hook useRouter de Next.js
import { useRouter } from 'next/navigation';
// Importa el hook personalizado useAuth
import { useAuth } from '../context/AuthContext';
import UserNav from './UserNav';
import { Receipt } from 'lucide-react';

export default function Header() {
	// Usa el hook useAuth para obtener el usuario y la función logout
	const { user } = useAuth();
	// Usa el hook useRouter para obtener acceso al router de Next.js
	const router = useRouter();

	return (
		<>
			{user ? (
				<div className="absolute left-0 right-0 flex items-center justify-between w-full gap-4 px-6 py-4 border-b border-black h-fit md:px-12">
					<div className="flex items-center justify-center">
						<Receipt className="mr-2 w-9 h-9 text-primary" />
						<h1 className="text-2xl">Redeen</h1>
					</div>
					<UserNav email={user.email} />
				</div>
			) : (
				<div></div>
			)}
		</>
	);
}
