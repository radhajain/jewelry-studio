import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import PieceCard from '../components/pieces/PieceCard';
import styles from './Pieces.module.css';

const Pieces: React.FC = () => {
	const navigate = useNavigate();
	const collections = useStore((state) => state.collections);
	const standalonePieces = useStore((state) => state.standalonePieces);

	// Flatten all pieces from all collections and standalone pieces
	const collectionPieces = collections.flatMap((collection) =>
		collection.pieces.map((piece) => ({
			...piece,
			collectionName: collection.name,
		}))
	);

	const allPieces = [
		...standalonePieces.map((piece) => ({
			...piece,
			collectionName: undefined as string | undefined,
		})),
		...collectionPieces,
	];

	return (
		<div className={styles.page}>
			<div className={styles.container}>
				<div className={styles.slug}>Pieces</div>
				<div className={styles.gallery}>
					{allPieces.map((piece) => (
						<div key={piece.id} className={styles.pieceWrapper}>
							<PieceCard
								piece={piece}
								onClick={() =>
									navigate(
										`/collections/${piece.collectionId}/piece/${piece.id}`
									)
								}
							/>
							{piece.collectionName && (
								<div className={styles.collectionLabel}>
									from {piece.collectionName}
								</div>
							)}
						</div>
					))}
					<div
						className={styles.skeletonCard}
						onClick={() => navigate('/design/select')}
					>
						<div className={styles.skeletonImage}>
							<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1}
									d="M12 4v16m8-8H4"
								/>
							</svg>
						</div>
						<div className={styles.skeletonContent}>
							<div className={styles.skeletonTitle}>New Piece</div>
							<div className={styles.skeletonText}>
								Click to create a standalone piece
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Pieces;
