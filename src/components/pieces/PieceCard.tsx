import React from 'react';
import { JewelryPiece } from '../../types';
import Card from '../common/Card';
import PieceRenderer2D from './PieceRenderer2D';
import styles from './PieceCard.module.css';

interface PieceCardProps {
	piece: JewelryPiece;
	onClick?: () => void;
}

const PieceCard: React.FC<PieceCardProps> = ({ piece, onClick }) => {
	return (
		<Card hover onClick={onClick} className={styles.card}>
			<div className={styles.preview}>
				<PieceRenderer2D piece={piece} size={300} />
			</div>

			<div className={styles.content}>
				<h3 className={styles.name}>{piece.name}</h3>

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
