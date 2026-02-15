'use client';

import React from 'react';
import Link from 'next/link';

const Footer = () => {
	return (
		<footer className="bg-black/40 backdrop-blur-md border-t border-white/5 pt-20 pb-10 px-6 relative overflow-hidden">
			<div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
			
			<div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-16 relative z-10">
				<div className="col-span-1 md:col-span-1">
					<Link href="/" className="text-4xl font-black text-primary tracking-tighter mb-8 block italic">
						STAR<span className="text-white">FLIX</span>
					</Link>
					<p className="text-white/40 text-sm leading-relaxed max-w-xs">
						O melhor do entretenimento espacial e terrestre está aqui. Explore milhares de títulos em 4K.
					</p>
				</div>

				<div>
					<h3 className="text-white font-black uppercase tracking-widest text-xs mb-6 text-primary">Navegação</h3>
					<ul className="space-y-3">
						<li><Link href="/" className="text-white/50 hover:text-white transition-all hover:pl-2 text-sm">Home</Link></li>
						<li><Link href="/movies" className="text-white/50 hover:text-white transition-all hover:pl-2 text-sm">Filmes</Link></li>
						<li><Link href="/series" className="text-white/50 hover:text-white transition-all hover:pl-2 text-sm">Séries</Link></li>
						<li><Link href="/categorias" className="text-white/50 hover:text-white transition-all hover:pl-2 text-sm">Categorias</Link></li>
					</ul>
				</div>

				<div>
					<h3 className="text-white font-black uppercase tracking-widest text-xs mb-6 text-primary">Suporte</h3>
					<ul className="space-y-3">
						<li><Link href="#" className="text-white/50 hover:text-white transition-all hover:pl-2 text-sm">Ajuda</Link></li>
						<li><Link href="#" className="text-white/50 hover:text-white transition-all hover:pl-2 text-sm">Privacidade</Link></li>
						<li><Link href="#" className="text-white/50 hover:text-white transition-all hover:pl-2 text-sm">Termos</Link></li>
					</ul>
				</div>

				<div>
					<h3 className="text-white font-black uppercase tracking-widest text-xs mb-6 text-primary">Redes Sociais</h3>
					<div className="flex gap-4">
						<div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center cursor-pointer hover:bg-primary hover:scale-110 transition-all border border-white/5">
							<span className="text-white font-black italic">IG</span>
						</div>
						<div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center cursor-pointer hover:bg-primary hover:scale-110 transition-all border border-white/5">
							<span className="text-white font-black italic">TW</span>
						</div>
					</div>
				</div>
			</div>

			<div className="max-w-7xl mx-auto border-t border-white/5 mt-20 pt-8 text-center">
				<p className="text-white/20 text-[10px] font-bold uppercase tracking-[0.3em]">
					© 2026 StarFlix - O Universo é o Limite
				</p>
			</div>
		</footer>
	);
};

export default Footer;
