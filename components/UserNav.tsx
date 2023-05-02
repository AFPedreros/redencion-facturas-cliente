'use client';
import { FileText, LogOut, PlusCircle, User } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import Link from 'next/link';

// Importa las funciones doc, setDoc y getDoc de Firebase Firestore
import { doc, getDoc, collection } from 'firebase/firestore';
// Importa el hook useRouter de Next.js
import { useRouter } from 'next/navigation';
// Importa el hook personalizado useAuth
import { useAuth } from '../context/AuthContext';
// Importa la instancia de la base de datos de Firebase
import { db } from '@/firebase';
import { useState, useEffect } from 'react';

import { useCollection } from 'react-firebase-hooks/firestore';

interface UserNavProps {
	email?: string;
}

export default function UserNav({ email }: UserNavProps) {
	const { user, logout } = useAuth();
	// Usa el hook useRouter para obtener acceso al router de Next.js
	const router = useRouter();

	const [name, setName] = useState<string>('');

	const [value, loading, error] = useCollection(collection(db, 'users'), {
		snapshotListenOptions: { includeMetadataChanges: true },
	});

	useEffect(() => {
		const docRef = doc(db, 'users', user?.email);
		const fetchData = async () => {
			const docSnap = await getDoc(docRef);
			setName(docSnap?.data()?.nombre);
		};
		try {
			fetchData();
		} catch (err) {
			console.log(err);
		}
	}, [email, value]);

	function getInitials(name: string | undefined) {
		if (!name) {
			return '';
		}
		const words = name.split(' '); // split the name into an array of words
		let initials = ''; // initialize the variable to store the initials

		for (let i = 0; i < words.length && initials.length < 2; i++) {
			const word = words[i];
			if (word.length > 0) {
				initials += word[0].toUpperCase(); // add the first letter of the word to the initials string
			}
		}

		return initials;
	}

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="relative w-8 h-8 rounded-full">
					<Avatar className="w-10 h-10">
						<AvatarImage src="" alt="@shadcn" />
						<AvatarFallback>{getInitials(name)}</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-screen md:w-56" align="end" forceMount>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col justify-center h-12 space-y-1 md:h-8">
						<p className="text-sm font-medium leading-none">{name}</p>
						<p className="text-xs leading-none text-muted-foreground">{email}</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem asChild className="h-12 md:h-8">
						<Link href="/perfil" className="flex w-full h-full">
							<User className="w-4 h-4 mr-2" />
							<span>Mi cuenta</span>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild className="h-12 md:h-8">
						<Link href="/facturas" className="flex w-full h-full">
							<FileText className="w-4 h-4 mr-2" />
							<span>Mis facturas</span>
						</Link>
					</DropdownMenuItem>
					<DropdownMenuItem asChild className="h-12 md:h-8">
						<Link href="/facturas/registro" className="flex w-full h-full">
							<PlusCircle className="w-4 h-4 mr-2" />
							<span>Subir factura</span>
						</Link>
					</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={async () => {
						try {
							await logout();
							router.push('/');
						} catch (err) {
							console.log(err);
						}
					}}
					className="h-12 md:h-8"
				>
					<LogOut className="w-4 h-4 mr-2" />
					<span>Cerrar sesión</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
