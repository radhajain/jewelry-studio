import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store';
import { nanoid } from 'nanoid';
import {
	MetalColor,
	PieceType,
	PieceDesign,
	BandStyle,
	ChainStyle,
} from '../types';
import { PRESET_GEMSTONES, getGemstoneById } from '../data/gemstones';
import Button from '../components/common/Button';
import PieceRenderer from '../components/pieces/PieceRenderer';
import toast from 'react-hot-toast';
import styles from './DesignPiece.module.css';

const DesignPiece: React.FC = () => {
	const { collectionId, pieceType } = useParams<{
		collectionId?: string;
		pieceType: string;
	}>();
	const navigate = useNavigate();

	const collection = useStore((state) =>
		collectionId ? state.collections.find((c) => c.id === collectionId) : null
	);
	const updateCollection = useStore((state) => state.updateCollection);
	const createStandalonePiece = useStore(
		(state) => state.createStandalonePiece
	);
	const standalonePieces = useStore((state) => state.standalonePieces);
	const collections = useStore((state) => state.collections);

	const isStandalone = !collectionId;

	// Auto-generate piece name based on type and existing pieces
	const generatePieceName = (): string => {
		const type = pieceType as PieceType;
		const typeName = type.charAt(0).toUpperCase() + type.slice(1);

		let existingPiecesOfType: number;
		if (isStandalone) {
			existingPiecesOfType = standalonePieces.filter(
				(p) => p.type === type
			).length;
		} else {
			existingPiecesOfType = collection?.pieces.filter(
				(p) => p.type === type
			).length || 0;
		}

		return `${typeName} ${existingPiecesOfType + 1}`;
	};

	const pieceName = generatePieceName();

	const [design, setDesign] = useState<Partial<PieceDesign>>({
		metal: collection?.colors.metals[0] || 'yellow-gold',
		finish: 'polished',
	});

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

	const handleSave = () => {
		const newPiece = {
			collectionId: collection?.id,
			name: pieceName,
			type: pieceType as PieceType,
			design: design as PieceDesign,
			render: {
				type: '2D' as const,
				data: {
					layers: [],
					viewAngle: 'top' as const,
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

				{/* Header */}
				<div className={styles.header}>
					<h1 className={styles.title}>{pieceName}</h1>
					<p className={styles.subtitle}>
						{isStandalone
							? `Create a new standalone ${pieceType}`
							: `Create a new ${pieceType} for your collection`}
					</p>
				</div>

				{/* Layout: Canvas + Controls */}
				<div className={styles.layout}>
					{/* Left: Canvas */}
					<div className={styles.canvas}>
						<div className={styles.canvasInner}>
							<PieceRenderer
								piece={{
									name: pieceName || 'Untitled',
									type: pieceType as PieceType,
									design: design as PieceDesign,
								}}
								size={500}
							/>
						</div>
					</div>

					{/* Right: Design Controls */}
					<div className={styles.controls}>
						{/* Metal Selection */}
						<div className={styles.section}>
							<h3 className={styles.sectionTitle}>Metal</h3>
							<p className={styles.sectionDescription}>
								{isStandalone
									? 'Choose the metal for your piece'
									: 'Choose from the metals available in your collection'}
							</p>
							<div className={styles.optionGrid}>
								{(
									collection?.colors.metals ||
									([
										'yellow-gold',
										'white-gold',
										'rose-gold',
										'platinum',
										'silver',
									] as MetalColor[])
								).map((metal) => (
									<button
										key={metal}
										className={`${styles.option} ${
											design.metal === metal ? styles.active : ''
										}`}
										onClick={() => handleMetalChange(metal)}
									>
										<div className={styles.optionLabel}>
											{metal.replace('-', ' ')}
										</div>
									</button>
								))}
							</div>
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
							<h3 className={styles.sectionTitle}>Gemstone</h3>
							<p className={styles.sectionDescription}>
								{isStandalone
									? 'Add gemstones to your piece'
									: 'Add gemstones from your collection palette'}
							</p>
							<div className={styles.optionGrid}>
								<button
									className={`${styles.option} ${
										!design.primaryGemstone ? styles.active : ''
									}`}
									onClick={() => handleGemstoneChange(null)}
								>
									<div className={styles.optionLabel}>None</div>
								</button>
								{(isStandalone
									? PRESET_GEMSTONES
									: ((collection?.gemstoneIds || [])
											.map((id) => getGemstoneById(id))
											.filter(Boolean) as typeof PRESET_GEMSTONES)
								).map((gemstone) => {
									return (
										<button
											key={gemstone.id}
											className={`${styles.option} ${
												design.primaryGemstone?.gemstoneId === gemstone.id
													? styles.active
													: ''
											}`}
											onClick={() => handleGemstoneChange(gemstone.id)}
										>
											<div className={styles.optionLabel}>
												<img
													src={gemstone.imageUrl}
													alt={gemstone.name}
													className={styles.gemstoneImage}
												/>
												{gemstone.name}
											</div>
										</button>
									);
								})}
							</div>
							{!isStandalone &&
								(!collection?.gemstoneIds ||
									collection.gemstoneIds.length === 0) && (
									<div
										style={{
											textAlign: 'center',
											padding: 'var(--space-lg)',
											color: 'var(--color-text-tertiary)',
											fontSize: '13px',
										}}
									>
										<p>No gemstones defined in this collection</p>
									</div>
								)}
						</div>

						{/* Band Details for Rings */}
						{pieceType === 'ring' && (
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
						)}

						{/* Chain Details for Necklaces and Bracelets */}
						{(pieceType === 'necklace' || pieceType === 'bracelet') && (
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
