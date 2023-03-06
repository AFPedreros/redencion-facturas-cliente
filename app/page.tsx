'use client';
import Login from '../components/Login';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';

function page() {
	const { user } = useAuth();
	const router = useRouter();

	return !user ? <Login /> : router.push('/facturas');
}

export default page;
