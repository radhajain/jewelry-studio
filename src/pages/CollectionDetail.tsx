import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import Button from '../components/common/Button';
import PieceCard from '../components/pieces/PieceCard';
import styles from './CollectionDetail.module.css';

const CollectionDetail: React.FC = () => {
	const { collectionId } = useParams<{ collectionId: string }>();
	const navigate = useNavigate();

	const collection = useStore((state) =>
		state.collections.find((c) => c.id === collectionId)
	);

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

	return (
		<div className={styles.page}>
			<div className={styles.container}>
				<div className={styles.header}>
					<div className={styles.slug}>Collections / {collection.name}</div>
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

				{/* Moodboard */}
				{collection.moodboard.length > 0 && (
					<div className={styles.moodboard}>
						{collection.moodboard.map((image) => (
							<div key={image.id} className={styles.moodboardImage}>
								<img src={image.url} alt="Moodboard" />
							</div>
						))}
					</div>
				)}

				{/* Collection info sidebar */}
				<div className={styles.infoSidebar}>
					<div className={styles.collectionName}>{collection.name}</div>
					<p className={styles.description}>{collection.description}</p>

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
						<div className={styles.metals}>
							{collection.colors.metals.map((metal) => (
								<div key={metal} className={styles.metal}>
									{metal.replace('-', ' ')}
								</div>
							))}
						</div>
					</div>

					<div className={styles.actions}>
						<Button
							variant="secondary"
							onClick={() => navigate(`/collections/${collectionId}/edit`)}
						>
							Edit Collection
						</Button>
					</div>
				</div>
			</div>

			{/* Pieces */}
			<div className={styles.section}>
				<div className={styles.sectionHeader}>
					<h2 className={styles.sectionTitle}>Pieces</h2>
					{collection.pieces.length > 0 && (
						<div className={styles.pieceActions}>
							<Button
								variant="secondary"
								onClick={() => handleNewPiece('ring')}
							>
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
					)}
				</div>

				{collection.pieces.length > 0 ? (
					<div className={styles.pieces}>
						{collection.pieces.map((piece) => (
							<PieceCard
								key={piece.id}
								piece={piece}
								onClick={() =>
									navigate(`/collections/${collectionId}/piece/${piece.id}`)
								}
							/>
						))}
					</div>
				) : (
					<div className={styles.pieces}>
						{['ring', 'earring', 'necklace', 'bracelet'].map((type) => (
							<div
								key={type}
								className={styles.skeletonPiece}
								onClick={() => handleNewPiece(type)}
							>
								<div className={styles.skeletonPieceImage}>
									<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 4v16m8-8H4" />
									</svg>
								</div>
								<div className={styles.skeletonPieceContent}>
									<div className={styles.skeletonPieceTitle}>New {type}</div>
									<div className={styles.skeletonPieceText}>Click to design</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
};

export default CollectionDetail;
