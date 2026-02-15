'use client';

import React, { useState, useEffect } from 'react';
import JumpLoader from '@/components/ui/JumpLoader';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 2000);
		return () => clearTimeout(timer);
	}, []);

	return (
		<>
			{isLoading && <JumpLoader />}
			<div className={isLoading ? 'opacity-0' : 'opacity-100 transition-opacity duration-1000'}>
				{children}
			</div>
		</>
	);
}
