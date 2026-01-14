import React from 'react';
import { Collection } from '../../types';
import CollectionCard from './CollectionCard';
import styles from './CollectionGallery.module.scss';

interface CollectionGalleryProps {
	collections: Collection[];
}

const CollectionGallery: React.FC<CollectionGalleryProps> = ({
	collections,
}) => {
	if (collections.length === 0) {
		return (
			<div className={styles.emptyState}>
				<svg
					className={styles.emptyIcon}
					fill="none"
					stroke="currentColor"
					viewBox="0 0 24 24"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={1}
						d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
					/>
				</svg>
				<h3 className={styles.emptyTitle}>No collections yet</h3>
				<p className={styles.emptyDescription}>
					Create your first jewelry collection to get started
				</p>
			</div>
		);
	}

	return (
		<div className={styles.gallery}>
			{collections.map((collection) => (
				<CollectionCard key={collection.id} collection={collection} />
			))}
		</div>
	);
};

export default CollectionGallery;
