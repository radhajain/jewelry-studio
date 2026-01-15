import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useStore } from '../store';
import { CollectionForm } from '../components/collections/CollectionForm';
import Button from '../components/common/Button';
import styles from './EditCollection.module.css';

const EditCollection: React.FC = () => {
	const { collectionId } = useParams<{ collectionId: string }>();
	const navigate = useNavigate();
	const collection = useStore((state) =>
		state.collections.find((c) => c.id === collectionId)
	);

	if (!collection) {
		return (
			<div className={styles.page}>
				<div className={styles.container}>
					<h1>Collection Not Found</h1>
					<Button onClick={() => navigate('/')}>Back to Collections</Button>
				</div>
			</div>
		);
	}

	return (
		<div className={styles.page}>
			<div className={styles.container}>
				<div className={styles.slug}>
					<Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
						Collections
					</Link>{' '}
					/{' '}
					<Link
						to={`/collections/${collectionId}`}
						style={{ color: 'inherit', textDecoration: 'none' }}
					>
						{collection.name}
					</Link>{' '}
					/ Edit
				</div>
				<CollectionForm
					collectionId={collectionId}
					onSuccess={() => navigate(`/collections/${collectionId}`)}
				/>
			</div>
		</div>
	);
};

export default EditCollection;
