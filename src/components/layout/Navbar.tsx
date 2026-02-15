'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

const Navbar = () => {
	const [isScrolled, setIsScrolled] = useState(false);
	const [isLoggedIn] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 50);
		};
		window.addEventListener('scroll', handleScroll);
		return () => window.removeEventListener('scroll', handleScroll);
	}, []);

	const navItems = [
		{ name: 'Home', href: '/' },
		{ name: 'Watchlist', href: '/watchlist' },
		{ name: 'Filmes', href: '/filmes' },
		{ name: 'Séries', href: '/series' },
		{ name: 'Categorias', href: '/categorias' },
	];

	return (
		<motion.nav
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			className={cn(
				'fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 md:px-12 py-5 flex items-center justify-between',
				isScrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/5' : 'bg-transparent'
			)}
		>
			<div className="z-10">
				<Link href="/" className="text-2xl font-black text-primary tracking-tighter italic lg:text-3xl">
					STAR<span className="text-white">FLIX</span>
				</Link>
			</div>

			<div className="absolute left-1/2 -translate-x-1/2 hidden lg:flex items-center bg-white/5 backdrop-blur-2xl rounded-full p-1 border border-white/10 shadow-2xl">
				<div className="flex items-center">
					{navItems.map((item) => (
						<Link
							key={item.name}
							href={item.href}
							className={cn(
								'px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-widest transition-all duration-500',
								item.name === 'Home'
									? 'bg-primary text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]'
									: 'text-white/40 hover:text-white hover:bg-white/5'
							)}
						>
							{item.name}
						</Link>
					))}
				</div>
			</div>

			<div className="flex items-center gap-6 z-10">
				<button className="text-white/70 hover:text-white transition-colors">
					<Search size={18} strokeWidth={2.5} />
				</button>
				
				{isLoggedIn ? (
					<div className="flex items-center gap-3 cursor-pointer hover:bg-white/10 px-1 py-1 pr-4 rounded-full transition-all border border-white/5 group">
						<div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-accent flex items-center justify-center text-[10px] font-black shadow-lg group-hover:scale-105 transition-transform text-white">
							JS
						</div>
						<span className="text-xs font-bold tracking-tight text-white/90">John Silver</span>
					</div>
				) : (
					<button className="bg-primary hover:bg-primary-hover text-white px-7 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20">
						Login
					</button>
				)}
			</div>
		</motion.nav>
	);
};

export default Navbar;
