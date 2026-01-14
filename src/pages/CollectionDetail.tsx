import React from 'react';
import { useParams } from 'react-router-dom';

const CollectionDetail: React.FC = () => {
  const { collectionId } = useParams<{ collectionId: string }>();

  return (
    <div className="container-page">
      <h1 className="text-h1 mb-8">Collection Details</h1>
      <p className="text-body text-stone-600 mb-12">Collection ID: {collectionId}</p>
      {/* Collection details and PieceGallery will go here */}
    </div>
  );
};

export default CollectionDetail;
