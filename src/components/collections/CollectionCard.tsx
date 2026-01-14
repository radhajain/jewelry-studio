import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Collection } from '../../types';
import { format } from 'date-fns';
import Card from '../common/Card';

interface CollectionCardProps {
	collection: Collection;
}

const CollectionCard: React.FC<CollectionCardProps> = ({ collection }) => {
	const navigate = useNavigate();

	const handleClick = () => {
		navigate(`/collections/${collection.id}`);
	};

	// Get the first moodboard image or use a placeholder
	const coverImage = collection.moodboard[0]?.thumbnail;

	return (
		<Card hover onClick={handleClick}>
			{/* Cover Image */}
			<div className="aspect-[4/3] rounded-minimal overflow-hidden bg-stone-100 mb-6">
				{coverImage ? (
					<img
						src={coverImage}
						alt={collection.name}
						className="w-full h-full object-cover scale-hover"
					/>
				) : (
					<div className="w-full h-full flex items-center justify-center">
						<svg
							className="w-16 h-16 text-stone-300"
							fill="none"
							stroke="currentColor"
							viewBox="0 0 24 24"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1}
								d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
							/>
						</svg>
					</div>
				)}
			</div>

			{/* Collection Info */}
			<div>
				<h3 className="text-h3 mb-2">{collection.name}</h3>
				<p className="text-body-small text-stone-600 mb-4 line-clamp-2">
					{collection.description}
				</p>

				{/* Metadata */}
				<div className="flex items-center justify-between text-caption text-stone-500">
					<span>{format(new Date(collection.createdAt), 'MMM d, yyyy')}</span>
				</div>

				{/* Piece Count */}
				{collection.pieces.length > 0 && (
					<div className="mt-4 pt-4 border-t border-stone-200">
						<span className="text-body-small text-stone-600">
							{collection.pieces.length}{' '}
							{collection.pieces.length === 1 ? 'piece' : 'pieces'}
						</span>
					</div>
				)}
			</div>
		</Card>
	);
};

export default CollectionCard;
