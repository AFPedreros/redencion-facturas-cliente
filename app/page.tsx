'use client';
import Login from '../components/Login';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

function page() {
	const { user } = useAuth();
	const router = useRouter();

	if (user !== null) {
		router.push('/facturas');
	}

	return <Login />;
}

export default page;
