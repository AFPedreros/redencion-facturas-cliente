'use client';
import { Loader2 } from 'lucide-react';

export default function loading() {
	return (
		<div className="flex items-center justify-center h-screen bg-transparent">
			<Loader2 className="w-12 h-12 text-black animate-spin" />
		</div>
	);
}
