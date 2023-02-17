import '../styles/globals.css';
import Login from '../components/Login';

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html>
			<head />
			<body className="bg-black">
				{/* {children} */}
				<Login />
			</body>
		</html>
	);
}
