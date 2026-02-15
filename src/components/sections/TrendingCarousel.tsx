'use client';

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MOVIES, Movie } from '@/data/constants';

interface CardProps {
	movie: Movie;
}

const MovieCard = ({ movie }: CardProps) => {
	return (
		<motion.div 
			whileHover={{ 
				scale: 1.15,
				zIndex: 10,
			}}
			transition={{ 
				duration: 0.4,
				ease: [0.22, 1, 0.36, 1]
			}}
			className="relative min-w-[280px] md:min-w-[320px] aspect-[2/3] rounded-xl overflow-hidden cursor-pointer bg-card-bg border-4 border-transparent hover:border-primary shadow-2xl transition-all duration-500"
		>
			<img 
				src={movie.poster} 
				alt={movie.title} 
				className="w-full h-full object-cover"
			/>
			
			<div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
				<h3 className="text-white font-black text-xl mb-2 italic tracking-tighter uppercase">{movie.title}</h3>
				
				<div className="flex items-center gap-4">
					<span className="text-primary font-bold text-sm bg-primary/20 px-2 py-1 rounded">
						★ {movie.rating}
					</span>
					<span className="text-white/50 text-sm font-bold">{movie.year}</span>
					<span className="border border-white/30 text-white/70 text-[10px] px-1 rounded font-bold uppercase">
						{movie.ageRating}+
					</span>
				</div>
			</div>
		</motion.div>
	);
};

const TrendingCarousel = () => {
	const scrollRef = useRef<HTMLDivElement>(null);
	const [showLeft, setShowLeft] = useState(false);
	const [showRight, setShowRight] = useState(true);

	const scroll = (direction: 'left' | 'right') => {
		if (scrollRef.current) {
			const { scrollLeft, clientWidth } = scrollRef.current;
			const scrollTo = direction === 'left' ? scrollLeft - clientWidth * 0.8 : scrollLeft + clientWidth * 0.8;
			scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
		}
	};

	const handleScroll = () => {
		if (scrollRef.current) {
			const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
			setShowLeft(scrollLeft > 10);
			setShowRight(scrollLeft < scrollWidth - clientWidth - 10);
		}
	};

	const handleWheel = (e: React.WheelEvent) => {
		if (scrollRef.current && Math.abs(e.deltaY) > 0) {
			scrollRef.current.scrollLeft += e.deltaY;
		}
	};

	return (
		<section className="py-16 px-6 md:px-20 relative select-none">
			<div className="flex items-center justify-between mb-10">
				<h2 className="text-3xl font-black text-white uppercase italic tracking-tighter border-l-8 border-primary pl-4">Em Alta</h2>
				<button className="text-primary text-sm font-black uppercase tracking-widest hover:text-white transition-colors">Ver todos</button>
			</div>

			<div className="relative -mx-4 group/carousel">
				<AnimatePresence>
					{showLeft && (
						<motion.div 
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -20 }}
							className="absolute left-4 top-0 bottom-12 w-32 z-30 hidden md:flex items-center justify-center pointer-events-none group-hover/carousel:pointer-events-auto"
						>
							<motion.button 
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
								onClick={() => scroll('left')}
								className="bg-primary/90 hover:bg-white text-white hover:text-primary w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-colors"
								style={{ pointerEvents: 'auto' }}
							>
								<ChevronLeft size={32} strokeWidth={3} />
							</motion.button>
						</motion.div>
					)}
				</AnimatePresence>

				<div 
					ref={scrollRef}
					onScroll={handleScroll}
					onWheel={handleWheel}
					className="flex gap-8 overflow-x-auto py-12 px-4 no-scrollbar scroll-smooth outline-none"
				>
					{MOVIES.concat(MOVIES).map((movie, index) => (
						<MovieCard key={`${movie.id}-${index}`} movie={movie} />
					))}
				</div>

				<AnimatePresence>
					{showRight && (
						<motion.div 
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 20 }}
							className="absolute right-4 top-0 bottom-12 w-32 z-30 hidden md:flex items-center justify-center pointer-events-none group-hover/carousel:pointer-events-auto"
						>
							<motion.button 
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
								onClick={() => scroll('right')}
								className="bg-primary/90 hover:bg-white text-white hover:text-primary w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-colors"
								style={{ pointerEvents: 'auto' }}
							>
								<ChevronRight size={32} strokeWidth={3} />
							</motion.button>
						</motion.div>
					)}
				</AnimatePresence>
			</div>
		</section>
	);
};

export default TrendingCarousel;
