import React from 'react';
import { Gemstone } from '../../data/gemstones';
import styles from './GemstoneSelector.module.css';

interface GemstoneSelectorProps {
	availableGemstones: Gemstone[];
	selectedGemstones: string | string[];
	onGemstoneChange: (gemstoneId: string | null) => void;
	multiSelect?: boolean;
	label?: string;
	description?: string;
	showNoneOption?: boolean;
	emptyMessage?: string;
}

export const GemstoneSelector: React.FC<GemstoneSelectorProps> = ({
	availableGemstones,
	selectedGemstones,
	onGemstoneChange,
	multiSelect = false,
	label = 'Gemstone',
	description,
	showNoneOption = true,
	emptyMessage,
}) => {
	const isSelected = (gemstoneId: string | null): boolean => {
		if (gemstoneId === null) {
			if (Array.isArray(selectedGemstones)) {
				return selectedGemstones.length === 0;
			}
			return !selectedGemstones;
		}

		if (Array.isArray(selectedGemstones)) {
			return selectedGemstones.includes(gemstoneId);
		}
		return selectedGemstones === gemstoneId;
	};

	return (
		<div className={styles.container}>
			{label && <h3 className={styles.label}>{label}</h3>}
			{description && <p className={styles.description}>{description}</p>}
			{availableGemstones.length > 0 ? (
				<div className={styles.grid}>
					{showNoneOption && (
						<button
							type="button"
							className={`${styles.option} ${
								isSelected(null) ? styles.active : ''
							}`}
							onClick={() => onGemstoneChange(null)}
						>
							<div className={styles.optionLabel}>None</div>
						</button>
					)}
					{availableGemstones.map((gemstone) => (
						<button
							key={gemstone.id}
							type="button"
							className={`${styles.option} ${
								isSelected(gemstone.id) ? styles.active : ''
							}`}
							onClick={() => onGemstoneChange(gemstone.id)}
						>
							<div className={styles.optionContent}>
								<img
									src={gemstone.imageUrl}
									alt={gemstone.name}
									className={styles.gemstoneImage}
								/>
								<div className={styles.optionLabel}>{gemstone.name}</div>
							</div>
						</button>
					))}
				</div>
			) : (
				emptyMessage && (
					<div className={styles.emptyMessage}>{emptyMessage}</div>
				)
			)}
		</div>
	);
};
