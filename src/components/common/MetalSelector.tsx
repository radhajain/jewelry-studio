import React from 'react';
import styles from './MetalSelector.module.css';
import { MetalColor } from '../../data/metals';

interface MetalSelectorProps {
	availableMetals: readonly MetalColor[];
	selectedMetals: MetalColor | MetalColor[];
	onMetalChange: (metal: MetalColor) => void;
	multiSelect?: boolean;
	label?: string;
	description?: string;
}

export const MetalSelector: React.FC<MetalSelectorProps> = ({
	availableMetals,
	selectedMetals,
	onMetalChange,
	multiSelect = false,
	label = 'Metal',
	description,
}) => {
	const isSelected = (metal: MetalColor): boolean => {
		if (Array.isArray(selectedMetals)) {
			return selectedMetals.includes(metal);
		}
		return selectedMetals === metal;
	};

	return (
		<div className={styles.container}>
			{label && <h3 className={styles.label}>{label}</h3>}
			{description && <p className={styles.description}>{description}</p>}
			<div className={styles.grid}>
				{availableMetals.map((metal) => (
					<button
						key={metal}
						type="button"
						className={`${styles.option} ${
							isSelected(metal) ? styles.active : ''
						}`}
						onClick={() => onMetalChange(metal)}
					>
						{metal.replace('-', ' ')}
					</button>
				))}
			</div>
		</div>
	);
};
