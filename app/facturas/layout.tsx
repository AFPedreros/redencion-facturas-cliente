'use client';
import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';

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
	console.log('loading123');

	return (
		<div className="flex items-center justify-center h-screen bg-transparent">
			<Loader2 className="w-12 h-12 text-black animate-spin" />
		</div>
	);
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<main className="min-h-screen">
			<Suspense
				fallback={
					<div className="flex items-center justify-center h-screen bg-transparent">
						<Loader2 className="w-12 h-12 text-black animate-spin" />
					</div>
				}
			>
				{children}
			</Suspense>
			{/* <Loading /> */}
		</main>
	);
}
