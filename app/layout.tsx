import Login from '../components/Login';

export default function RootLayout({ children }: { children: React.ReactNode }) {
	return (
		<html>
			<head />
			<body className="">
				{/* {children} */}
				<Login />
			</body>
		</html>
	);
}
