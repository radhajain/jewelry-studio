import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { CollectionCard } from '../components/collections/CollectionCard';
import Button from '../components/common/Button';
import styles from './Home.module.css';

const Home: React.FC = () => {
	const navigate = useNavigate();
	const collections = useStore((state) => state.collections);

	return (
		<div className={styles.home}>
			<div className={styles.slug}>Collections</div>

			<div className={styles.gallery}>
				{collections.map((collection) => (
					<CollectionCard key={collection.id} collection={collection} />
				))}
				<div
					className={styles.skeletonCard}
					onClick={() => navigate('/collections/new')}
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
						<div className={styles.skeletonTitle}>New Collection</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Home;
