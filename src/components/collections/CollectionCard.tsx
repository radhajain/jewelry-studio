import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Collection } from '../../types';
import { format } from 'date-fns';
import Card from '../common/Card';
import styles from './CollectionCard.module.css';

interface CollectionCardProps {
	collection: Collection;
}

export const CollectionCard: React.FC<CollectionCardProps> = ({
	collection,
}) => {
	const navigate = useNavigate();

	const handleClick = () => {
		navigate(`/collections/${collection.id}`);
	};

	const coverImage = collection.moodboard[0]?.url;

	return (
		<Card hover onClick={handleClick} className={styles.card}>
			<div className={styles.image}>
				{coverImage ? (
					<img src={coverImage} alt={collection.name} />
				) : (
					<div className={styles.imagePlaceholder}>
						<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1}
								d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
					</div>
				)}
			</div>

			<div className={styles.content}>
				<h3 className={styles.name}>{collection.name}</h3>
				<p className={styles.description}>{collection.description}</p>

				<div className={styles.metadata}>
					{format(new Date(collection.createdAt), 'MMM d, yyyy')}
				</div>

				{collection.pieces.length > 0 && (
					<div className={styles.pieceCount}>
						{collection.pieces.length}{' '}
						{collection.pieces.length === 1 ? 'piece' : 'pieces'}
					</div>
				)}
			</div>
		</Card>
	);
};
