import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import PieceCard from '../components/pieces/PieceCard';
import styles from './Pieces.module.css';

const Pieces: React.FC = () => {
	const navigate = useNavigate();
	const collections = useStore((state) => state.collections);

	// Flatten all pieces from all collections
	const allPieces = collections.flatMap((collection) =>
		collection.pieces.map((piece) => ({
			...piece,
			collectionName: collection.name,
		}))
	);

	return (
		<div className={styles.page}>
			<div className={styles.container}>
				<div className={styles.slug}>Pieces</div>

				{allPieces.length > 0 ? (
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
								<div className={styles.collectionLabel}>
									from {piece.collectionName}
								</div>
							</div>
						))}
					</div>
				) : (
					<div className={styles.empty}>
						<p className={styles.emptyText}>No pieces created yet</p>
						<p className={styles.emptyHint}>
							Create a collection and start designing pieces
						</p>
					</div>
				)}
			</div>
		</div>
	);
};

export default Pieces;
