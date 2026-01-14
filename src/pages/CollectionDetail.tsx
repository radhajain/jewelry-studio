import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { CollectionForm } from '../components/collections/CollectionForm';
import styles from './CollectionDetail.module.css';

const CollectionDetail: React.FC = () => {
	const { collectionId } = useParams<{ collectionId: string }>();
	const navigate = useNavigate();
	const [isEditModalOpen, setIsEditModalOpen] = useState(false);

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
				{/* Header */}
				<div className={styles.header}>
					<h1 className={styles.title}>{collection.name}</h1>
					<p className={styles.subtitle}>{collection.description}</p>

					<div className={styles.actions}>
						<Button
							variant="secondary"
							onClick={() => setIsEditModalOpen(true)}
						>
							Edit Collection
						</Button>
					</div>
				</div>

				{/* Moodboard */}
				{collection.moodboard.length > 0 && (
					<div className={styles.section}>
						<h2 className={styles.sectionTitle}>Moodboard</h2>
						<div className={styles.moodboard}>
							{collection.moodboard.map((image) => (
								<div key={image.id} className={styles.moodboardImage}>
									<img src={image.url} alt="Moodboard" />
								</div>
							))}
						</div>
					</div>
				)}

				{/* Theme */}
				<div className={styles.section}>
					<h2 className={styles.sectionTitle}>Theme</h2>

					{collection.theme.mood.length > 0 && (
						<div className={styles.moods}>
							{collection.theme.mood.map((mood) => (
								<span key={mood} className={styles.mood}>
									{mood}
								</span>
							))}
						</div>
					)}
				</div>

				{/* Materials */}
				<div className={styles.section}>
					<h2 className={styles.sectionTitle}>Available Materials</h2>

					<div className={styles.metals}>
						{collection.colors.metals.map((metal) => (
							<span key={metal} className={styles.metal}>
								{metal.replace('-', ' ')}
							</span>
						))}
					</div>
				</div>

				{/* Pieces */}
				<div className={styles.section}>
					<h2 className={styles.sectionTitle}>Pieces</h2>

					{collection.pieces.length > 0 ? (
						<div className={styles.pieces}>
							{/* Pieces will be rendered here */}
							<p
								style={{
									textAlign: 'center',
									gridColumn: '1 / -1',
									color: 'var(--color-text-tertiary)',
								}}
							>
								Piece cards coming soon
							</p>
						</div>
					) : (
						<div className={styles.emptyPieces}>
							<p className={styles.emptyPiecesText}>
								No pieces in this collection yet
							</p>
							<div
								style={{
									display: 'flex',
									gap: 'var(--space-md)',
									justifyContent: 'center',
									flexWrap: 'wrap',
								}}
							>
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
						</div>
					)}
				</div>
			</div>

			{/* Edit Modal */}
			<Modal
				isOpen={isEditModalOpen}
				onClose={() => setIsEditModalOpen(false)}
				title="Edit Collection"
			>
				<CollectionForm
					collectionId={collectionId}
					onSuccess={() => setIsEditModalOpen(false)}
				/>
			</Modal>
		</div>
	);
};

export default CollectionDetail;
