'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Star, Calendar, Clock, Info, ChevronRight, ChevronDown, List, Film, Monitor, AlertCircle } from 'lucide-react';
import { api } from '@/services/api';

interface StreamOption {
	uuid: string;
	streaming_id: string;
	resolution: string;
	file_contain_subs: boolean;
}

interface Episode {
	uuid: string;
	episode_number: number;
	title: string;
	overview: string;
	release_date: string;
	still_path: string;
	runtime: number;
	stream_options: StreamOption[];
}

interface Season {
	uuid: string;
	season_name: string;
	season_number: number;
	release_date: string;
	backdrop_path: string;
	episodes: Episode[];
}

interface Content {
	content: 'Movie' | 'Serie' | 'Season' | 'Episode';
	uuid: string;
	title: string;
	original_title: string;
	overview: string;
	poster_path: string;
	backdrop_path: string;
	release_date: string;
	genres: string;
	runtime?: number;
	certificate: string;
	stream_options?: StreamOption[];
	seasons?: Season[];
}

export default function ContentPage() {
	const params = useParams();
	const router = useRouter();
	const [content, setContent] = useState<Content | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [selectedSeason, setSelectedSeason] = useState<number>(0);
	const [isSeasonOpen, setIsSeasonOpen] = useState(false);

	useEffect(() => {
		const fetchContent = async () => {
			if (!params.uuid) return;
			try {
				const data = await api.content.getDetails(params.uuid as string);
				if (data.error) {
					router.push('/movies');
					return;
				}
				setContent(data);
			} catch (error) {
				console.error(error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchContent();
	}, [params.uuid, router]);

	if (isLoading) {
		return (
			<div className="min-h-screen flex items-center justify-center bg-black">
				<div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
			</div>
		);
	}

	if (!content) return null;

	let genres: string[] = [];
	try {
		const parsed = typeof content.genres === 'string' ? JSON.parse(content.genres) : content.genres;
		genres = Array.isArray(parsed) ? parsed : [];
	} catch (e) {
		genres = [];
	}

	const hasStream = content.content === 'Movie' 
		? (content.stream_options && content.stream_options.length > 0)
		: false;

	return (
		<div className="min-h-screen text-white selection:bg-primary selection:text-white">
			<div className="relative h-[80vh] w-full">
				<div className="absolute inset-0">
					<img 
						src={content.backdrop_path} 
						alt={content.title}
						className="w-full h-full object-cover"
					/>
					<div className="absolute inset-0 bg-gradient-to-t from-[#02020a] via-[#02020a]/60 to-transparent" />
					<div className="absolute inset-0 bg-gradient-to-r from-[#02020a] via-[#02020a]/20 to-transparent" />
				</div>

				<div className="absolute inset-0 flex items-center px-6 md:px-12 pt-20">
					<div className="max-w-4xl w-full">
						<motion.div
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.8 }}
						>
							<div className="flex items-center gap-3 mb-6">
								<span className="bg-primary px-3 py-1 rounded-md text-[10px] font-black uppercase italic tracking-tighter shadow-lg shadow-primary/20">
									{content.content === 'Movie' ? 'Filme' : 'Série'}
								</span>
								<span className="text-white/40 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
									<Star size={14} className="text-primary fill-primary" /> {content.certificate}
								</span>
								{content.runtime && (
									<span className="text-white/40 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
										<Clock size={14} /> {content.runtime} min
									</span>
								)}
								<span className="text-white/40 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
									<Calendar size={14} /> {new Date(content.release_date).getFullYear()}
								</span>
							</div>

							<h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter mb-6 leading-[0.9] text-white">
								{content.title}
							</h1>

							<p className="text-lg md:text-xl text-white/60 mb-10 max-w-2xl leading-relaxed font-medium line-clamp-3 md:line-clamp-none">
								{content.overview}
							</p>

							<div className="flex flex-wrap gap-3 mb-12">
								{genres.map((genre: string) => (
									<span key={genre} className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest text-white/70">
										{genre}
									</span>
								))}
							</div>

							<div className="flex flex-col sm:flex-row items-center gap-4">
								{content.content === 'Movie' ? (
									hasStream ? (
										<button className="w-full sm:w-auto bg-white text-black px-10 py-5 rounded-2xl font-black uppercase italic tracking-widest flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl">
											<Play size={24} fill="black" /> Assistir Agora
										</button>
									) : (
										<div className="w-full sm:w-auto bg-red-500/10 border border-red-500/20 text-red-500 px-8 py-5 rounded-2xl font-black uppercase italic tracking-widest flex items-center justify-center gap-3">
											<AlertCircle size={20} /> Esse conteúdo não está disponível no momento.
										</div>
									)
								) : (
									<button 
										onClick={() => document.getElementById('episodes')?.scrollIntoView({ behavior: 'smooth' })}
										className="w-full sm:w-auto bg-white text-black px-10 py-5 rounded-2xl font-black uppercase italic tracking-widest flex items-center justify-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-xl"
									>
										<List size={20} /> Ver Episódios
									</button>
								)}
								<button className="w-full sm:w-auto bg-white/5 backdrop-blur-md border border-white/10 text-white px-10 py-5 rounded-2xl font-black uppercase italic tracking-widest flex items-center justify-center gap-3 hover:bg-white/10 transition-all">
									Ver Trailer
								</button>
							</div>
						</motion.div>
					</div>
				</div>
			</div>

			<div className="px-6 md:px-12 py-20">
				<div className="max-w-7xl mx-auto">
					{content.content === 'Serie' && content.seasons && (
						<div id="episodes" className="space-y-12">
							<div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
								<h2 className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter">Episódios</h2>
								
								<div className="relative min-w-[200px]">
									<button 
										onClick={() => setIsSeasonOpen(!isSeasonOpen)}
										className="w-full bg-white/5 border border-white/10 px-6 py-4 rounded-2xl flex items-center justify-between text-sm font-black uppercase italic tracking-widest"
									>
										{content.seasons[selectedSeason]?.season_name}
										<ChevronDown className={`transition-transform duration-300 ${isSeasonOpen ? 'rotate-180' : ''}`} size={20} />
									</button>
									
									<AnimatePresence>
										{isSeasonOpen && (
											<motion.div 
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, y: 10 }}
												className="absolute top-full left-0 right-0 mt-2 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden z-20"
											>
												{content.seasons.map((season, idx) => (
													<button
														key={season.uuid}
														onClick={() => {
															setSelectedSeason(idx);
															setIsSeasonOpen(false);
														}}
														className={`w-full px-6 py-4 text-left text-sm font-black uppercase italic tracking-widest hover:bg-white/5 transition-colors ${selectedSeason === idx ? 'text-primary' : 'text-white/40'}`}
													>
														{season.season_name}
													</button>
												))}
											</motion.div>
										)}
									</AnimatePresence>
								</div>
							</div>

							<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
								{content.seasons[selectedSeason]?.episodes.map((episode) => (
									<motion.div
										key={episode.uuid}
										initial={{ opacity: 0, y: 20 }}
										whileInView={{ opacity: 1, y: 0 }}
										viewport={{ once: true }}
										className="group bg-white/5 border border-white/10 p-6 rounded-3xl flex flex-col md:flex-row gap-6 transition-all hover:bg-white/10"
									>
										<div className="relative md:w-48 aspect-video rounded-2xl overflow-hidden flex-shrink-0">
											<img 
												src={episode.still_path || content.backdrop_path} 
												alt={episode.title}
												className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
											/>
											<div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
												{episode.stream_options && episode.stream_options.length > 0 ? (
													<Play size={32} fill="white" />
												) : (
													<AlertCircle size={32} className="text-red-500" />
												)}
											</div>
										</div>
										<div className="flex-grow">
											<div className="flex items-center justify-between mb-2">
												<h3 className="text-xl font-black italic uppercase tracking-tighter text-white group-hover:text-primary transition-colors line-clamp-1">
													{episode.episode_number}. {episode.title}
												</h3>
												{(!episode.stream_options || episode.stream_options.length === 0) && (
													<span className="text-[8px] font-black uppercase text-red-500 border border-red-500/20 px-1.5 py-0.5 rounded">Indisponível</span>
												)}
											</div>
											<p className="text-sm text-white/40 line-clamp-2 md:line-clamp-3 font-medium mb-3">
												{episode.overview || 'Sinopse não disponível para este episódio.'}
											</p>
											<div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/30">
												<span>{episode.runtime} min</span>
												<span>{new Date(episode.release_date).toLocaleDateString('pt-BR')}</span>
											</div>
										</div>
									</motion.div>
								))}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
