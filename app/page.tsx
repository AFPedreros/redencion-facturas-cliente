'use client';
import Login from '@/components/Login';
import { redirect } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { FilePlus, UserCheck, Gift, Receipt } from 'lucide-react';
import Link from 'next/link';

const routes = {
	receipts: '/facturas',
};

function page() {
	const { user } = useAuth();

	if (user) {
		redirect(routes.receipts);
	}

	return (
		<div className="bg-white container flex h-screen w-screen flex-col items-center justify-center">
			<Receipt className="mb-2 w-9 h-9 text-primary" />
			<div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
				<Login />
			</div>
			<p className="px-8 mt-4 text-center text-sm text-muted-foreground">
				<Link href="/registro" className="hover:text-brand underline underline-offset-4">
					¿No tienes una cuenta? Registrate
				</Link>
			</p>
		</div>
	);
}

export default page;
