'use client';

// Importa el componente Login desde el directorio ../components
import Login from '../components/Login';
// Importa los hooks useAuth y useRouter de Next.js
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

// Define el objeto de rutas como una constante
const routes = {
	receipts: '/facturas',
};

function page() {
	// Usa el hook useAuth para obtener el objeto de usuario del contexto
	const { user } = useAuth();
	// Usa el hook useRouter para obtener acceso al router de Next.js
	const router = useRouter();

	// Redirige al usuario a la página de facturas si ya ha iniciado sesión
	if (user !== null) {
		router.push(routes.receipts);
	}

	return <Login />;
}

export default page;
