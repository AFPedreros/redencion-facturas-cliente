'use client';
// Importa el hook useEffect de React para revisar el usuario cuando carga el componente por primera vez
import { useEffect } from 'react';
// Importa el componente Login desde el directorio ../components
import SignUp from '../../components/SignUp';
// Importa el hook useRouter de Next.js
import { useRouter, redirect } from 'next/navigation';
// Importa el hook personalizado useAuth
import { useAuth } from '../../context/AuthContext';
import { buttonVariants } from '@/components/ui/button';
import Link from 'next/link';
import { FilePlus, Gift, UserCheck } from 'lucide-react';

const routes = {
	receipts: '/facturas',
};

function page() {
	const { user } = useAuth();

	useEffect(() => {
		if (user) {
			redirect(routes.receipts);
		}
	}, [user]);

	return (
		<div className="container grid flex-col items-center justify-center w-screen h-screen lg:max-w-none lg:grid-cols-2 lg:px-0">
			<Link href="/" className={`${buttonVariants({ variant: 'ghost' })} absolute right-4 top-4 md:right-8 md:top-8`}>
				Inicia sesión
			</Link>
			<div className="flex flex-col items-center justify-center p-8 md:h-screen md:border-r md:border-black">
				<h1 className="mt-8 mb-8 text-3xl text-center md:mt-0 md:text-4xl">¡Redime tus facturas y participa en increíbles sorteos!</h1>
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
			<div className="mx-auto pb-6 md:pb-0 flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
				<SignUp />
			</div>
		</div>
	);
}

export default page;
