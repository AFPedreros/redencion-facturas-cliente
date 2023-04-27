'use client';
import { Loader2 } from 'lucide-react';
import React from 'react';

export default function loading() {
	console.log('carga facturas');
	return (
		<div className="flex items-center justify-center h-screen bg-transparent">
			<Loader2 className="w-12 h-12 text-emerald-500 animate-spin" />
		</div>
	);
}
