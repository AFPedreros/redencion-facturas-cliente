'use client';
import './globals.css';
import { AuthContextProvider } from '../context/AuthContext';
import Header from '../components/Header';
import { Toaster } from '@/components/ui/toaster';

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html>
			<head />

			<body className="relative bg-white">
				<AuthContextProvider>
					<Header />
					{children}
				</AuthContextProvider>

				<Toaster />
			</body>
		</html>
	);
}
