import React from 'react';
import { CollectionForm } from '../components/collections/CollectionForm';
import styles from './NewCollection.module.css';

const NewCollection: React.FC = () => {
  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>Create Collection</h1>
          <p className={styles.subtitle}>
            Define your collection's theme, mood, and design parameters to establish a cohesive aesthetic
          </p>
        </div>
        <CollectionForm />
      </div>
    </div>
  );
};

export default NewCollection;
