'use client';
// Importa el componente Login desde el directorio ../components
import Login from '../components/Login';
// Importa el hook useRouter de Next.js
import { useRouter, redirect } from 'next/navigation';
// Importa el hook personalizado useAuth
import { useAuth } from '../context/AuthContext';

// Define el objeto de rutas como una constante
const routes = {
	receipts: '/facturas',
};

function page() {
	// Usa el hook useAuth para obtener el objeto de usuario
	const { user } = useAuth();
	// Usa el hook useRouter para obtener acceso al router de Next.js
	const router = useRouter();

	// Redirige al usuario a la página de facturas si ya ha iniciado sesión
	if (user) {
		redirect(routes.receipts);
	}

	return <Login />;
}

export default page;
