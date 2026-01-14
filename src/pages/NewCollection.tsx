import React from 'react';
import CollectionForm from '../components/collections/CollectionForm';

const NewCollection: React.FC = () => {
  return (
    <div className="container-page">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-display mb-4">Create Collection</h1>
          <p className="text-body-large text-stone-600">
            Define your collection's theme, mood, and design parameters to establish a cohesive aesthetic
          </p>
        </div>
        <CollectionForm />
      </div>
    </div>
  );
};

export default NewCollection;
