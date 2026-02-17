'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';

import { api } from '@/services/api';

export default function LoginPage() {
	const router = useRouter();
	const [identifier, setIdentifier] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		const session = document.cookie.split('; ').find(row => row.startsWith('token='));
		const exp = localStorage.getItem('session_exp');
		
		if (session && exp && Date.now() < parseInt(exp) * 1000) {
			router.push('/');
		}
	}, [router]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		const isEmail = identifier.includes('@');
		const body = isEmail ? { email: identifier, password } : { username: identifier, password };

		try {
			const data = await api.auth.login(body);

			if (data.status === 'error') {
				setError(data.error || 'Erro ao fazer login');
				return;
			}

			localStorage.setItem('user', JSON.stringify(data.user));
			localStorage.setItem('session_exp', data.session.exp.toString());
			
			const expires = new Date(data.session.exp * 1000).toUTCString();
			document.cookie = `token=${data.session.token}; expires=${expires}; path=/`;
			document.cookie = `session_id=${data.session.cookie}; expires=${expires}; path=/`;

			window.dispatchEvent(new Event('auth-change'));

			router.push('/');
		} catch (err) {
			setError('Erro de conexão com o servidor');
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center px-6 py-20 relative overflow-hidden">
			<motion.div 
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
				className="w-full max-w-md"
			>
				<div className="bg-[#0a0a14]/60 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl relative overflow-hidden group">
					<div className="absolute -top-24 -right-24 w-48 h-48 bg-primary/20 rounded-full blur-[80px] group-hover:bg-primary/30 transition-colors duration-700" />
					
					<div className="relative z-10">
						<div className="text-center mb-10">
							<h1 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-2">Login</h1>
							<p className="text-white/50 font-medium">Bem-vindo de volta ao universo StarFlix</p>
						</div>

						{error && (
							<div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm font-medium mb-6">
								{error}
							</div>
						)}

						<form onSubmit={handleSubmit} className="space-y-6">
							<div className="space-y-2">
								<label className="text-sm font-bold text-white/70 ml-1 uppercase tracking-widest">Usuário ou E-mail</label>
								<div className="relative group">
									<Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors" size={20} />
									<input 
										type="text" 
										required
										value={identifier}
										onChange={(e) => setIdentifier(e.target.value)}
										placeholder="username ou e-mail"
										className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-all outline-none"
									/>
								</div>
							</div>

							<div className="space-y-2">
								<div className="flex justify-between items-center ml-1">
									<label className="text-sm font-bold text-white/70 uppercase tracking-widest">Senha</label>
									<Link href="/auth/forgot-password" className="text-xs font-bold text-primary hover:text-white transition-colors uppercase tracking-widest">Esqueceu?</Link>
								</div>
								<div className="relative group">
									<Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors" size={20} />
									<input 
										type="password" 
										required
										value={password}
										onChange={(e) => setPassword(e.target.value)}
										placeholder="••••••••"
										className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-all outline-none"
									/>
								</div>
							</div>

							<button 
								disabled={isLoading}
								className="w-full bg-primary hover:bg-white text-white hover:text-primary font-black py-4 rounded-2xl transition-all duration-300 transform active:scale-95 shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group/btn uppercase italic tracking-tighter text-lg disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{isLoading ? (
									<Loader2 className="animate-spin" size={24} />
								) : (
									<>
										Entrar 
										<ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
									</>
								)}
							</button>
						</form>

						<div className="mt-10 text-center">
							<p className="text-white/50 font-medium">
								Não tem uma conta?{' '}
								<Link href="/auth/register" className="text-primary font-black hover:underline underline-offset-4">
									Cadastre-se
								</Link>
							</p>
						</div>
					</div>
				</div>
			</motion.div>
		</div>
	);
}

