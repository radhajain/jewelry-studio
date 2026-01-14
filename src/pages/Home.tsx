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

			{collections.length > 0 ? (
				<div className={styles.gallery}>
					{collections.map((collection) => (
						<CollectionCard key={collection.id} collection={collection} />
					))}
				</div>
			) : (
				<div className={styles.empty}>
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
					<p className={styles.emptyText}>
						Create your first jewelry collection to get started
					</p>
					<Button onClick={() => navigate('/collections/new')}>
						Create Your First Collection
					</Button>
				</div>
			)}

			{collections.length > 0 && (
				<div style={{ textAlign: 'center', marginTop: 'var(--space-3xl)' }}>
					<Button
						variant="secondary"
						onClick={() => navigate('/collections/new')}
					>
						New Collection
					</Button>
				</div>
			)}
		</div>
	);
};

export default Home;
