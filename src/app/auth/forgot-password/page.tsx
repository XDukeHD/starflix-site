'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Mail, ArrowLeft, Send } from 'lucide-react';

export default function ForgotPasswordPage() {
	const router = useRouter();

	useEffect(() => {
		const session = document.cookie.split('; ').find(row => row.startsWith('token='));
		const exp = localStorage.getItem('session_exp');
		
		if (session && exp && Date.now() < parseInt(exp) * 1000) {
			router.push('/home');
		}
	}, [router]);

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
						<Link href="/auth/login" className="inline-flex items-center gap-2 text-white/50 hover:text-primary transition-colors mb-8 group/back font-bold text-sm uppercase tracking-widest">
							<ArrowLeft size={18} className="group-hover/back:-translate-x-1 transition-transform" />
							Voltar ao login
						</Link>

						<div className="text-center mb-10 text-left">
							<h1 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-2">Recuperar</h1>
							<p className="text-white/50 font-medium">Enviaremos um link para redefinir sua senha</p>
						</div>

						<form className="space-y-6">
							<div className="space-y-2">
								<label className="text-sm font-bold text-white/70 ml-1 uppercase tracking-widest">E-mail</label>
								<div className="relative group">
									<Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors" size={20} />
									<input 
										type="email" 
										placeholder="seu@email.com"
										className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-all outline-none"
									/>
								</div>
							</div>

							<button className="w-full bg-primary hover:bg-white text-white hover:text-primary font-black py-4 rounded-2xl transition-all duration-300 transform active:scale-95 shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group/btn uppercase italic tracking-tighter text-lg">
								Enviar Link
								<Send size={18} className="group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1 transition-transform" />
							</button>
						</form>
					</div>
				</div>
			</motion.div>
		</div>
	);
}
