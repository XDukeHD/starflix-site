'use client';

import React, { useEffect, useRef } from 'react';

const StarBackground = () => {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		let animationFrameId: number;

		const stars: { x: number; y: number; size: number; speed: number }[] = [];
		const starCount = 150;

		const resize = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};

		const init = () => {
			for (let i = 0; i < starCount; i++) {
				stars.push({
					x: Math.random() * canvas.width,
					y: Math.random() * canvas.height,
					size: Math.random() * 1.5,
					speed: Math.random() * 0.5 + 0.1,
				});
			}
		};

		const draw = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = '#ffffff';
			stars.forEach((star) => {
				ctx.beginPath();
				ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
				ctx.fill();

				star.y += star.speed;
				if (star.y > canvas.height) {
					star.y = 0;
					star.x = Math.random() * canvas.width;
				}
			});
			animationFrameId = requestAnimationFrame(draw);
		};

		window.addEventListener('resize', resize);
		resize();
		init();
		draw();

		return () => {
			window.removeEventListener('resize', resize);
			cancelAnimationFrame(animationFrameId);
		};
	}, []);

	return (
		<canvas
			ref={canvasRef}
			className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none bg-[#02020a]"
		/>
	);
};

export default StarBackground;
