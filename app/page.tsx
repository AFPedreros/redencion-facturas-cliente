'use client';
import Login from '@/components/Login';
import { redirect } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { FilePlus, UserCheck, Gift } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import SignUp from '@/components/SignUp';

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
			<div className="flex flex-col items-center justify-center p-8 md:h-screen md:border-r md:border-black md:w-1/2">
				<h1 className="mb-12 text-4xl text-center">¡Redime tus facturas y participa en increíbles sorteos!</h1>
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
			<div className="flex items-center justify-center px-8 sm:px-0 md:w-1/2">
				<Tabs defaultValue="login" className="w-[400px]">
					<TabsContent value="login">
						<Login />
					</TabsContent>
					<TabsContent value="signup">
						<SignUp />
					</TabsContent>
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="login">Inicia sesión</TabsTrigger>
						<TabsTrigger value="signup">Registrate</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>
			{/* <Login /> */}
		</div>
	);
}

export default page;
