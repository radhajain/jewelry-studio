import React from 'react';
import { JewelryPiece } from '../../types';
import Card from '../common/Card';
import PieceRenderer2D from './PieceRenderer2D';
import styles from './PieceCard.module.css';

interface PieceCardProps {
	piece: JewelryPiece;
	onClick?: () => void;
	suggested?: boolean;
	description?: string;
}

const PieceCard: React.FC<PieceCardProps> = ({ piece, onClick, suggested, description }) => {
	return (
		<Card hover onClick={onClick} className={styles.card}>
			{suggested && (
				<div className={styles.suggestedBadge}>
					<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
						<path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
					</svg>
					Suggested
				</div>
			)}
			<div className={styles.preview}>
				<PieceRenderer2D piece={piece} size={300} />
			</div>

			<div className={styles.content}>
				<h3 className={styles.name}>{piece.name}</h3>

				{description && (
					<p className={styles.description}>{description}</p>
				)}

				<div className={styles.details}>
					<span className={styles.detail}>
						{piece.design.metal?.replace('-', ' ')}
					</span>
					<span className={styles.detail}>{piece.design.finish}</span>
				</div>

				<div className={styles.type}>{piece.type}</div>
			</div>
		</Card>
	);
};

export default PieceCard;
