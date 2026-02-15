'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';

export default function RegisterPage() {
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

						<form className="space-y-5">
							<div className="space-y-2">
								<label className="text-sm font-bold text-white/70 ml-1 uppercase tracking-widest">Nome Completo</label>
								<div className="relative group">
									<User className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors" size={20} />
									<input 
										type="text" 
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
                                        placeholder="Escolha um username"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-all outline-none"
                                    />
                                </div>
                            </div>

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

							<div className="space-y-2">
								<label className="text-sm font-bold text-white/70 ml-1 uppercase tracking-widest">Senha</label>
								<div className="relative group">
									<Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-primary transition-colors" size={20} />
									<input 
										type="password" 
										placeholder="Crie uma senha forte"
										className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-primary/50 focus:bg-primary/5 transition-all outline-none"
									/>
								</div>
							</div>

							<button className="w-full bg-primary hover:bg-white text-white hover:text-primary font-black py-4 rounded-2xl transition-all duration-300 transform active:scale-95 shadow-lg shadow-primary/20 flex items-center justify-center gap-2 group/btn uppercase italic tracking-tighter text-lg mt-4">
								Cadastrar
								<ArrowRight size={20} className="group-hover/btn:translate-x-1 transition-transform" />
							</button>
						</form>

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
