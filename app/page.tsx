'use client';
import Login from '@/components/Login';
import { redirect } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const routes = {
	receipts: '/facturas',
};

function page() {
	const { user } = useAuth();

	if (user) {
		redirect(routes.receipts);
	}

	return <Login />;
}

export default page;
