import React, { useState, useEffect, Suspense, useMemo } from 'react';
import {
	useParams,
	useNavigate,
	Link,
	useSearchParams,
} from 'react-router-dom';
import { useStore } from '../store';
import { nanoid } from 'nanoid';
import {
	PieceType,
	PieceDesign,
	BandStyle,
	ChainStyle,
	SettingStyle,
	GemstoneShape,
	BraceletStyle,
} from '../types';
import { GEMSTONES, getGemstoneById } from '../data/gemstones';
import Button from '../components/common/Button';
import PieceRenderer3D from '../components/pieces/PieceRenderer3D';
import PieceRenderer2D from '../components/pieces/PieceRenderer2D';
import { MetalSelector } from '../components/common/MetalSelector';
import { GemstoneSelector } from '../components/common/GemstoneSelector';
import toast from 'react-hot-toast';
import styles from './DesignPiece.module.css';
import { MetalColor, MetalColors } from '../data/metals';
import { PieceSuggestion } from '../utils/anthropic';

type EarringStyle = 'stud' | 'hoop' | 'drop' | 'chandelier';
type BandThickness = 'thin' | 'medium' | 'thick';

const SETTING_STYLES: {
	value: SettingStyle;
	label: string;
	description: string;
}[] = [
	{ value: 'prong', label: 'Prong', description: 'Metal claws hold the stone' },
	{
		value: 'bezel',
		label: 'Bezel',
		description: 'Metal rim surrounds the stone',
	},
	{
		value: 'pave',
		label: 'Pavé',
		description: 'Small stones set closely together',
	},
	{
		value: 'channel',
		label: 'Channel',
		description: 'Stones set between metal rails',
	},
	{ value: 'tension', label: 'Tension', description: 'Stone held by pressure' },
	{
		value: 'flush',
		label: 'Flush',
		description: 'Stone sits level with metal',
	},
];

const GEMSTONE_SHAPES: { value: GemstoneShape; label: string }[] = [
	{ value: 'round', label: 'Round' },
	{ value: 'oval', label: 'Oval' },
	{ value: 'princess', label: 'Princess' },
	{ value: 'emerald', label: 'Emerald' },
	{ value: 'cushion', label: 'Cushion' },
	{ value: 'pear', label: 'Pear' },
	{ value: 'marquise', label: 'Marquise' },
	{ value: 'heart', label: 'Heart' },
];

const BRACELET_STYLES: { value: BraceletStyle; label: string }[] = [
	{ value: 'chain', label: 'Chain' },
	{ value: 'bangle', label: 'Bangle' },
	{ value: 'cuff', label: 'Cuff' },
	{ value: 'tennis', label: 'Tennis' },
	{ value: 'charm', label: 'Charm' },
];

const DesignPiece: React.FC = () => {
	const { collectionId, pieceType } = useParams<{
		collectionId?: string;
		pieceType: string;
	}>();
	const navigate = useNavigate();
	const [searchParams] = useSearchParams();

	// Parse suggestion from URL if present
	const suggestion = useMemo((): PieceSuggestion | null => {
		const suggestionParam = searchParams.get('suggestion');
		if (suggestionParam) {
			try {
				return JSON.parse(suggestionParam) as PieceSuggestion;
			} catch (e) {
				console.error('Failed to parse suggestion:', e);
				return null;
			}
		}
		return null;
	}, [searchParams]);

	// Scroll to top when component mounts
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const collection = useStore((state) =>
		collectionId ? state.collections.find((c) => c.id === collectionId) : null
	);
	const updateCollection = useStore((state) => state.updateCollection);
	const createStandalonePiece = useStore(
		(state) => state.createStandalonePiece
	);
	const standalonePieces = useStore((state) => state.standalonePieces);

	const isStandalone = !collectionId;

	// Use suggestion name or auto-generate piece name
	const pieceName = useMemo((): string => {
		if (suggestion?.name) {
			return suggestion.name;
		}

		const type = pieceType as PieceType;
		const typeName = type.charAt(0).toUpperCase() + type.slice(1);

		let existingPiecesOfType: number;
		if (isStandalone) {
			existingPiecesOfType = standalonePieces.filter(
				(p) => p.type === type
			).length;
		} else {
			existingPiecesOfType =
				collection?.pieces.filter((p) => p.type === type).length || 0;
		}

		return `${typeName} ${existingPiecesOfType + 1}`;
	}, [suggestion, pieceType, isStandalone, standalonePieces, collection]);

	// Initialize design from suggestion or defaults
	const getInitialDesign = (): Partial<PieceDesign> => {
		if (suggestion) {
			// Find gemstone ID by name if provided
			let gemstoneId: string | undefined;
			if (suggestion.gemstoneId) {
				const gemstone = GEMSTONES.find(
					(g) =>
						g.id === suggestion.gemstoneId ||
						g.name.toLowerCase() === suggestion.gemstoneId?.toLowerCase()
				);
				gemstoneId = gemstone?.id;
			}

			return {
				metal:
					(suggestion.metal as MetalColor) ||
					collection?.colors.metals[0] ||
					'yellow-gold',
				finish:
					(suggestion.finish as
						| 'polished'
						| 'matte'
						| 'hammered'
						| 'brushed') || 'polished',
				primaryGemstone: gemstoneId
					? {
							gemstoneId,
							carats: 1.0,
							position: 'center',
							setting: (suggestion.setting || undefined) as
								| SettingStyle
								| undefined,
							shapeOverride: (suggestion.gemstoneShape || undefined) as
								| GemstoneShape
								| undefined,
					  }
					: undefined,
				bandStyle: (suggestion.bandStyle || undefined) as BandStyle | undefined,
				bandThickness: (suggestion.bandThickness || undefined) as
					| BandThickness
					| undefined,
				earringStyle: (suggestion.earringStyle || undefined) as
					| EarringStyle
					| undefined,
				braceletStyle: (suggestion.braceletStyle || undefined) as
					| BraceletStyle
					| undefined,
				chainStyle: (suggestion.chainStyle || undefined) as
					| ChainStyle
					| undefined,
				length: suggestion.length || undefined,
			};
		}

		return {
			metal: collection?.colors.metals[0] || 'yellow-gold',
			finish: 'polished',
		};
	};

	const [design, setDesign] = useState<Partial<PieceDesign>>(getInitialDesign);

	const [viewMode, setViewMode] = useState<'2D' | '3D'>('3D');

	if (collectionId && !collection) {
		return (
			<div className={styles.page}>
				<div className={styles.container}>
					<div className={styles.header}>
						<h1>Collection Not Found</h1>
						<Button onClick={() => navigate('/')}>Back to Collections</Button>
					</div>
				</div>
			</div>
		);
	}

	const handleMetalChange = (metal: MetalColor) => {
		setDesign({ ...design, metal });
	};

	const handleFinishChange = (
		finish: 'polished' | 'matte' | 'hammered' | 'brushed'
	) => {
		setDesign({ ...design, finish });
	};

	const handleGemstoneChange = (gemstoneId: string | null) => {
		if (gemstoneId) {
			setDesign({
				...design,
				primaryGemstone: {
					gemstoneId,
					carats: 1.0,
					position: 'center' as const,
				},
			});
		} else {
			const { primaryGemstone, ...rest } = design;
			setDesign(rest);
		}
	};

	const handleBandStyleChange = (bandStyle: BandStyle) => {
		setDesign({ ...design, bandStyle });
	};

	const handleChainStyleChange = (chainStyle: ChainStyle) => {
		setDesign({ ...design, chainStyle });
	};

	const handleLengthChange = (length: number) => {
		setDesign({ ...design, length });
	};

	const handleEarringStyleChange = (earringStyle: EarringStyle) => {
		setDesign({ ...design, earringStyle });
	};

	const handleBandThicknessChange = (bandThickness: BandThickness) => {
		setDesign({ ...design, bandThickness });
	};

	const handleSettingStyleChange = (setting: SettingStyle) => {
		if (design.primaryGemstone) {
			setDesign({
				...design,
				primaryGemstone: {
					...design.primaryGemstone,
					setting,
				},
			});
		}
	};

	const handleGemstoneShapeChange = (shapeOverride: GemstoneShape) => {
		if (design.primaryGemstone) {
			setDesign({
				...design,
				primaryGemstone: {
					...design.primaryGemstone,
					shapeOverride,
				},
			});
		}
	};

	const handleBraceletStyleChange = (braceletStyle: BraceletStyle) => {
		setDesign({ ...design, braceletStyle });
	};

	const handleSave = () => {
		const newPiece = {
			collectionId: collection?.id,
			name: pieceName,
			type: pieceType as PieceType,
			design: design as PieceDesign,
			render: {
				type: '3D' as const,
				data: {
					camera: { x: 0, y: 0, z: 2.5 },
					lights: [],
				},
			},
			isComplete: false,
			completionPercentage: 50,
		};

		if (isStandalone) {
			createStandalonePiece(newPiece);
			toast.success(`${pieceName} saved successfully!`);
			navigate('/pieces');
		} else {
			const updatedPieces = [
				...collection!.pieces,
				{
					...newPiece,
					id: nanoid(),
					createdAt: new Date().toISOString(),
					updatedAt: new Date().toISOString(),
				},
			];
			updateCollection(collection!.id, { pieces: updatedPieces });
			toast.success(`${pieceName} saved successfully!`);
			navigate(`/collections/${collectionId}`);
		}
	};

	return (
		<div className={styles.page}>
			<div className={styles.container}>
				<div className={styles.slug}>
					{isStandalone ? (
						<>
							<Link
								to="/pieces"
								style={{ color: 'inherit', textDecoration: 'none' }}
							>
								Pieces
							</Link>{' '}
							/ Design {pieceType}
						</>
					) : (
						<>
							<Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
								Collections
							</Link>{' '}
							/{' '}
							<Link
								to={`/collections/${collectionId}`}
								style={{ color: 'inherit', textDecoration: 'none' }}
							>
								{collection!.name}
							</Link>{' '}
							/ Design {pieceType}
						</>
					)}
				</div>

				{/* Suggestion banner */}
				{suggestion && (
					<div className={styles.suggestionBanner}>
						<div className={styles.suggestionBadge}>
							<svg
								width="14"
								height="14"
								viewBox="0 0 24 24"
								fill="none"
								stroke="currentColor"
								strokeWidth="2"
							>
								<path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
							</svg>
							Suggested
						</div>
						<div className={styles.suggestionInfo}>
							<span className={styles.suggestionName}>{suggestion.name}</span>
							<span className={styles.suggestionDescription}>
								{suggestion.description}
							</span>
						</div>
					</div>
				)}

				{/* Layout: Canvas + Controls */}
				<div className={styles.layout}>
					{/* Left: Canvas */}
					<div className={styles.canvas}>
						<div className={styles.canvasHeader}>
							<div className={styles.viewToggle}>
								<Button
									variant={viewMode === '2D' ? 'primary' : 'secondary'}
									size="small"
									onClick={() => setViewMode('2D')}
								>
									2D
								</Button>
								<Button
									variant={viewMode === '3D' ? 'primary' : 'secondary'}
									size="small"
									onClick={() => setViewMode('3D')}
								>
									3D
								</Button>
							</div>
						</div>
						<div className={styles.canvasInner}>
							<Suspense
								fallback={
									<div className={styles.loading}>
										Loading {viewMode} view...
									</div>
								}
							>
								{viewMode === '3D' ? (
									<PieceRenderer3D
										piece={{
											name: pieceName || 'Untitled',
											type: pieceType as PieceType,
											design: design as PieceDesign,
										}}
										size={500}
									/>
								) : (
									<PieceRenderer2D
										piece={{
											name: pieceName || 'Untitled',
											type: pieceType as PieceType,
											design: design as PieceDesign,
										}}
										size={500}
									/>
								)}
							</Suspense>
						</div>
					</div>

					{/* Right: Design Controls */}
					<div className={styles.controls}>
						{/* Metal Selection */}
						<div className={styles.section}>
							<MetalSelector
								availableMetals={collection?.colors.metals || [...MetalColors]}
								selectedMetals={design.metal || 'yellow-gold'}
								onMetalChange={handleMetalChange}
								label="Metal"
								description={
									isStandalone
										? 'Choose the metal for your piece'
										: 'Choose from the metals available in your collection'
								}
							/>
						</div>

						{/* Finish */}
						<div className={styles.section}>
							<h3 className={styles.sectionTitle}>Finish</h3>
							<p className={styles.sectionDescription}>
								Select the surface finish for your piece
							</p>
							<div className={styles.optionGrid}>
								{['polished', 'matte', 'hammered', 'brushed'].map((finish) => (
									<button
										key={finish}
										className={`${styles.option} ${
											design.finish === finish ? styles.active : ''
										}`}
										onClick={() => handleFinishChange(finish as any)}
									>
										<div className={styles.optionLabel}>{finish}</div>
									</button>
								))}
							</div>
						</div>

						{/* Gemstone */}
						<div className={styles.section}>
							<GemstoneSelector
								availableGemstones={
									isStandalone
										? GEMSTONES
										: ((collection?.gemstoneIds || [])
												.map((id) => getGemstoneById(id))
												.filter(Boolean) as typeof GEMSTONES)
								}
								selectedGemstones={design.primaryGemstone?.gemstoneId || ''}
								onGemstoneChange={handleGemstoneChange}
								label="Gemstone"
								description={
									isStandalone
										? 'Add gemstones to your piece'
										: 'Add gemstones from your collection palette'
								}
								showNoneOption={true}
								emptyMessage={
									!isStandalone
										? 'No gemstones defined in this collection'
										: undefined
								}
							/>
						</div>

						{/* Gemstone Shape - only show if gemstone is selected */}
						{design.primaryGemstone && (
							<div className={styles.section}>
								<h3 className={styles.sectionTitle}>Gemstone Shape</h3>
								<p className={styles.sectionDescription}>
									Override the default shape of your gemstone
								</p>
								<div className={styles.optionGrid}>
									{GEMSTONE_SHAPES.map(({ value, label }) => (
										<button
											key={value}
											className={`${styles.option} ${
												(design.primaryGemstone?.shapeOverride ||
													getGemstoneById(
														design.primaryGemstone?.gemstoneId || ''
													)?.shape) === value
													? styles.active
													: ''
											}`}
											onClick={() => handleGemstoneShapeChange(value)}
										>
											<div className={styles.optionLabel}>{label}</div>
										</button>
									))}
								</div>
							</div>
						)}

						{/* Gemstone Setting - only show if gemstone is selected */}
						{design.primaryGemstone && (
							<div className={styles.section}>
								<h3 className={styles.sectionTitle}>Gemstone Setting</h3>
								<p className={styles.sectionDescription}>
									Choose how the gemstone is mounted
								</p>
								<div className={styles.optionGrid}>
									{SETTING_STYLES.map(({ value, label }) => (
										<button
											key={value}
											className={`${styles.option} ${
												(design.primaryGemstone?.setting || 'prong') === value
													? styles.active
													: ''
											}`}
											onClick={() => handleSettingStyleChange(value)}
										>
											<div className={styles.optionLabel}>{label}</div>
										</button>
									))}
								</div>
							</div>
						)}

						{/* Band Details for Rings */}
						{pieceType === 'ring' && (
							<>
								<div className={styles.section}>
									<h3 className={styles.sectionTitle}>Band Thickness</h3>
									<p className={styles.sectionDescription}>
										Choose the thickness of the ring band
									</p>
									<div className={styles.optionGrid}>
										{(['thin', 'medium', 'thick'] as BandThickness[]).map(
											(thickness) => (
												<button
													key={thickness}
													className={`${styles.option} ${
														design.bandThickness === thickness
															? styles.active
															: ''
													}`}
													onClick={() => handleBandThicknessChange(thickness)}
												>
													<div className={styles.optionLabel}>{thickness}</div>
												</button>
											)
										)}
									</div>
								</div>

								<div className={styles.section}>
									<h3 className={styles.sectionTitle}>Band Style</h3>
									<p className={styles.sectionDescription}>
										Choose the style of the ring band
									</p>
									<div className={styles.optionGrid}>
										{(
											[
												'plain',
												'twisted',
												'braided',
												'textured',
												'split',
											] as BandStyle[]
										).map((style) => (
											<button
												key={style}
												className={`${styles.option} ${
													design.bandStyle === style ? styles.active : ''
												}`}
												onClick={() => handleBandStyleChange(style)}
											>
												<div className={styles.optionLabel}>{style}</div>
											</button>
										))}
									</div>
								</div>
							</>
						)}

						{/* Earring Style Selection */}
						{pieceType === 'earring' && (
							<div className={styles.section}>
								<h3 className={styles.sectionTitle}>Earring Style</h3>
								<p className={styles.sectionDescription}>
									Choose the style of your earrings
								</p>
								<div className={styles.optionGrid}>
									{(
										['stud', 'hoop', 'drop', 'chandelier'] as EarringStyle[]
									).map((style) => (
										<button
											key={style}
											className={`${styles.option} ${
												design.earringStyle === style ? styles.active : ''
											}`}
											onClick={() => handleEarringStyleChange(style)}
										>
											<div className={styles.optionLabel}>{style}</div>
										</button>
									))}
								</div>
							</div>
						)}

						{/* Bracelet Style */}
						{pieceType === 'bracelet' && (
							<div className={styles.section}>
								<h3 className={styles.sectionTitle}>Bracelet Style</h3>
								<p className={styles.sectionDescription}>
									Choose the type of bracelet
								</p>
								<div className={styles.optionGrid}>
									{BRACELET_STYLES.map(({ value, label }) => (
										<button
											key={value}
											className={`${styles.option} ${
												(design.braceletStyle || 'chain') === value
													? styles.active
													: ''
											}`}
											onClick={() => handleBraceletStyleChange(value)}
										>
											<div className={styles.optionLabel}>{label}</div>
										</button>
									))}
								</div>
							</div>
						)}

						{/* Chain Details for Necklaces and Chain Bracelets */}
						{(pieceType === 'necklace' ||
							(pieceType === 'bracelet' &&
								design.braceletStyle === 'chain')) && (
							<>
								<div className={styles.section}>
									<h3 className={styles.sectionTitle}>Chain Style</h3>
									<p className={styles.sectionDescription}>
										Choose the style of the chain
									</p>
									<div className={styles.optionGrid}>
										{(
											[
												'cable',
												'rope',
												'box',
												'snake',
												'figaro',
												'wheat',
											] as ChainStyle[]
										).map((style) => (
											<button
												key={style}
												className={`${styles.option} ${
													design.chainStyle === style ? styles.active : ''
												}`}
												onClick={() => handleChainStyleChange(style)}
											>
												<div className={styles.optionLabel}>{style}</div>
											</button>
										))}
									</div>
								</div>

								<div className={styles.section}>
									<h3 className={styles.sectionTitle}>
										{pieceType === 'necklace'
											? 'Chain Length'
											: 'Bracelet Length'}
									</h3>
									<p className={styles.sectionDescription}>
										{pieceType === 'necklace'
											? 'Standard lengths: 16" (choker), 18" (princess), 20" (matinee), 24" (opera)'
											: 'Standard lengths: 6.5", 7", 7.5", 8"'}
									</p>
									<div className={styles.optionGrid}>
										{pieceType === 'necklace'
											? [16, 18, 20, 24, 30].map((length) => (
													<button
														key={length}
														className={`${styles.option} ${
															design.length === length ? styles.active : ''
														}`}
														onClick={() => handleLengthChange(length)}
													>
														<div className={styles.optionLabel}>{length}"</div>
													</button>
											  ))
											: [6.5, 7, 7.5, 8].map((length) => (
													<button
														key={length}
														className={`${styles.option} ${
															design.length === length ? styles.active : ''
														}`}
														onClick={() => handleLengthChange(length)}
													>
														<div className={styles.optionLabel}>{length}"</div>
													</button>
											  ))}
									</div>
								</div>
							</>
						)}
					</div>
				</div>

				{/* Actions */}
				<div className={styles.actions}>
					<Button
						variant="secondary"
						onClick={() =>
							navigate(
								isStandalone ? '/pieces' : `/collections/${collectionId}`
							)
						}
					>
						Cancel
					</Button>
					<Button variant="primary" onClick={handleSave}>
						Save Piece
					</Button>
				</div>
			</div>
		</div>
	);
};

export default DesignPiece;
