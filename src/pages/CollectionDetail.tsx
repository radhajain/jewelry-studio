import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '../components/common/Button';
import PieceCard from '../components/pieces/PieceCard';
import { GEMSTONES } from '../data/gemstones';
import { MetalColor, metals } from '../data/metals';
import { useStore } from '../store';
import {
	BandStyle,
	BraceletStyle,
	ChainStyle,
	GemstoneShape,
	JewelryPiece,
	PieceType,
	SettingStyle,
} from '../types/piece';
import { PieceSuggestion, suggestPieces } from '../utils/anthropic';
import { mapFilter } from '../utils/arrayUtils';
import styles from './CollectionDetail.module.css';

type FinishType = 'polished' | 'matte' | 'hammered' | 'brushed';
type EarringStyle = 'stud' | 'hoop' | 'drop' | 'chandelier';
type BandThickness = 'thin' | 'medium' | 'thick';

type ImagePosition = { top: number; left: number };

type GemImage = {
	type: 'gem';
	imageUrl: string;
	position: ImagePosition;
};

type MetalImage = {
	type: 'metal';
	hexStart: string;
	hexEnd: string;
	position: ImagePosition;
};

const CollectionDetail: React.FC = () => {
	const { collectionId } = useParams<{ collectionId: string }>();
	const navigate = useNavigate();

	const collection = useStore((state) =>
		state.collections.find((c) => c.id === collectionId)
	);

	const [suggestedPieces, setSuggestedPieces] = useState<PieceSuggestion[]>([]);
	const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
	const [suggestionsError, setSuggestionsError] = useState<string | null>(null);

	// Fetch suggestions when collection loads
	useEffect(() => {
		if (!collection) return;

		const fetchSuggestions = async () => {
			setIsLoadingSuggestions(true);
			setSuggestionsError(null);

			try {
				const gemstoneNames = collection.gemstoneIds
					.map((id) => GEMSTONES.find((g) => g.id === id)?.name)
					.filter(Boolean) as string[];

				const result = await suggestPieces(
					collection.name,
					collection.description,
					collection.theme.mood,
					collection.colors.metals,
					gemstoneNames
				);

				setSuggestedPieces(result.pieces);
			} catch (error) {
				console.error('Failed to fetch piece suggestions:', error);
				setSuggestionsError('Failed to load suggestions');
			} finally {
				setIsLoadingSuggestions(false);
			}
		};

		fetchSuggestions();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [collection?.id]);

	const materialImages: (GemImage | MetalImage)[] = React.useMemo(() => {
		if (!collection) return [];
		const gemstoneImages: GemImage[] = mapFilter(
			collection.gemstoneIds,
			(gemstoneId) => {
				const gemstone = GEMSTONES.find((gem) => gem.id === gemstoneId);
				return gemstone
					? {
							type: 'gem',
							imageUrl: gemstone.imageUrl,
							position: {
								top: 10 + Math.random() * 70,
								left: 10 + Math.random() * 70,
							},
					  }
					: null;
			}
		);

		const metalImages: MetalImage[] = mapFilter(
			collection.colors.metals,
			(metalId) => {
				const metal = metals.find((m) => m.id === metalId);
				return metal
					? {
							type: 'metal',
							hexStart: metal.hexStart,
							hexEnd: metal.hexEnd,
							position: {
								top: 10 + Math.random() * 70,
								left: 10 + Math.random() * 70,
							},
					  }
					: null;
			}
		);

		return [...metalImages, ...gemstoneImages];
	}, [collection]);

	// Calculate grid columns based on image count
	const gridCols = React.useMemo(() => {
		if (!collection) return 2;
		const count = collection.moodboard.length;
		if (count <= 2) return 2;
		if (count <= 6) return 3;
		return 4;
	}, [collection]);

	if (!collection) {
		return (
			<div className={styles.page}>
				<div className={styles.container}>
					<div className={styles.header}>
						<h1 className={styles.title}>Collection Not Found</h1>
						<Button onClick={() => navigate('/')}>Back to Collections</Button>
					</div>
				</div>
			</div>
		);
	}

	const handleNewPiece = (type: string) => {
		navigate(`/collections/${collectionId}/design/${type}`);
	};

	const handleSuggestedPieceClick = (suggestion: PieceSuggestion) => {
		// Navigate to design page with suggestion data in query params
		const params = new URLSearchParams();
		params.set('suggestion', JSON.stringify(suggestion));
		navigate(
			`/collections/${collectionId}/design/${
				suggestion.type
			}?${params.toString()}`
		);
	};

	return (
		<div className={styles.page}>
			<div className={styles.container}>
				<div className={styles.header}>
					<div className={styles.slug}>
						<Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
							Collections
						</Link>{' '}
						/ {collection.name}
					</div>
					<div className={styles.actions}>
						<Button
							variant="secondary"
							onClick={() => navigate(`/collections/${collectionId}/edit`)}
							size="small"
						>
							Edit Collection
						</Button>
					</div>
				</div>

				<div className={styles.moodboardContainer}>
					<div className={styles.infoCard}>
						<div className={styles.collectionName}>{collection.name}</div>
						<p className={styles.description}>{collection.description}</p>

						{/* Metadata */}
						<div className={styles.metadataSection}>
							<div className={styles.metadataItem}>
								<span className={styles.metadataLabel}>Created:</span>{' '}
								{new Date(collection.createdAt).toLocaleDateString('en-US', {
									year: 'numeric',
									month: 'short',
									day: 'numeric',
								})}
							</div>
							<div className={styles.metadataItem}>
								<span className={styles.metadataLabel}>Last Updated:</span>{' '}
								{new Date(collection.updatedAt).toLocaleDateString('en-US', {
									year: 'numeric',
									month: 'short',
									day: 'numeric',
								})}
							</div>
							<div className={styles.metadataItem}>
								<span className={styles.metadataLabel}>Pieces:</span>{' '}
								{collection.pieces.length}
							</div>
						</div>

						{collection.theme.mood.length > 0 && (
							<div className={styles.moodSection}>
								<div className={styles.label}>Mood</div>
								<div className={styles.moods}>
									{collection.theme.mood.map((mood) => (
										<span key={mood} className={styles.mood}>
											{mood}
										</span>
									))}
								</div>
							</div>
						)}

						<div className={styles.materialsSection}>
							<div className={styles.label}>Materials</div>
							<div className={styles.materials}>
								{collection.colors.metals.map((metalId) => {
									const metal = metals.find((m) => m.id === metalId);
									return metal ? (
										<div key={metalId} className={styles.material}>
											<MetalSwatch
												hexStart={metal.hexStart}
												hexEnd={metal.hexEnd}
											/>
											<div className={styles.materialLabel}>
												{metal.name.replace('-', ' ')}
											</div>
										</div>
									) : null;
								})}
								{collection.gemstoneIds.map((gemstoneId) => {
									const gemstone = GEMSTONES.find(
										(gem) => gem.id === gemstoneId
									);
									return gemstone ? (
										<div key={gemstoneId} className={styles.material}>
											<img
												src={gemstone.imageUrl}
												alt={gemstone.name}
												className={styles.gemstoneIcon}
											/>
											<div className={styles.materialLabel}>
												{gemstone.name}
											</div>
										</div>
									) : null;
								})}
							</div>
						</div>
					</div>

					{/* Moodboard - Grid Layout */}
					<div className={styles.moodboard} data-cols={gridCols}>
						{/* Moodboard images */}
						{collection.moodboard.map((image) => (
							<div key={image.id} className={styles.moodboardImage}>
								<img src={image.url} alt={image.description || 'Moodboard'} />
							</div>
						))}
						{/* Material images scattered randomly over the moodboard */}
						{materialImages.map((material, index) => (
							<div
								key={`material-${index}`}
								className={styles.moodboardMaterialImage}
								style={{
									top: `${materialImages[index]?.position?.top || 50}%`,
									left: `${materialImages[index]?.position?.left || 50}%`,
									transform: 'translate(-50%, -50%)',
								}}
							>
								{material.type === 'metal' ? (
									<MetalSwatch
										hexStart={material.hexStart}
										hexEnd={material.hexEnd}
										size={75}
									/>
								) : (
									<img src={material.imageUrl} alt="Gemstone" />
								)}
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Pieces */}
			<div className={styles.section}>
				<div className={styles.sectionHeader}>
					<h2 className={styles.sectionTitle}>Pieces</h2>
					<div className={styles.pieceActions}>
						<Button variant="secondary" onClick={() => handleNewPiece('ring')}>
							Design Ring
						</Button>
						<Button
							variant="secondary"
							onClick={() => handleNewPiece('earring')}
						>
							Design Earring
						</Button>
						<Button
							variant="secondary"
							onClick={() => handleNewPiece('bracelet')}
						>
							Design Bracelet
						</Button>
						<Button
							variant="secondary"
							onClick={() => handleNewPiece('necklace')}
						>
							Design Necklace
						</Button>
					</div>
				</div>

				<div className={styles.pieces}>
					{/* Existing pieces */}
					{collection.pieces.map((piece) => (
						<PieceCard
							key={piece.id}
							piece={piece}
							onClick={() =>
								navigate(
									`/collections/${collectionId}/design/${piece.type}?edit=${piece.id}`
								)
							}
						/>
					))}

					{/* Suggested pieces from LLM */}
					{isLoadingSuggestions && (
						<>
							{[1, 2, 3, 4].map((i) => (
								<div key={`loading-${i}`} className={styles.loadingPiece}>
									<div className={styles.loadingPieceImage}>
										<div className={styles.loadingSpinner} />
									</div>
									<div className={styles.loadingPieceContent}>
										<div className={styles.loadingText}>
											Generating suggestion...
										</div>
									</div>
								</div>
							))}
						</>
					)}

					{!isLoadingSuggestions &&
						!suggestionsError &&
						suggestedPieces.map((suggestion, index) => (
							<PieceCard
								key={`suggested-${suggestion.type}-${index}`}
								piece={suggestionToJewelryPiece(suggestion, index)}
								onClick={() => handleSuggestedPieceClick(suggestion)}
								suggested
								description={suggestion.description}
							/>
						))}

					{suggestionsError && (
						<div className={styles.errorMessage}>{suggestionsError}</div>
					)}

					{/* New piece skeleton */}
					<div
						className={styles.skeletonPiece}
						onClick={() => navigate(`/design/select`)}
					>
						<div className={styles.skeletonPieceImage}>
							<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1}
									d="M12 4v16m8-8H4"
								/>
							</svg>
						</div>
						<div className={styles.skeletonPieceContent}>
							<div className={styles.skeletonPieceTitle}>New piece</div>
							<div className={styles.skeletonPieceText}>Click to design</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export const MetalSwatch: React.FC<{
	hexStart: string;
	hexEnd: string;
	size?: number;
}> = ({ hexStart, hexEnd, size = 16 }) => {
	return (
		<div
			className={styles.metalSwatch}
			style={{
				background: `linear-gradient(45deg, ${hexStart}, ${hexEnd})`,
				width: size,
				height: size,
			}}
		/>
	);
};

// Helper to convert PieceSuggestion to a partial JewelryPiece for rendering
const suggestionToJewelryPiece = (
	suggestion: PieceSuggestion,
	index: number
): JewelryPiece => {
	return {
		id: `suggested-${suggestion.type}-${index}`,
		name: suggestion.name,
		type: suggestion.type as PieceType,
		createdAt: new Date().toISOString(),
		updatedAt: new Date().toISOString(),
		design: {
			metal: suggestion.metal as MetalColor,
			finish: suggestion.finish as FinishType,
			bezelStyle: 'prong',
			primaryGemstone: suggestion.gemstoneId
				? {
						gemstoneId: suggestion.gemstoneId,
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
		},
		render: {
			type: '3D',
			data: {
				camera: { x: 0, y: 0, z: 2.5 },
				lights: [],
			},
		},
		isComplete: false,
		completionPercentage: 0,
	};
};

export default CollectionDetail;
