'use client';

import React, { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { TOP_MOVIES, TOP_SERIES } from '@/data/constants';

interface TopTenProps {
	title: string;
	items: typeof TOP_MOVIES;
}

const TopTenCarousel = ({ title, items }: TopTenProps) => {
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
		<section className="py-16 px-6 md:px-20 select-none">
			<div className="flex items-center gap-4 mb-10">
				<div className="h-10 w-2 bg-primary rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
				<h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">{title}</h2>
			</div>

			<div className="relative group/carousel">
				<AnimatePresence>
					{showLeft && (
						<motion.div 
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: -20 }}
							className="absolute left-0 top-0 bottom-12 w-32 z-30 hidden md:flex items-center justify-center pointer-events-none group-hover/carousel:pointer-events-auto"
						>
							<motion.button 
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
								onClick={() => scroll('left')}
								className="bg-primary/90 hover:bg-white text-white hover:text-primary w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-colors pointer-events-auto"
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
					className="flex gap-16 overflow-x-auto py-12 px-4 no-scrollbar scroll-smooth outline-none"
				>
					{items.map((movie, index) => (
						<motion.div 
							key={`${movie.id}-${index}`}
							whileHover={{ scale: 1.15, zIndex: 10 }}
							transition={{ 
								duration: 0.4,
								ease: [0.22, 1, 0.36, 1]
							}}
							className="relative min-w-[280px] md:min-w-[320px] aspect-[2/3] cursor-pointer"
						>
							<div className="absolute -left-12 bottom-0 select-none pointer-events-none">
								<span className="text-[14rem] font-black leading-none text-transparent" style={{ WebkitTextStroke: '2px rgba(99,102,241,0.2)' }}>
									{index + 1}
								</span>
							</div>

							<div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border-4 border-transparent hover:border-primary ml-6 transition-all duration-300">
								<img 
									src={movie.poster} 
									alt={movie.title} 
									className="w-full h-full object-cover"
								/>
								
								<div className="absolute top-0 left-0 w-24 h-24 pointer-events-none drop-shadow-[0_8px_20px_rgba(99,102,241,0.4)]">
									<svg viewBox="0 0 100 100" className="w-full h-full fill-primary">
										<path d="M0 0 L85 0 C 55 25, 30 55, 0 100 Z" />
										<text x="12" y="38" className="fill-white font-black italic" style={{ fontSize: '26px' }}>
											{index + 1}
										</text>
									</svg>
								</div>

								<div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-end">
									<h3 className="text-white font-black text-xl italic uppercase tracking-tighter line-clamp-2 leading-tight">{movie.title}</h3>
								</div>
							</div>
						</motion.div>
					))}
				</div>

				<AnimatePresence>
					{showRight && (
						<motion.div 
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 20 }}
							className="absolute right-0 top-0 bottom-12 w-32 z-30 hidden md:flex items-center justify-center pointer-events-none group-hover/carousel:pointer-events-auto"
						>
							<motion.button 
								whileHover={{ scale: 1.1 }}
								whileTap={{ scale: 0.9 }}
								onClick={() => scroll('right')}
								className="bg-primary/90 hover:bg-white text-white hover:text-primary w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-colors pointer-events-auto"
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

export default TopTenCarousel;
