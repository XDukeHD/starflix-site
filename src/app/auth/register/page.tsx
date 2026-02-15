'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, Lock, User, ArrowRight, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { api } from '@/services/api';

export default function RegisterPage() {
	const router = useRouter();
	const [formData, setFormData] = useState({
		name: '',
		username: '',
		email: '',
		password: ''
	});
	const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'unavailable'>('idle');
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | string[] | null>(null);
	const [success, setSuccess] = useState(false);

	useEffect(() => {
		const session = document.cookie.split('; ').find(row => row.startsWith('token='));
		const exp = localStorage.getItem('session_exp');
		
		if (session && exp && Date.now() < parseInt(exp) * 1000) {
			router.push('/home');
		}
	}, [router]);

	useEffect(() => {
		const checkUsername = async () => {
			if (formData.username.length < 3) {
				setUsernameStatus('idle');
				return;
			}

			setUsernameStatus('checking');
			try {
				const data = await api.auth.checkUsername(formData.username);
				setUsernameStatus(data.available ? 'available' : 'unavailable');
			} catch (err) {
				setUsernameStatus('idle');
			}
		};

		const timeoutId = setTimeout(checkUsername, 500);
		return () => clearTimeout(timeoutId);
	}, [formData.username]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError(null);

		try {
			const data = await api.auth.register(formData);

			if (data.error || data.errors) {
				setError(data.errors || data.error || 'Erro ao registrar');
				return;
			}

			setSuccess(true);
			setTimeout(() => router.push('/auth/login'), 2000);
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
							<h1 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-2">Criar Conta</h1>
							<p className="text-white/50 font-medium">Faça parte do futuro do entretenimento</p>
						</div>

						<AnimatePresence mode="wait">
							{success ? (
								<motion.div 
									initial={{ opacity: 0, scale: 0.9 }}
									animate={{ opacity: 1, scale: 1 }}
									className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-6 rounded-2xl text-center flex flex-col items-center gap-3"
								>
									<CheckCircle2 size={40} />
									<p className="font-bold uppercase tracking-tight italic">Conta criada com sucesso! Redirecionando...</p>
								</motion.div>
							) : (
								<form onSubmit={handleSubmit} className="space-y-5">
									{error && (
										<div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm font-medium">
											{Array.isArray(error) ? (
												<ul className="list-disc list-inside">
													{error.map((err, i) => <li key={i}>{err}</li>)}
												</ul>
											) : (
												<p>{error}</p>
											)}
										</div>
									)}

									<div className="space-y-2">
										<label className="text-sm font-bold text-white/70 ml-1 uppercase tracking-widest">Nome Completo</label>
										<div className="relative group">
											<User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors" size={20} />
											<input 
												type="text" 
												required
												value={formData.name}
												onChange={(e) => setFormData({ ...formData, name: e.target.value })}
												placeholder="Seu nome"
												className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-all outline-none"
											/>
										</div>
									</div>

									<div className="space-y-2">
										<label className="text-sm font-bold text-white/70 ml-1 uppercase tracking-widest">Username</label>
										<div className="relative group">
											<User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors" size={20} />
											<input 
												type="text" 
												required
												value={formData.username}
												onChange={(e) => setFormData({ ...formData, username: e.target.value })}
												placeholder="Escolha um username"
												className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-12 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-all outline-none"
											/>
											<div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center">
												{usernameStatus === 'checking' && <Loader2 className="animate-spin text-white/30" size={18} />}
												{usernameStatus === 'available' && <CheckCircle2 className="text-emerald-500" size={18} />}
												{usernameStatus === 'unavailable' && <XCircle className="text-red-500" size={18} />}
											</div>
										</div>
										{usernameStatus === 'unavailable' && (
											<p className="text-[10px] text-red-500 font-bold uppercase tracking-tighter ml-1">Username indisponível</p>
										)}
									</div>

									<div className="space-y-2">
										<label className="text-sm font-bold text-white/70 ml-1 uppercase tracking-widest">E-mail</label>
										<div className="relative group">
											<Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors" size={20} />
											<input 
												type="email" 
												required
												value={formData.email}
												onChange={(e) => setFormData({ ...formData, email: e.target.value })}
												placeholder="seu@email.com"
												className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-all outline-none"
											/>
										</div>
									</div>

									<div className="space-y-2">
										<label className="text-sm font-bold text-white/70 ml-1 uppercase tracking-widest">Senha</label>
										<div className="relative group">
											<Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors" size={20} />
											<input 
												type="password" 
												required
												value={formData.password}
												onChange={(e) => setFormData({ ...formData, password: e.target.value })}
												placeholder="Crie uma senha forte"
												className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-all outline-none"
											/>
										</div>
									</div>

									<button 
										disabled={isLoading || usernameStatus === 'unavailable' || usernameStatus === 'checking'}
										className="w-full bg-primary hover:bg-white text-white hover:text-primary font-black py-4 rounded-2xl transition-all duration-300 transform active:scale-95 shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group/btn uppercase italic tracking-tighter text-lg mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
									>
										{isLoading ? (
											<Loader2 className="animate-spin" size={24} />
										) : (
											<>
												Cadastrar
												<ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
											</>
										)}
									</button>
								</form>
							)}
						</AnimatePresence>

						<div className="mt-10 text-center">
							<p className="text-white/50 font-medium">
								Já tem uma conta?{' '}
								<Link href="/auth/login" className="text-primary font-black hover:underline underline-offset-4">
									Fazer Login
								</Link>
							</p>
						</div>
					</div>
				</div>
			</motion.div>
		</div>
	);
}

