'use client';
import './globals.css';
import { AuthContextProvider } from '../context/AuthContext';
import Header from '../components/Header';
import { Toaster } from '@/components/ui/toaster';
import { Suspense } from 'react';

import { Loader2 } from 'lucide-react';

import { usePathname, useSearchParams } from 'next/navigation';

import { useEffect, useState } from 'react';

function Loading() {
	// 	const router = useRouter();
	// 	const [loading, setLoading] = useState(false);

	// 	useEffect(() => {
	// 		const handleStart = (url: string) => url !== router.asPath && setLoading(true);
	// 		const handleComplete = (url: string) => url === router.asPath && setLoading(false);

	// 		router.events.on('routeChangeStart', handleStart);
	// 		router.events.on('routeChangeComplete', handleComplete);
	// 		router.events.on('routeChangeError', handleComplete);

	// 		return () => {
	// 			router.events.off('routeChangeStart', handleStart);
	// 			router.events.off('routeChangeComplete', handleComplete);
	// 			router.events.off('routeChangeError', handleComplete);
	// 		};
	// 	}, [router]);

	// const pathname = usePathname();
	// useEffect(() => {
	// 	const url = pathname;
	// 	console.log(url);
	// }, [pathname]);

	return (
		<div className="flex items-center justify-center h-screen bg-transparent">
			<Loader2 className="w-12 h-12 text-primary animate-spin" />
		</div>
	);
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html>
			<head />

			<body className="relative bg-white">
				<Suspense
					fallback={
						<div className="flex items-center justify-center h-screen bg-transparent">
							<Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
						</div>
					}
				>
					<AuthContextProvider>
						<Header />
						{children}
					</AuthContextProvider>
				</Suspense>
				<Loading />
				<Toaster />
			</body>
		</html>
	);
}
