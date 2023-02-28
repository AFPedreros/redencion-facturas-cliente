'use client';
import '../styles/globals.css';
import { AuthContextProvider } from '../context/AuthContext';
import Header from '../components/Header';

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html>
			<head />

			<body className="relative bg-white">
				<AuthContextProvider>
					<Header />
					{children}

					{/* <SignUp /> */}
				</AuthContextProvider>
			</body>
		</html>
	);
}
