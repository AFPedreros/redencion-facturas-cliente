'use client';
import '../styles/globals.css';
import SignUp from '../components/SignUp';

import { AuthContextProvider } from '../context/AuthContext';
import Login from '../components/Login';

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html>
			<head />

			<body className="bg-white">
				<AuthContextProvider>
					{/* {children} */}

					<SignUp />
				</AuthContextProvider>
			</body>
		</html>
	);
}
