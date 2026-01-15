import React from 'react';
import { CollectionForm } from '../components/collections/CollectionForm';
import styles from './NewCollection.module.css';

const NewCollection: React.FC = () => {
	return (
		<div className={styles.page}>
			<div className={styles.container}>
				<div className={styles.slug}>Collections / New</div>
				<CollectionForm />
			</div>
		</div>
	);
};

export default NewCollection;
