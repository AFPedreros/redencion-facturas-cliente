'use client';
// Importa el hook useEffect de React para revisar el usuario cuando carga el componente por primera vez
import { useEffect } from 'react';
// Importa el componente Login desde el directorio ../components
import SignUp from '../../components/SignUp';
// Importa el hook useRouter de Next.js
import { useRouter } from 'next/navigation';
// Importa el hook personalizado useAuth
import { useAuth } from '../../context/AuthContext';

function page() {
	const { user } = useAuth();
	const router = useRouter();

	useEffect(() => {
		if (user !== null) {
			router.push('/facturas');
		}
	}, []);

	return <SignUp />;
}

export default page;
