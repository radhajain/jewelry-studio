import React from 'react';
import { useParams } from 'react-router-dom';

const DesignPiece: React.FC = () => {
  const { collectionId, pieceType } = useParams<{ collectionId: string; pieceType: string }>();

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="container-page">
        <h1 className="text-h2 mb-4">Design {pieceType}</h1>
        <p className="text-body text-stone-600 mb-8">Collection ID: {collectionId}</p>
        {/* SplitLayout with DesignCanvas and QuizPanel will go here */}
      </div>
    </div>
  );
};

export default DesignPiece;
