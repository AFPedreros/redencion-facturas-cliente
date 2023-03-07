'use client';
import SignUp from '../../components/SignUp';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

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
