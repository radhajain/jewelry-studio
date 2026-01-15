import React from 'react';
import { JewelryPiece, SettingStyle, GemstoneShape } from '../../types';
import { getGemstoneById } from '../../data/gemstones';
import { metals, MetalColor } from '../../data/metals';
import styles from './PieceRenderer.module.css';

interface PieceRendererProps {
	piece: Partial<JewelryPiece>;
	size?: number;
}

// Get metal data from metals.ts
const getMetalGradient = (metalId: MetalColor) => {
	const metal = metals.find((m) => m.id === metalId);
	if (metal) {
		return { start: metal.hexStart, end: metal.hexEnd };
	}
	return { start: '#DFBD69', end: '#926F34' };
};

const PieceRenderer2D: React.FC<PieceRendererProps> = ({
	piece,
	size = 400,
}) => {
	const metalGradient = getMetalGradient(piece.design?.metal || 'yellow-gold');
	const finish = piece.design?.finish || 'polished';
	const earringStyle = piece.design?.earringStyle || 'drop';
	const bandThickness = piece.design?.bandThickness || 'medium';
	const bandStyle = piece.design?.bandStyle || 'plain';
	const braceletStyle = piece.design?.braceletStyle || 'chain';

	// Get gemstone data from library
	const gemstone = piece.design?.primaryGemstone
		? getGemstoneById(piece.design.primaryGemstone.gemstoneId)
		: null;
	const gemstoneColor = gemstone?.color || '#4ECDC4';
	const gemstoneImageUrl = gemstone?.imageUrl;
	const gemstoneShape: GemstoneShape = (piece.design?.primaryGemstone?.shapeOverride || gemstone?.shape || 'round') as GemstoneShape;
	const gemstoneSetting: SettingStyle = piece.design?.primaryGemstone?.setting || 'prong';

	// Unique IDs for gradients to avoid conflicts
	const uid = React.useMemo(() => Math.random().toString(36).substr(2, 9), []);
	const gradientId = `metal-gradient-${uid}`;
	const shadowId = `shadow-${uid}`;
	const gemstonePatternId = `gemstone-${uid}`;
	const highlightId = `highlight-${uid}`;
	const gemstoneClipId = `gemstone-clip-${uid}`;

	// Adjust opacity based on finish
	const getFinishFilter = () => {
		switch (finish) {
			case 'matte':
				return 'brightness(0.85) saturate(0.9)';
			case 'brushed':
				return 'brightness(0.95) contrast(1.05)';
			case 'hammered':
				return 'brightness(1.05)';
			default:
				return 'brightness(1.1) saturate(1.1)';
		}
	};

	// Get band width multiplier based on thickness
	const getBandMultiplier = () => {
		switch (bandThickness) {
			case 'thin':
				return 0.6;
			case 'thick':
				return 1.4;
			default:
				return 1;
		}
	};

	const renderDefs = () => (
		<defs>
			{/* Main metal gradient */}
			<linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
				<stop offset="0%" stopColor={metalGradient.start} />
				<stop offset="50%" stopColor={metalGradient.start} stopOpacity="0.9" />
				<stop offset="100%" stopColor={metalGradient.end} />
			</linearGradient>

			{/* Highlight gradient for 3D effect */}
			<linearGradient id={highlightId} x1="0%" y1="0%" x2="0%" y2="100%">
				<stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
				<stop offset="50%" stopColor="#ffffff" stopOpacity="0.1" />
				<stop offset="100%" stopColor="#000000" stopOpacity="0.2" />
			</linearGradient>

			{/* Drop shadow filter */}
			<filter id={shadowId} x="-50%" y="-50%" width="200%" height="200%">
				<feDropShadow dx="2" dy="4" stdDeviation="4" floodOpacity="0.3" />
			</filter>

			{/* Gemstone pattern with actual image */}
			{gemstoneImageUrl && (
				<pattern
					id={gemstonePatternId}
					patternUnits="objectBoundingBox"
					width="1"
					height="1"
				>
					<image
						href={gemstoneImageUrl}
						width="100%"
						height="100%"
						preserveAspectRatio="xMidYMid slice"
					/>
				</pattern>
			)}

			{/* Radial gradient for gemstone color fallback */}
			<radialGradient
				id={`${gemstonePatternId}-color`}
				cx="30%"
				cy="30%"
				r="80%"
			>
				<stop offset="0%" stopColor="#ffffff" stopOpacity="0.7" />
				<stop offset="20%" stopColor={gemstoneColor} stopOpacity="0.9" />
				<stop offset="100%" stopColor={gemstoneColor} />
			</radialGradient>

			{/* Clip paths for gemstone shapes */}
			<clipPath id={`${gemstoneClipId}-round`}>
				<circle cx="50" cy="50" r="50" />
			</clipPath>
			<clipPath id={`${gemstoneClipId}-oval`}>
				<ellipse cx="50" cy="50" rx="60" ry="45" />
			</clipPath>
			<clipPath id={`${gemstoneClipId}-princess`}>
				<rect x="10" y="10" width="80" height="80" />
			</clipPath>
			<clipPath id={`${gemstoneClipId}-emerald`}>
				<rect x="5" y="15" width="90" height="70" rx="3" />
			</clipPath>
			<clipPath id={`${gemstoneClipId}-cushion`}>
				<rect x="10" y="10" width="80" height="80" rx="15" />
			</clipPath>
		</defs>
	);

	// Render gemstone setting
	const renderSetting = (cx: number, cy: number, radius: number, setting: SettingStyle) => {
		const metalFill = `url(#${gradientId})`;

		switch (setting) {
			case 'bezel':
				// Full metal rim around gemstone
				return (
					<g>
						<circle
							cx={cx}
							cy={cy}
							r={radius * 1.2}
							fill={metalFill}
							stroke={metalGradient.end}
							strokeWidth={1}
						/>
						<circle
							cx={cx}
							cy={cy}
							r={radius * 1.15}
							fill="none"
							stroke={metalGradient.start}
							strokeWidth={radius * 0.15}
						/>
					</g>
				);
			case 'pave':
				// Small accent dots around
				return (
					<g>
						{[0, 60, 120, 180, 240, 300].map((angle) => {
							const rad = (angle * Math.PI) / 180;
							const x = cx + Math.cos(rad) * radius * 1.3;
							const y = cy + Math.sin(rad) * radius * 1.3;
							return (
								<circle
									key={angle}
									cx={x}
									cy={y}
									r={radius * 0.15}
									fill={metalFill}
									stroke={metalGradient.end}
									strokeWidth={0.5}
								/>
							);
						})}
					</g>
				);
			case 'channel':
				// Metal rails on two sides
				return (
					<g>
						<rect
							x={cx - radius * 1.4}
							y={cy - radius * 0.5}
							width={radius * 0.25}
							height={radius}
							fill={metalFill}
							rx={2}
						/>
						<rect
							x={cx + radius * 1.15}
							y={cy - radius * 0.5}
							width={radius * 0.25}
							height={radius}
							fill={metalFill}
							rx={2}
						/>
					</g>
				);
			case 'tension':
				// Metal grips from sides
				return (
					<g>
						<path
							d={`M ${cx - radius * 1.5} ${cy - radius * 0.3}
								L ${cx - radius * 1.1} ${cy}
								L ${cx - radius * 1.5} ${cy + radius * 0.3}`}
							fill={metalFill}
							stroke={metalGradient.end}
							strokeWidth={1}
						/>
						<path
							d={`M ${cx + radius * 1.5} ${cy - radius * 0.3}
								L ${cx + radius * 1.1} ${cy}
								L ${cx + radius * 1.5} ${cy + radius * 0.3}`}
							fill={metalFill}
							stroke={metalGradient.end}
							strokeWidth={1}
						/>
					</g>
				);
			case 'flush':
				// Gemstone sits flush - just a thin border
				return (
					<circle
						cx={cx}
						cy={cy}
						r={radius * 1.05}
						fill="none"
						stroke={metalGradient.end}
						strokeWidth={2}
					/>
				);
			default: // prong
				// Four prongs holding the gemstone
				return (
					<g>
						{[45, 135, 225, 315].map((angle) => {
							const rad = (angle * Math.PI) / 180;
							const x1 = cx + Math.cos(rad) * radius * 0.7;
							const y1 = cy + Math.sin(rad) * radius * 0.7;
							const x2 = cx + Math.cos(rad) * radius * 1.2;
							const y2 = cy + Math.sin(rad) * radius * 1.2;
							return (
								<g key={angle}>
									<line
										x1={x1}
										y1={y1}
										x2={x2}
										y2={y2}
										stroke={metalFill}
										strokeWidth={radius * 0.15}
										strokeLinecap="round"
									/>
									<circle
										cx={x2}
										cy={y2}
										r={radius * 0.12}
										fill={metalGradient.start}
									/>
								</g>
							);
						})}
						{/* Base under gemstone */}
						<circle
							cx={cx}
							cy={cy}
							r={radius * 0.5}
							fill={metalFill}
							opacity={0.6}
						/>
					</g>
				);
		}
	};

	// Render gemstone with image and shape
	const renderGemstone = (
		cx: number,
		cy: number,
		radius: number,
		shape?: GemstoneShape,
		setting?: SettingStyle,
		showSetting: boolean = true
	) => {
		const actualShape = shape || gemstoneShape;
		const actualSetting = setting || gemstoneSetting;
		const fill = gemstoneImageUrl ? `url(#${gemstonePatternId})` : `url(#${gemstonePatternId}-color)`;

		// Render gemstone shape
		const renderGemstoneShape = () => {
			switch (actualShape) {
				case 'oval':
					return (
						<ellipse
							cx={cx}
							cy={cy}
							rx={radius * 1.2}
							ry={radius * 0.85}
							fill={fill}
							stroke={gemstoneColor}
							strokeWidth={0.5}
							strokeOpacity={0.3}
						/>
					);
				case 'emerald':
					return (
						<rect
							x={cx - radius * 0.9}
							y={cy - radius * 0.5}
							width={radius * 1.8}
							height={radius}
							rx={3}
							fill={fill}
							stroke={gemstoneColor}
							strokeWidth={0.5}
							strokeOpacity={0.3}
						/>
					);
				case 'cushion':
					return (
						<rect
							x={cx - radius * 0.75}
							y={cy - radius * 0.75}
							width={radius * 1.5}
							height={radius * 1.5}
							rx={radius * 0.25}
							fill={fill}
							stroke={gemstoneColor}
							strokeWidth={0.5}
							strokeOpacity={0.3}
						/>
					);
				case 'pear':
					return (
						<path
							d={`M ${cx} ${cy - radius * 1.1}
								Q ${cx + radius * 0.9} ${cy - radius * 0.2} ${cx + radius * 0.7} ${cy + radius * 0.4}
								Q ${cx} ${cy + radius * 1.1} ${cx - radius * 0.7} ${cy + radius * 0.4}
								Q ${cx - radius * 0.9} ${cy - radius * 0.2} ${cx} ${cy - radius * 1.1}`}
							fill={fill}
							stroke={gemstoneColor}
							strokeWidth={0.5}
							strokeOpacity={0.3}
						/>
					);
				case 'marquise':
					return (
						<ellipse
							cx={cx}
							cy={cy}
							rx={radius * 0.55}
							ry={radius * 1.2}
							fill={fill}
							stroke={gemstoneColor}
							strokeWidth={0.5}
							strokeOpacity={0.3}
						/>
					);
				case 'heart':
					return (
						<path
							d={`M ${cx} ${cy + radius * 0.7}
								C ${cx - radius * 1.2} ${cy - radius * 0.3} ${cx - radius * 0.6} ${cy - radius * 1} ${cx} ${cy - radius * 0.4}
								C ${cx + radius * 0.6} ${cy - radius * 1} ${cx + radius * 1.2} ${cy - radius * 0.3} ${cx} ${cy + radius * 0.7}`}
							fill={fill}
							stroke={gemstoneColor}
							strokeWidth={0.5}
							strokeOpacity={0.3}
						/>
					);
				case 'princess':
					return (
						<rect
							x={cx - radius * 0.7}
							y={cy - radius * 0.7}
							width={radius * 1.4}
							height={radius * 1.4}
							fill={fill}
							stroke={gemstoneColor}
							strokeWidth={0.5}
							strokeOpacity={0.3}
						/>
					);
				default: // round
					return (
						<circle
							cx={cx}
							cy={cy}
							r={radius}
							fill={fill}
							stroke={gemstoneColor}
							strokeWidth={0.5}
							strokeOpacity={0.3}
						/>
					);
			}
		};

		// Add facet lines for more realistic look
		const renderFacets = () => {
			const lines = [];
			for (let i = 0; i < 8; i++) {
				const angle = (i * 45 * Math.PI) / 180;
				lines.push(
					<line
						key={i}
						x1={cx}
						y1={cy}
						x2={cx + Math.cos(angle) * radius * 0.7}
						y2={cy + Math.sin(angle) * radius * 0.7}
						stroke="white"
						strokeWidth={0.5}
						opacity={0.2}
					/>
				);
			}
			return <g>{lines}</g>;
		};

		return (
			<g>
				{/* Setting (behind gemstone) */}
				{showSetting && renderSetting(cx, cy, radius, actualSetting)}

				{/* Gemstone shape */}
				{renderGemstoneShape()}

				{/* Facet details */}
				{renderFacets()}

				{/* Sparkle highlight */}
				<circle
					cx={cx - radius * 0.25}
					cy={cy - radius * 0.25}
					r={radius * 0.2}
					fill="white"
					opacity={0.7}
				/>
				<circle
					cx={cx - radius * 0.35}
					cy={cy - radius * 0.35}
					r={radius * 0.08}
					fill="white"
					opacity={0.9}
				/>
			</g>
		);
	};

	const renderRing = () => {
		const centerX = size / 2;
		const centerY = size / 2;
		const outerRadius = size * 0.35;
		const bandMultiplier = getBandMultiplier();
		const baseBandWidth = size * 0.07;
		const bandWidth = baseBandWidth * bandMultiplier;
		const middleRadius = outerRadius - bandWidth / 2;

		const renderBandPattern = () => {
			switch (bandStyle) {
				case 'twisted':
					const twistedPaths = [];
					for (let i = 0; i < 24; i++) {
						const angle1 = (i * 15 * Math.PI) / 180;
						const angle2 = ((i + 1) * 15 * Math.PI) / 180;
						const r1 = middleRadius + Math.sin(i * 0.5) * (bandWidth * 0.3);
						const r2 = middleRadius + Math.sin((i + 1) * 0.5) * (bandWidth * 0.3);
						twistedPaths.push(
							<line
								key={i}
								x1={centerX + Math.cos(angle1) * r1}
								y1={centerY + Math.sin(angle1) * r1}
								x2={centerX + Math.cos(angle2) * r2}
								y2={centerY + Math.sin(angle2) * r2}
								stroke={metalGradient.end}
								strokeWidth={bandWidth * 0.6}
								strokeLinecap="round"
								opacity={0.3}
							/>
						);
					}
					return <g>{twistedPaths}</g>;
				case 'braided':
					const braidedPaths = [];
					for (let i = 0; i < 36; i++) {
						const angle = (i * 10 * Math.PI) / 180;
						const offset = Math.sin(i * 0.8) * (bandWidth * 0.25);
						braidedPaths.push(
							<circle
								key={i}
								cx={centerX + Math.cos(angle) * (middleRadius + offset)}
								cy={centerY + Math.sin(angle) * (middleRadius + offset)}
								r={bandWidth * 0.15}
								fill={metalGradient.start}
								opacity={0.5}
							/>
						);
					}
					return <g>{braidedPaths}</g>;
				case 'textured':
					const texturedDots = [];
					for (let i = 0; i < 48; i++) {
						const angle = (i * 7.5 * Math.PI) / 180;
						texturedDots.push(
							<circle
								key={i}
								cx={centerX + Math.cos(angle) * middleRadius}
								cy={centerY + Math.sin(angle) * middleRadius}
								r={1.5}
								fill={metalGradient.end}
								opacity={0.4}
							/>
						);
					}
					return <g>{texturedDots}</g>;
				case 'split':
					return (
						<>
							<circle
								cx={centerX}
								cy={centerY}
								r={middleRadius + bandWidth * 0.2}
								fill="none"
								stroke={`url(#${gradientId})`}
								strokeWidth={bandWidth * 0.35}
							/>
							<circle
								cx={centerX}
								cy={centerY}
								r={middleRadius - bandWidth * 0.2}
								fill="none"
								stroke={`url(#${gradientId})`}
								strokeWidth={bandWidth * 0.35}
							/>
						</>
					);
				default:
					return null;
			}
		};

		return (
			<g filter={`url(#${shadowId})`} style={{ filter: getFinishFilter() }}>
				{/* Main ring band */}
				{bandStyle !== 'split' && (
					<circle
						cx={centerX}
						cy={centerY}
						r={middleRadius}
						fill="none"
						stroke={`url(#${gradientId})`}
						strokeWidth={bandWidth}
					/>
				)}

				{renderBandPattern()}

				{/* 3D highlight */}
				<circle
					cx={centerX}
					cy={centerY}
					r={middleRadius}
					fill="none"
					stroke={`url(#${highlightId})`}
					strokeWidth={bandWidth * 0.5}
					opacity={0.4}
				/>

				{/* Inner shadow */}
				<circle
					cx={centerX}
					cy={centerY}
					r={middleRadius - bandWidth / 2 + 2}
					fill="none"
					stroke="rgba(0,0,0,0.2)"
					strokeWidth={2}
				/>

				{/* Hammered texture */}
				{finish === 'hammered' && (
					<>
						{[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => {
							const rad = (angle * Math.PI) / 180;
							return (
								<circle
									key={angle}
									cx={centerX + Math.cos(rad) * middleRadius}
									cy={centerY + Math.sin(rad) * middleRadius}
									r={3}
									fill={metalGradient.start}
									opacity={0.3}
								/>
							);
						})}
					</>
				)}

				{/* Gemstone at top */}
				{piece.design?.primaryGemstone && (
					renderGemstone(centerX, centerY - middleRadius, size * 0.06)
				)}
			</g>
		);
	};

	const renderEarring = () => {
		const centerX = size / 2;
		const topY = size * 0.15;

		switch (earringStyle) {
			case 'stud':
				return (
					<g filter={`url(#${shadowId})`} style={{ filter: getFinishFilter() }}>
						<line
							x1={centerX}
							y1={size * 0.55}
							x2={centerX}
							y2={size * 0.7}
							stroke={`url(#${gradientId})`}
							strokeWidth={3}
						/>
						<circle
							cx={centerX}
							cy={size * 0.5}
							r={size * 0.18}
							fill={`url(#${gradientId})`}
							stroke={metalGradient.end}
							strokeWidth={2}
						/>
						<ellipse
							cx={centerX - size * 0.05}
							cy={size * 0.45}
							rx={size * 0.08}
							ry={size * 0.04}
							fill="white"
							opacity={0.3}
						/>
						{piece.design?.primaryGemstone &&
							renderGemstone(centerX, size * 0.5, size * 0.12)}
					</g>
				);

			case 'hoop':
				const hoopRadius = size * 0.25;
				const hoopThickness = size * 0.04;
				return (
					<g filter={`url(#${shadowId})`} style={{ filter: getFinishFilter() }}>
						<circle
							cx={centerX}
							cy={size * 0.45}
							r={hoopRadius}
							fill="none"
							stroke={`url(#${gradientId})`}
							strokeWidth={hoopThickness}
						/>
						<path
							d={`M ${centerX - hoopRadius * 0.7} ${size * 0.45 - hoopRadius * 0.7}
								A ${hoopRadius} ${hoopRadius} 0 0 1 ${centerX + hoopRadius * 0.7} ${size * 0.45 - hoopRadius * 0.7}`}
							fill="none"
							stroke="white"
							strokeWidth={hoopThickness * 0.3}
							opacity={0.4}
						/>
						<circle
							cx={centerX}
							cy={size * 0.45 - hoopRadius}
							r={size * 0.03}
							fill={metalGradient.start}
							stroke={metalGradient.end}
							strokeWidth={1}
						/>
						{piece.design?.primaryGemstone && (
							<>
								{renderGemstone(centerX - hoopRadius * 0.85, size * 0.45, size * 0.035, undefined, undefined, false)}
								{renderGemstone(centerX, size * 0.45 + hoopRadius * 0.85, size * 0.04, undefined, undefined, false)}
								{renderGemstone(centerX + hoopRadius * 0.85, size * 0.45, size * 0.035, undefined, undefined, false)}
							</>
						)}
					</g>
				);

			case 'chandelier':
				return (
					<g filter={`url(#${shadowId})`} style={{ filter: getFinishFilter() }}>
						<path
							d={`M ${centerX - size * 0.04} ${topY}
								Q ${centerX} ${topY - size * 0.06}, ${centerX + size * 0.04} ${topY}`}
							fill="none"
							stroke={`url(#${gradientId})`}
							strokeWidth={3}
							strokeLinecap="round"
						/>
						<path
							d={`M ${centerX} ${topY} L ${centerX} ${topY + size * 0.08}`}
							stroke={`url(#${gradientId})`}
							strokeWidth={2}
						/>
						<ellipse
							cx={centerX}
							cy={topY + size * 0.12}
							rx={size * 0.08}
							ry={size * 0.04}
							fill={`url(#${gradientId})`}
							stroke={metalGradient.end}
							strokeWidth={1}
						/>
						<path
							d={`M ${centerX - size * 0.15} ${topY + size * 0.25}
								Q ${centerX} ${topY + size * 0.15} ${centerX + size * 0.15} ${topY + size * 0.25}`}
							fill="none"
							stroke={`url(#${gradientId})`}
							strokeWidth={2}
						/>
						{[-1, 0, 1].map((offset, i) => (
							<g key={i}>
								<line
									x1={centerX + offset * size * 0.15}
									y1={topY + size * 0.25}
									x2={centerX + offset * size * 0.15}
									y2={topY + size * 0.35 + Math.abs(offset) * size * 0.05}
									stroke={`url(#${gradientId})`}
									strokeWidth={1.5}
								/>
								<ellipse
									cx={centerX + offset * size * 0.15}
									cy={topY + size * 0.4 + Math.abs(offset) * size * 0.05}
									rx={size * 0.04}
									ry={size * 0.06}
									fill={`url(#${gradientId})`}
								/>
							</g>
						))}
						{[-0.5, 0.5].map((offset, i) => (
							<g key={`bottom-${i}`}>
								<line
									x1={centerX + offset * size * 0.2}
									y1={topY + size * 0.45}
									x2={centerX + offset * size * 0.2}
									y2={topY + size * 0.55}
									stroke={`url(#${gradientId})`}
									strokeWidth={1.5}
								/>
								<ellipse
									cx={centerX + offset * size * 0.2}
									cy={topY + size * 0.58}
									rx={size * 0.03}
									ry={size * 0.05}
									fill={`url(#${gradientId})`}
								/>
							</g>
						))}
						{piece.design?.primaryGemstone && (
							<>
								{renderGemstone(centerX, topY + size * 0.12, size * 0.025, undefined, undefined, false)}
								{renderGemstone(centerX, topY + size * 0.4, size * 0.02, undefined, undefined, false)}
								{renderGemstone(centerX - size * 0.15, topY + size * 0.45, size * 0.018, undefined, undefined, false)}
								{renderGemstone(centerX + size * 0.15, topY + size * 0.45, size * 0.018, undefined, undefined, false)}
							</>
						)}
					</g>
				);

			default: // drop
				return (
					<g filter={`url(#${shadowId})`} style={{ filter: getFinishFilter() }}>
						<path
							d={`M ${centerX - size * 0.06} ${topY}
								Q ${centerX} ${topY - size * 0.08}, ${centerX + size * 0.06} ${topY}`}
							fill="none"
							stroke={`url(#${gradientId})`}
							strokeWidth={3}
							strokeLinecap="round"
						/>
						<line
							x1={centerX}
							y1={topY}
							x2={centerX}
							y2={topY + size * 0.1}
							stroke={`url(#${gradientId})`}
							strokeWidth={2}
						/>
						<path
							d={`M ${centerX} ${topY + size * 0.1}
								C ${centerX - size * 0.15} ${topY + size * 0.2}
									${centerX - size * 0.12} ${topY + size * 0.45}
									${centerX} ${topY + size * 0.5}
								C ${centerX + size * 0.12} ${topY + size * 0.45}
									${centerX + size * 0.15} ${topY + size * 0.2}
									${centerX} ${topY + size * 0.1}`}
							fill={`url(#${gradientId})`}
							stroke={metalGradient.end}
							strokeWidth={1}
						/>
						<ellipse
							cx={centerX - size * 0.04}
							cy={topY + size * 0.25}
							rx={size * 0.03}
							ry={size * 0.06}
							fill="white"
							opacity={0.3}
						/>
						{piece.design?.primaryGemstone &&
							renderGemstone(centerX, topY + size * 0.32, size * 0.06)}
					</g>
				);
		}
	};

	const renderBracelet = () => {
		const centerX = size / 2;
		const centerY = size / 2;
		const rx = size * 0.4;
		const ry = size * 0.25;
		const strokeWidth = size * 0.06;

		const renderBraceletByStyle = () => {
			switch (braceletStyle) {
				case 'cuff':
					// Open cuff bracelet
					return (
						<g>
							<path
								d={`M ${centerX + rx * 0.3} ${centerY - ry * 0.8}
									A ${rx} ${ry} 0 1 0 ${centerX + rx * 0.3} ${centerY + ry * 0.8}`}
								fill="none"
								stroke={`url(#${gradientId})`}
								strokeWidth={strokeWidth * 1.5}
							/>
							{/* Decorated ends */}
							<circle
								cx={centerX + rx * 0.3}
								cy={centerY - ry * 0.8}
								r={strokeWidth * 0.8}
								fill={metalGradient.start}
								stroke={metalGradient.end}
								strokeWidth={1}
							/>
							<circle
								cx={centerX + rx * 0.3}
								cy={centerY + ry * 0.8}
								r={strokeWidth * 0.8}
								fill={metalGradient.start}
								stroke={metalGradient.end}
								strokeWidth={1}
							/>
							{piece.design?.primaryGemstone &&
								renderGemstone(centerX - rx, centerY, size * 0.04)}
						</g>
					);

				case 'bangle':
					return (
						<g>
							<ellipse
								cx={centerX}
								cy={centerY}
								rx={rx}
								ry={ry}
								fill="none"
								stroke={`url(#${gradientId})`}
								strokeWidth={strokeWidth * 1.2}
							/>
							{/* Decorative pattern */}
							{[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => {
								const rad = (angle * Math.PI) / 180;
								return (
									<rect
										key={angle}
										x={centerX + Math.cos(rad) * rx - 3}
										y={centerY + Math.sin(rad) * ry - 8}
										width={6}
										height={16}
										fill={metalGradient.end}
										opacity={0.4}
										transform={`rotate(${angle}, ${centerX + Math.cos(rad) * rx}, ${centerY + Math.sin(rad) * ry})`}
									/>
								);
							})}
							{piece.design?.primaryGemstone &&
								renderGemstone(centerX - rx, centerY, size * 0.035, undefined, undefined, false)}
						</g>
					);

				case 'tennis':
					return (
						<g>
							<ellipse
								cx={centerX}
								cy={centerY}
								rx={rx}
								ry={ry}
								fill="none"
								stroke={`url(#${gradientId})`}
								strokeWidth={strokeWidth * 0.6}
							/>
							{/* Gemstones around */}
							{piece.design?.primaryGemstone && Array.from({ length: 16 }, (_, i) => {
								const angle = (i / 16) * Math.PI * 2;
								return renderGemstone(
									centerX + Math.cos(angle) * rx,
									centerY + Math.sin(angle) * ry,
									size * 0.025,
									'round',
									'prong',
									false
								);
							})}
						</g>
					);

				case 'charm':
					return (
						<g>
							<ellipse
								cx={centerX}
								cy={centerY}
								rx={rx}
								ry={ry}
								fill="none"
								stroke={`url(#${gradientId})`}
								strokeWidth={strokeWidth * 0.7}
							/>
							{/* Charms */}
							{[0, 60, 120, 180, 240, 300].map((angleDeg, i) => {
								const angle = (angleDeg * Math.PI) / 180;
								const x = centerX + Math.cos(angle) * rx;
								const y = centerY + Math.sin(angle) * ry;
								const shapes = ['circle', 'rect', 'circle', 'rect', 'circle', 'rect'];
								return (
									<g key={i}>
										<line
											x1={x}
											y1={y}
											x2={x}
											y2={y + size * 0.06}
											stroke={`url(#${gradientId})`}
											strokeWidth={1.5}
										/>
										{shapes[i] === 'circle' ? (
											<circle
												cx={x}
												cy={y + size * 0.08}
												r={size * 0.025}
												fill={`url(#${gradientId})`}
											/>
										) : (
											<rect
												x={x - size * 0.02}
												y={y + size * 0.055}
												width={size * 0.04}
												height={size * 0.05}
												rx={2}
												fill={`url(#${gradientId})`}
											/>
										)}
									</g>
								);
							})}
						</g>
					);

				default: // chain
					return (
						<g>
							<ellipse
								cx={centerX}
								cy={centerY}
								rx={rx}
								ry={ry}
								fill="none"
								stroke={`url(#${gradientId})`}
								strokeWidth={strokeWidth}
							/>
							{/* Chain links */}
							{[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => {
								const rad = (angle * Math.PI) / 180;
								const x = centerX + Math.cos(rad) * rx;
								const y = centerY + Math.sin(rad) * ry;
								return (
									<line
										key={angle}
										x1={x - 4}
										y1={y}
										x2={x + 4}
										y2={y}
										stroke={metalGradient.end}
										strokeWidth={1.5}
										opacity={0.4}
										transform={`rotate(${angle}, ${x}, ${y})`}
									/>
								);
							})}
							{/* Clasp */}
							<rect
								x={centerX + rx - 15}
								y={centerY - 8}
								width={20}
								height={16}
								rx={3}
								fill={metalGradient.start}
								stroke={metalGradient.end}
								strokeWidth={1}
							/>
							{piece.design?.primaryGemstone &&
								renderGemstone(centerX + rx - 5, centerY, size * 0.02, undefined, undefined, false)}
						</g>
					);
			}
		};

		return (
			<g filter={`url(#${shadowId})`} style={{ filter: getFinishFilter() }}>
				{renderBraceletByStyle()}

				{/* 3D highlight */}
				{braceletStyle !== 'tennis' && braceletStyle !== 'charm' && (
					<path
						d={`M ${centerX - rx * 0.8} ${centerY - ry * 0.9}
							A ${rx} ${ry} 0 0 1 ${centerX + rx * 0.8} ${centerY - ry * 0.9}`}
						fill="none"
						stroke="white"
						strokeWidth={strokeWidth * 0.3}
						opacity={0.4}
					/>
				)}
			</g>
		);
	};

	const renderNecklace = () => {
		const centerX = size / 2;
		const topY = size * 0.12;
		const bottomY = size * 0.65;

		return (
			<g filter={`url(#${shadowId})`} style={{ filter: getFinishFilter() }}>
				{/* Chain - left side */}
				<path
					d={`M ${size * 0.1} ${topY}
						Q ${size * 0.15} ${size * 0.35} ${centerX - size * 0.1} ${bottomY - size * 0.05}`}
					fill="none"
					stroke={`url(#${gradientId})`}
					strokeWidth={3}
				/>
				{/* Chain - right side */}
				<path
					d={`M ${size * 0.9} ${topY}
						Q ${size * 0.85} ${size * 0.35} ${centerX + size * 0.1} ${bottomY - size * 0.05}`}
					fill="none"
					stroke={`url(#${gradientId})`}
					strokeWidth={3}
				/>

				{/* 3D highlight */}
				<path
					d={`M ${size * 0.12} ${topY + 5}
						Q ${size * 0.17} ${size * 0.3} ${centerX - size * 0.08} ${bottomY - size * 0.08}`}
					fill="none"
					stroke="white"
					strokeWidth={1}
					opacity={0.3}
				/>

				{/* Pendant base */}
				<ellipse
					cx={centerX}
					cy={bottomY}
					rx={size * 0.12}
					ry={size * 0.14}
					fill={`url(#${gradientId})`}
					stroke={metalGradient.end}
					strokeWidth={2}
				/>

				{/* Pendant 3D highlight */}
				<ellipse
					cx={centerX - size * 0.03}
					cy={bottomY - size * 0.04}
					rx={size * 0.04}
					ry={size * 0.03}
					fill="white"
					opacity={0.3}
				/>

				{/* Bail */}
				<path
					d={`M ${centerX - size * 0.03} ${bottomY - size * 0.14}
						Q ${centerX} ${bottomY - size * 0.18} ${centerX + size * 0.03} ${bottomY - size * 0.14}`}
					fill={metalGradient.start}
					stroke={metalGradient.end}
					strokeWidth={1}
				/>

				{/* Clasps */}
				<circle
					cx={size * 0.1}
					cy={topY}
					r={5}
					fill={metalGradient.start}
					stroke={metalGradient.end}
					strokeWidth={1}
				/>
				<circle
					cx={size * 0.9}
					cy={topY}
					r={5}
					fill={metalGradient.start}
					stroke={metalGradient.end}
					strokeWidth={1}
				/>

				{/* Gemstone on pendant */}
				{piece.design?.primaryGemstone &&
					renderGemstone(centerX, bottomY, size * 0.055)}
			</g>
		);
	};

	const renderPiece = () => {
		switch (piece.type) {
			case 'ring':
				return renderRing();
			case 'earring':
				return renderEarring();
			case 'bracelet':
				return renderBracelet();
			case 'necklace':
				return renderNecklace();
			default:
				return (
					<circle
						cx={size / 2}
						cy={size / 2}
						r={size * 0.2}
						fill={`url(#${gradientId})`}
						filter={`url(#${shadowId})`}
					/>
				);
		}
	};

	return (
		<svg
			viewBox={`0 0 ${size} ${size}`}
			className={styles.renderer}
			style={{ width: '100%', height: '100%' }}
		>
			{renderDefs()}
			{renderPiece()}
		</svg>
	);
};

export default PieceRenderer2D;
