'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { MOVIES } from '@/data/constants';

const Hero = () => {
	const [currentIndex, setCurrentIndex] = useState(0);

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentIndex((prev) => (prev + 1) % MOVIES.length);
		}, 8000);
		return () => clearInterval(timer);
	}, []);

	const movie = MOVIES[currentIndex];

	return (
		<div className="relative h-[90vh] w-full overflow-hidden">
			<AnimatePresence mode="wait">
				<motion.div
					key={movie.id}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 1 }}
					className="absolute inset-0"
				>
					<div 
						className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] hover:scale-105 brightness-[0.7] saturate-[1.2]"
						style={{ backgroundImage: `url(${movie.backdrop})` }}
					/>
					<div className="absolute inset-0 bg-gradient-to-r from-[#02020a] via-[#02020a]/40 to-transparent" />
					<div className="absolute inset-0 bg-gradient-to-t from-[#02020a] via-transparent to-transparent" />
					<div className="absolute inset-0 bg-gradient-to-b from-[#02020a]/80 via-transparent to-transparent h-1/3" />
					
					<div className="absolute inset-0 flex flex-col justify-center px-6 md:px-20 max-w-3xl">
						<motion.div
							initial={{ y: 20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ delay: 0.5 }}
						>
							<div className="flex items-center gap-2 mb-4">
								<div className="bg-primary text-white text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider shadow-lg shadow-primary/30">
									Destaque
								</div>
								<div className="flex items-center gap-1 text-primary font-bold text-sm">
									<Star size={14} fill="currentColor" />
									{movie.rating}
								</div>
								<div className="text-white/60 text-sm">{movie.year}</div>
								<div className="border border-white/40 text-white/70 text-[10px] px-1 rounded font-bold">
									{movie.ageRating}+
								</div>
							</div>
							
							<h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white mb-4 line-clamp-3 leading-[1.1] uppercase italic tracking-tighter max-w-4xl">
								{movie.title}
							</h1>
							
							<div className="flex flex-wrap gap-2 mb-6">
								{movie.genres.map(genre => (
									<span key={genre} className="text-white/80 text-xs font-bold bg-white/5 px-4 py-1.5 rounded-full border border-white/10 backdrop-blur-md">
										{genre}
									</span>
								))}
							</div>

							<p className="text-white/60 text-sm md:text-base mb-10 line-clamp-3 leading-relaxed max-w-2xl">
								{movie.description}
							</p>

							<div className="flex items-center gap-4">
								<button className="bg-primary hover:bg-primary-hover text-white px-8 py-4 rounded-xl font-black flex items-center gap-3 transition-all hover:scale-105 active:scale-95 shadow-xl shadow-primary/30 group">
									<Play size={20} fill="currentColor" className="group-hover:scale-110 transition-transform" />
									<span className="uppercase tracking-widest text-xs">Assistir Agora</span>
								</button>
								<button className="bg-white/5 hover:bg-white/10 backdrop-blur-xl text-white px-8 py-4 rounded-xl font-black flex items-center gap-3 transition-all hover:scale-105 active:scale-95 border border-white/10 group">
									<Info size={20} className="group-hover:rotate-12 transition-transform" />
									<span className="uppercase tracking-widest text-xs">Ver Mais</span>
								</button>
							</div>
						</motion.div>
					</div>
				</motion.div>
			</AnimatePresence>

			<div className="absolute bottom-10 right-10 flex gap-2">
				<button 
					onClick={() => setCurrentIndex((prev) => (prev - 1 + MOVIES.length) % MOVIES.length)}
					className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all active:scale-90"
				>
					<ChevronLeft size={24} />
				</button>
				<button 
					onClick={() => setCurrentIndex((prev) => (prev + 1) % MOVIES.length)}
					className="w-12 h-12 rounded-full bg-white/5 hover:bg-white/20 backdrop-blur-md border border-white/10 flex items-center justify-center text-white transition-all active:scale-90"
				>
					<ChevronRight size={24} />
				</button>
			</div>
		</div>
	);
};

export default Hero;
