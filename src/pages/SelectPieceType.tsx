import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styles from './SelectPieceType.module.css';

const SelectPieceType: React.FC = () => {
	const navigate = useNavigate();
	// Scroll to top when component mounts
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	const pieceTypes = [
		{ type: 'ring', label: 'Ring' },
		{ type: 'earring', label: 'Earring' },
		{ type: 'necklace', label: 'Necklace' },
		{ type: 'bracelet', label: 'Bracelet' },
	];

	return (
		<div className={styles.page}>
			<div className={styles.container}>
				<div className={styles.header}>
					<div className={styles.slug}>
						<Link
							to="/pieces"
							style={{ color: 'inherit', textDecoration: 'none' }}
						>
							Pieces
						</Link>{' '}
						/ Select Type
					</div>
					<h1 className={styles.title}>Select Piece Type</h1>
					<p className={styles.subtitle}>
						Choose the type of jewelry piece you want to create
					</p>
				</div>

				<div className={styles.grid}>
					{pieceTypes.map(({ type, label }) => (
						<div
							key={type}
							className={styles.typeCard}
							onClick={() => navigate(`/design/${type}`)}
						>
							<div className={styles.typeIcon}>
								<svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={1}
										d="M12 4v16m8-8H4"
									/>
								</svg>
							</div>
							<div className={styles.typeLabel}>{label}</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default SelectPieceType;
