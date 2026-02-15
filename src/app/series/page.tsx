'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Star, Lock, ArrowRight, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/services/api';

interface Serie {
	uuid: string;
	title: string;
	poster_path: string;
	release_date: string;
	genres: string | string[];
	certificate: string;
}

interface Pagination {
	total: number;
	count: number;
	per_page: number;
	current_page: number;
	total_pages: number;
}

export default function SeriesPage() {
	const [series, setSeries] = useState<Serie[]>([]);
	const [pagination, setPagination] = useState<Pagination | null>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [isLoading, setIsLoading] = useState(true);
	const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

	useEffect(() => {
		const checkAuth = () => {
			const tokenMatch = document.cookie.split('; ').find(row => row.startsWith('token='));
			const exp = localStorage.getItem('session_exp');
			
			if (tokenMatch && exp && Date.now() < parseInt(exp) * 1000) {
				setIsAuthorized(true);
				fetchSeries(1);
			} else {
				setIsAuthorized(false);
				setIsLoading(false);
			}
		};

		checkAuth();
	}, []);

	const fetchSeries = async (page: number) => {
		setIsLoading(true);
		try {
			const data = await api.series.list(page);
			setSeries(data.data);
			setPagination(data.meta.pagination);
			setCurrentPage(data.meta.pagination.current_page);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoading(false);
		}
	};

	const handlePageChange = (newPage: number) => {
		fetchSeries(newPage);
		window.scrollTo({ top: 0, behavior: 'smooth' });
	};

	if (isAuthorized === false) {
		return (
			<div className="min-h-screen pt-32 px-6 flex items-center justify-center relative overflow-hidden">
				<div className="absolute inset-0 z-0">
					<div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4 opacity-20 grayscale scale-110">
						{[...Array(24)].map((_, i) => (
							<div key={i} className="aspect-[2/3] bg-white/5 rounded-xl border border-white/10" />
						))}
					</div>
					<div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
				</div>

				<motion.div 
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					className="relative z-10 max-w-2xl w-full bg-[#0a0a14]/80 backdrop-blur-2xl border border-white/10 p-12 rounded-[40px] text-center shadow-2xl"
				>
					<div className="w-20 h-20 bg-primary/20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-primary/30">
						<Lock className="text-primary" size={40} />
					</div>
					<h2 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter mb-4">Catálogo Restrito</h2>
					<p className="text-white/60 text-lg mb-10 leading-relaxed font-medium">
						O futuro do entretenimento está a um passo. Para explorar nosso catálogo completo de filmes, séries e exclusivos, você precisa fazer parte da experiência.
					</p>
					<div className="flex flex-col sm:flex-row gap-4 justify-center">
						<Link href="/auth/register" className="bg-primary hover:bg-white text-white hover:text-primary px-8 py-4 rounded-2xl font-black uppercase italic tracking-widest transition-all flex items-center justify-center gap-3 group">
							Criar Conta <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
						</Link>
						<Link href="/auth/login" className="bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-2xl font-black uppercase italic tracking-widest transition-all border border-white/10 flex items-center justify-center">
							Entrar
						</Link>
					</div>
				</motion.div>
			</div>
		);
	}

	return (
		<div className="min-h-screen pt-32 pb-20 px-6 md:px-12">
			<div className="max-w-7xl mx-auto">
				<div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
					<div>
						<h1 className="text-5xl md:text-7xl font-black text-white italic uppercase tracking-tighter mb-4">Séries</h1>
						<div className="flex items-center gap-4 text-white/40 font-bold uppercase tracking-widest text-sm">
							<span className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-primary" /> Maratonas Galácticas</span>
							<span>{pagination?.total || 0} Títulos Disponíveis</span>
						</div>
					</div>
				</div>

				{isLoading ? (
					<div className="h-[60vh] flex items-center justify-center">
						<Loader2 className="text-primary animate-spin" size={48} />
					</div>
				) : (
					<>
						<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 md:gap-8">
							{series.map((serie) => (
								<motion.div
									key={serie.uuid}
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									className="group relative"
								>
									<div className="relative aspect-[2/3] rounded-3xl overflow-hidden border border-white/5 shadow-2xl transition-all duration-500 group-hover:scale-[1.02] group-hover:border-primary/50">
										<img 
											src={serie.poster_path} 
											alt={serie.title}
											className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-1"
										/>
										<div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-6">
											<div className="flex flex-wrap gap-2 mb-3">
												{(() => {
													let genresArray: string[] = [];
													try {
														if (Array.isArray(serie.genres)) {
															genresArray = serie.genres;
														} else if (typeof serie.genres === 'string') {
															const parsed = JSON.parse(serie.genres);
															genresArray = Array.isArray(parsed) ? parsed : [parsed];
														}
													} catch {
														if (typeof serie.genres === 'string') {
															genresArray = serie.genres.split(',').map(g => g.trim());
														}
													}
													return genresArray.slice(0, 2).map((genre: string) => (
														<span key={genre} className="bg-white/20 backdrop-blur-md text-white text-[9px] font-black uppercase px-2 py-1 rounded-md">
															{genre}
														</span>
													));
												})()}
											</div>
											<Link 
												href={`/content/${serie.uuid}`}
												className="w-full bg-white text-black py-3 rounded-xl font-black uppercase italic text-xs flex items-center justify-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500"
											>
												<Play size={14} fill="black" /> Detalhes
											</Link>
										</div>
										<div className="absolute top-4 right-4 bg-black/60 backdrop-blur-xl border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
											<span className="text-secondary font-black text-xs uppercase italic tracking-tighter">TV</span>
										</div>
									</div>
									<div className="mt-4">
										<h3 className="text-white font-black uppercase italic tracking-tighter text-lg leading-tight group-hover:text-primary transition-colors line-clamp-1">{serie.title}</h3>
										<div className="flex items-center gap-3 mt-1 text-white/40 text-[10px] font-bold uppercase tracking-widest">
											<span>{new Date(serie.release_date).getFullYear()}</span>
											<span className="w-1 h-1 bg-white/20 rounded-full" />
											<span>{serie.certificate}</span>
										</div>
									</div>
								</motion.div>
							))}
						</div>

						{pagination && pagination.total_pages > 1 && (
							<div className="mt-20 flex items-center justify-center gap-4">
								<button
									onClick={() => handlePageChange(currentPage - 1)}
									disabled={currentPage === 1}
									className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white disabled:opacity-20 disabled:cursor-not-allowed hover:bg-primary transition-all group"
								>
									<ChevronLeft size={24} />
								</button>
								
								<div className="flex items-center gap-2">
									{[...Array(pagination.total_pages)].map((_, i) => {
										const page = i + 1;
										if (
											page === 1 || 
											page === pagination.total_pages || 
											(page >= currentPage - 1 && page <= currentPage + 1)
										) {
											return (
												<button
													key={page}
													onClick={() => handlePageChange(page)}
													className={`w-12 h-12 rounded-2xl font-black text-sm uppercase italic transition-all border ${
														currentPage === page 
															? 'bg-primary border-primary text-white shadow-lg shadow-primary/20' 
															: 'bg-white/5 border-white/10 text-white/40 hover:text-white hover:bg-white/10'
													}`}
												>
													{page}
												</button>
											);
										}
										if (page === currentPage - 2 || page === currentPage + 2) {
											return <span key={page} className="text-white/20 px-2">...</span>;
										}
										return null;
									})}
								</div>

								<button
									onClick={() => handlePageChange(currentPage + 1)}
									disabled={currentPage === pagination.total_pages}
									className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white disabled:opacity-20 disabled:cursor-not-allowed hover:bg-primary transition-all group"
								>
									<ChevronRight size={24} />
								</button>
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
}
