'use client';

import React, { useState } from 'react';

const JumpLoader = () => {
	const colors = [
		'#6366f1',
		'#a855f7',
		'#4f46e5',
		'#1e1b4b',
		'#3b82f6',
		'#8b5cf6',
	];
	const [strokeColor, setStrokeColor] = useState(colors[0]);
	const [colorValue, setColorValue] = useState(0);

	function updateColor() {
		setColorValue(Math.floor(Math.random() * colors.length));
		const color = colors[colorValue];
		document.documentElement.style.setProperty('--color', color);
	}

	function updateStrokeColor() {
		const color = colors[colorValue];
		setStrokeColor(color);
	}
	return (
		<div className="loader-wrapper" onAnimationIteration={updateColor}>
			<h4
				className="loader-text"
				style={{ color: strokeColor }}
				onAnimationIteration={updateStrokeColor}
			>
				Buscando galáxias...
			</h4>
			<svg viewBox="0 0 200 200" preserveAspectRatio="xMidYMid meet" className="loader-svg">
				<path
					className="jumper"
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M47.5,94.3c0-23.5,19.9-42.5,44.5-42.5s44.5,19,44.5,42.5"
				/>
				<g
					stroke={strokeColor}
					strokeWidth="1"
					onAnimationIteration={updateStrokeColor}
				>
					<ellipse
						className="circleL"
						fill="none"
						strokeMiterlimit="10"
						cx="47.2"
						cy="95.6"
						rx="10.7"
						ry="2.7"
					/>
					<ellipse
						className="circleR"
						fill="none"
						strokeMiterlimit="10"
						cx="136.2"
						cy="95.6"
						rx="10.7"
						ry="2.7"
					/>
				</g>
				<path
					className="jumper clone"
					strokeLinecap="round"
					strokeLinejoin="round"
					d="M47.5,94.3c0-23.5,19.9-42.5,44.5-42.5s44.5,19,44.5,42.5"
				/>
			</svg>
		</div>
	);
};

export default JumpLoader;