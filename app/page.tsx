'use client';
import SignUp from '../components/SignUp';
import { useAuth } from '../context/AuthContext';

function page() {
	const { user } = useAuth();

	console.log(user);
	return <>{user ? 'Registrar' : <SignUp />}</>;
}

export default page;
