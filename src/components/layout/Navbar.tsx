/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, User, LogOut, Heart, UserCircle, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { api } from '@/services/api';

function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

const Navbar = () => {
	const [isScrolled, setIsScrolled] = useState(false);
	const [userData, setUserData] = useState<any>(null);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState('');
	const pathname = usePathname();
	const router = useRouter();

	useEffect(() => {
		if (isSearchOpen) {
			const input = document.getElementById('search-input');
			input?.focus();
		}
	}, [isSearchOpen]);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 50);
		};

		const checkAuth = () => {
			const cookies = document.cookie.split('; ');
			const tokenCookie = cookies.find(row => row.startsWith('token='));
			const userStr = localStorage.getItem('user');
			const exp = localStorage.getItem('session_exp');

			if (userStr && exp && tokenCookie && Date.now() < parseInt(exp) * 1000) {
				try {
					setUserData(JSON.parse(userStr));
				} catch {
					setUserData(null);
				}
			} else {
				setUserData(null);
			}
		};

		checkAuth();
		window.addEventListener('scroll', handleScroll);
		window.addEventListener('storage', checkAuth);
		window.addEventListener('auth-change', checkAuth);
		window.addEventListener('focus', checkAuth);

		return () => {
			window.removeEventListener('scroll', handleScroll);
			window.removeEventListener('storage', checkAuth);
			window.removeEventListener('auth-change', checkAuth);
			window.removeEventListener('focus', checkAuth);
		};
	}, [pathname]);

	const handleLogout = async () => {
		try {
			await api.auth.logout();
		} catch (error) {
			console.error('Logout error:', error);
		} finally {
			document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
			document.cookie = "session_id=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
			localStorage.removeItem('user');
			localStorage.removeItem('session_exp');
			setUserData(null);
			window.dispatchEvent(new Event('auth-change'));
			router.push('/auth/login');
		}
	};

	const navItems = [
		{ name: 'Home', href: '/' },
		{ name: 'Filmes', href: '/movies' },
		{ name: 'Séries', href: '/series' },
		{ name: 'Gêneros', href: '/genres' },
	];

	return pathname?.startsWith('/watch/') ? null : (
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

			<div className="absolute left-1/2 -translate-x-1/2 hidden lg:flex items-center bg-white/5 backdrop-blur-2xl rounded-full p-1.5 border border-white/10 shadow-2xl">
				<div className="flex items-center gap-1">
					{navItems.map((item) => (
						<Link
							key={item.name}
							href={item.href}
							className={cn(
								'px-7 py-2.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all duration-500',
								pathname === item.href
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
				<div className="relative flex items-center">
					<AnimatePresence>
						{isSearchOpen && (
							<motion.form
								initial={{ width: 0, opacity: 0 }}
								animate={{ width: 240, opacity: 1 }}
								exit={{ width: 0, opacity: 0 }}
								onSubmit={(e) => {
									e.preventDefault();
									if (searchQuery.trim()) {
										router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
										setIsSearchOpen(false);
										setSearchQuery('');
									}
								}}
								className="overflow-hidden mr-2"
							>
								<input
									id="search-input"
									type="text"
									placeholder="Buscar..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="w-full bg-white/5 border border-white/10 rounded-full px-4 py-1.5 text-[11px] font-bold text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 transition-colors"
								/>
							</motion.form>
						)}
					</AnimatePresence>
					<button 
						onClick={() => setIsSearchOpen(!isSearchOpen)}
						className="text-white/70 hover:text-white transition-colors p-2"
					>
						<Search size={18} strokeWidth={2.5} />
					</button>
				</div>
				
				{userData ? (
					<div 
						className="relative"
						onMouseEnter={() => setIsDropdownOpen(true)}
						onMouseLeave={() => setIsDropdownOpen(false)}
					>
						<div className="flex items-center gap-3 cursor-pointer hover:bg-white/10 px-1 py-1 pr-4 rounded-full transition-all border border-white/5 group">
							<div className="w-8 h-8 rounded-full overflow-hidden border border-primary/30 shadow-lg group-hover:scale-105 transition-transform">
								<img 
									src={userData.avatar_url || "https://upload.wikimedia.org/wikipedia/commons/5/5f/Gravatar-default-logo.jpg"} 
									alt="Avatar"
									className="w-full h-full object-cover"
								/>
							</div>
							<div className="flex items-center gap-1.5">
								<span className="text-xs font-bold tracking-tight text-white/90">{userData.username}</span>
								<ChevronDown size={14} className={cn("text-white/30 transition-transform duration-300", isDropdownOpen && "rotate-180")} />
							</div>
						</div>

						<AnimatePresence>
							{isDropdownOpen && (
								<motion.div
									initial={{ opacity: 0, y: 10, scale: 0.95 }}
									animate={{ opacity: 1, y: 0, scale: 1 }}
									exit={{ opacity: 0, y: 10, scale: 0.95 }}
									transition={{ duration: 0.2 }}
									className="absolute right-0 mt-2 w-48 bg-[#0a0a14]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl py-2 overflow-hidden"
								>
									<Link 
										href="/perfil" 
										className="flex items-center gap-3 px-5 py-3 text-[11px] font-bold text-white/70 hover:text-white hover:bg-white/5 transition-colors uppercase tracking-widest"
									>
										<UserCircle size={16} className="text-primary" />
										Perfil
									</Link>
									<Link 
										href="/watchlist" 
										className="flex items-center gap-3 px-5 py-3 text-[11px] font-bold text-white/70 hover:text-white hover:bg-white/5 transition-colors uppercase tracking-widest"
									>
										<Heart size={16} className="text-primary" />
										Watchlist
									</Link>
									<div className="h-px bg-white/5 my-1 mx-2" />
									<button 
										onClick={handleLogout}
										className="w-full flex items-center gap-3 px-5 py-3 text-[11px] font-bold text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-colors uppercase tracking-widest"
									>
										<LogOut size={16} />
										Sair
									</button>
								</motion.div>
							)}
						</AnimatePresence>
					</div>
				) : (
					<Link 
						href="/auth/login"
						className="bg-primary hover:bg-white text-white hover:text-primary px-7 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all hover:scale-105 active:scale-95 shadow-lg shadow-primary/20 italic"
					>
						Login
					</Link>
				)}
			</div>
		</motion.nav>
	);
};

export default Navbar;
