import React from 'react';
import { Collection } from '../../types';
import CollectionCard from './CollectionCard';

interface CollectionGalleryProps {
  collections: Collection[];
}

const CollectionGallery: React.FC<CollectionGalleryProps> = ({ collections }) => {
  if (collections.length === 0) {
    return (
      <div className="text-center py-24">
        <svg
          className="w-24 h-24 text-stone-300 mx-auto mb-6"
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
        <h3 className="text-h3 text-stone-600 mb-3">No collections yet</h3>
        <p className="text-body text-stone-500 mb-8">
          Create your first jewelry collection to get started
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {collections.map((collection) => (
        <CollectionCard key={collection.id} collection={collection} />
      ))}
    </div>
  );
};

export default CollectionGallery;
