'use client';
// Importa las funciones doc, setDoc y getDoc de Firebase Firestore
import { doc, getDoc, setDoc } from 'firebase/firestore';
// Importa el hook useRouter de Next.js
import { useRouter } from 'next/navigation';
// Importa el hook personalizado useAuth
import { useAuth } from '../context/AuthContext';
// Importa la instancia de la base de datos de Firebase
import { db } from '@/firebase';
import { useState, useEffect } from 'react';
import UserNav from './UserNav';

export default function Header() {
	// Usa el hook useAuth para obtener el usuario y la función logout
	const { user, logout } = useAuth();
	// Usa el hook useRouter para obtener acceso al router de Next.js
	const router = useRouter();

	// Función para cerrar sesión y redirigir al usuario a la página de inicio.
	async function handleClickOut() {
		router.push('/');
		try {
			await logout();
		} catch (err) {
			console.log(err);
		}
	}

	// Función para redirigir al usuario a la página de perfil.
	function handleUserProfile() {
		router.push('/perfil');
	}

	return (
		<>
			{user ? (
				<div className="absolute left-0 right-0 flex items-center justify-end w-full gap-4 px-6 py-4 h-fit bg-border">
					{/* {' '}
					<p className="text-sm rounded-lg px-5 bg-white font-medium cursor-pointer py-2.5" onClick={handleUserProfile}>
						// {user.email}
						//{' '}
					</p>
					//{' '}
					<p className="text-sm font-medium cursor-pointer py-2.5" onClick={handleClickOut}>
						// Cerrar Sesión //{' '}
					</p> */}
					<UserNav email={user.email} />
				</div>
			) : (
				<div></div>
			)}
		</>
	);
}
