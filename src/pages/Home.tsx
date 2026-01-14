import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import CollectionGallery from '../components/collections/CollectionGallery';
import Button from '../components/common/Button';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const collections = useStore((state) => state.collections);

  return (
    <div className="container-page">
      <div className="flex items-center justify-between mb-12">
        <div>
          <h1 className="text-display mb-3">Collections</h1>
          <p className="text-body-large text-stone-600">
            Your jewelry collection designs
          </p>
        </div>
        {collections.length > 0 && (
          <Button onClick={() => navigate('/collections/new')}>
            New Collection
          </Button>
        )}
      </div>

      <CollectionGallery collections={collections} />

      {collections.length === 0 && (
        <div className="text-center">
          <Button onClick={() => navigate('/collections/new')}>
            Create Your First Collection
          </Button>
        </div>
      )}
    </div>
  );
};

export default Home;
