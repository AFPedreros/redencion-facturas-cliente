'use client';
import Login from '@/components/Login';
import { redirect } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Verified, FilePlus, UserCheck, Gift } from 'lucide-react';

const routes = {
	receipts: '/facturas',
};

function page() {
	const { user } = useAuth();

	if (user) {
		redirect(routes.receipts);
	}

	return (
		<div className="bg-white md:flex">
			<div className="flex flex-col items-center justify-center p-8 md:h-screen md:border-r md:border-black md:w-1/3">
				<h1 className="mb-12 text-4xl">¡Redime tus facturas y participa en increíbles sorteos!</h1>
				<div className="flex flex-col gap-4">
					<div className="flex items-center w-full">
						<div className="w-10 h-10 p-2 m-auto mr-2 rounded-full bg-primary">
							<UserCheck className="w-6 h-6 text-white" />
						</div>
						<p className="w-full">Registra tus datos personales</p>
					</div>
					<div className="flex items-center w-full">
						<div className="w-10 h-10 p-2 m-auto mr-2 rounded-full bg-primary">
							<FilePlus className="w-6 h-6 text-white" />
						</div>
						<p className="w-full">Agrega tus facturas y espera su aprobación</p>
					</div>
					<div className="flex items-center w-full">
						<div className="w-10 h-10 p-2 m-auto mr-2 rounded-full bg-primary">
							<Gift className="w-6 h-6 text-white" />
						</div>
						<p className="w-full">Obtén un código y participa en los sorteos</p>
					</div>
				</div>
			</div>
			<Login />
		</div>
	);
}

export default page;
