'use client';
import { ReceiptPercentIcon } from '@heroicons/react/24/outline';
import { DocumentTextIcon } from '@heroicons/react/24/outline';
import { TicketIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';

export default function page() {
	const { user } = useAuth();
	const router = useRouter();

	if (user === null) {
		router.push('/');
	}

	return (
		<div className="bg-white md:flex">
			<div className="flex flex-col items-center justify-center h-screen p-8 md:border-r md:border-black md:w-1/3">
				<h1 className="mb-12 text-4xl">Agrega tus facturas</h1>
				<div className="flex flex-col gap-4">
					<div className="flex w-full gap-2 md:max-w-3xl">
						<div className="w-12 h-12 p-2 rounded bg-slate-200">
							<DocumentTextIcon className="text-white" />
						</div>
						<p className="w-4/5">Registra tus datos personales</p>
					</div>
					<div className="flex w-full gap-2 md:max-w-3xl">
						<div className="w-12 h-12 p-2 bg-yellow-400 rounded">
							<ReceiptPercentIcon className="text-white" />
						</div>
						<p className="w-4/5">Agrega tus facturas y espera su aprobación</p>
					</div>
					<div className="flex w-full gap-2 md:max-w-3xl">
						<div className="w-12 h-12 p-2 rounded bg-slate-200">
							<TicketIcon className="text-white" />
						</div>
						<p className="w-4/5">Obtén un código y participa en los sorteos</p>
					</div>
				</div>
			</div>
			<form className="flex flex-col justify-center h-screen p-8 mx-auto md:w-1/2 xl:w-1/3">
				<h2 className="mb-12 text-2xl font-light text-center">¡Tus facturas han sido registradas!</h2>
				<p className="mx-auto mb-12 text-[#707070] text-sm">Una vez sean aprobadas se te notificará el código de participación generado.</p>
				<button
					type="button"
					onClick={() => router.push('/facturas')}
					className="md:w-full focus:outline-none text-white bg-yellow-400 hover:bg-yellow-500 focus:ring-4 focus:ring-yellow-300 font-medium rounded-lg text-sm px-12 py-2.5 dark:focus:ring-yellow-900"
				>
					Finalizar
				</button>
			</form>
		</div>
	);
}
