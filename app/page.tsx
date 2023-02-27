'use client';
import Login from '../components/Login';
import { useAuth } from '../context/AuthContext';

function page() {
	const { user } = useAuth();

	return user ? <Login /> : 'ya iniciaste sesión';
}

export default page;
