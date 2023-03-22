'use client';
import SignUp from '../../components/SignUp';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

function page() {
	const { user } = useAuth();
	const router = useRouter();

	if (user === null) {
		router.push('/');
	}

	return <SignUp />;
}

export default page;
