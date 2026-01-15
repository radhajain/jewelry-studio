import React, { useState, useEffect } from 'react';
import { MetalColor } from '../../types';
import { PRESET_GEMSTONES } from '../../data/gemstones';
import Button from '../common/Button';
import { suggestMaterials, MaterialSuggestion } from '../../utils/anthropic';
import { Step1Data } from './CollectionWizardStep1';
import styles from './CollectionWizardStep2.module.css';

const METALS: MetalColor[] = [
	'yellow-gold',
	'white-gold',
	'rose-gold',
	'platinum',
	'silver',
];

export interface Step2Data {
	metals: MetalColor[];
	gemstoneIds: string[];
}

interface CollectionWizardStep2Props {
	step1Data: Step1Data;
	initialData?: Partial<Step2Data>;
	onComplete: (data: Step2Data) => void;
	onBack: () => void;
	isEditing?: boolean;
}

export const CollectionWizardStep2: React.FC<CollectionWizardStep2Props> = ({
	step1Data,
	initialData,
	onComplete,
	onBack,
	isEditing = false,
}) => {
	const [formData, setFormData] = useState<Step2Data>({
		metals: initialData?.metals || [],
		gemstoneIds: initialData?.gemstoneIds || [],
	});

	const [suggestions, setSuggestions] = useState<MaterialSuggestion | null>(
		null
	);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [showSuggestions, setShowSuggestions] = useState(true);

	useEffect(() => {
		// Only auto-fetch suggestions if we're creating a new collection
		// (not editing an existing one)
		if (!initialData || (initialData.metals?.length === 0 && initialData.gemstoneIds?.length === 0)) {
			fetchSuggestions();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const fetchSuggestions = async () => {
		setIsLoading(true);
		setError(null);

		try {
			const suggestion = await suggestMaterials(
				step1Data.name,
				step1Data.description,
				step1Data.moodKeywords
			);
			setSuggestions(suggestion);

			// Auto-apply suggestions if nothing is selected yet
			if (formData.metals.length === 0 && formData.gemstoneIds.length === 0) {
				applySuggestions(suggestion);
			}
		} catch (err) {
			console.error('Error fetching suggestions:', err);
			setError(
				err instanceof Error
					? err.message
					: 'Failed to get AI suggestions. Please select materials manually.'
			);
		} finally {
			setIsLoading(false);
		}
	};

	const applySuggestions = (suggestion: MaterialSuggestion) => {
		// Map suggestion metals to MetalColor type
		const suggestedMetals = suggestion.metals
			.map((m) => m.toLowerCase().replace(/\s+/g, '-'))
			.filter((m) => METALS.includes(m as MetalColor)) as MetalColor[];

		// Map suggestion gemstones to gemstone IDs
		const suggestedGemstones = suggestion.gemstones
			.map((g) => g.toLowerCase())
			.map(
				(g) => PRESET_GEMSTONES.find((gem) => gem.name.toLowerCase() === g)?.id
			)
			.filter(Boolean) as string[];

		setFormData({
			metals: suggestedMetals,
			gemstoneIds: suggestedGemstones,
		});
	};

	const toggleMetal = (metal: MetalColor) => {
		const metals = formData.metals.includes(metal)
			? formData.metals.filter((m) => m !== metal)
			: [...formData.metals, metal];

		setFormData({ ...formData, metals });
	};

	const toggleGemstone = (gemstoneId: string) => {
		const gemstoneIds = formData.gemstoneIds.includes(gemstoneId)
			? formData.gemstoneIds.filter((id) => id !== gemstoneId)
			: [...formData.gemstoneIds, gemstoneId];

		setFormData({ ...formData, gemstoneIds });
	};

	const handleComplete = () => {
		onComplete(formData);
	};

	return (
		<div className={styles.container}>
			<div className={styles.content}>
				{/* AI Suggestions */}
				{showSuggestions && (
					<section className={styles.aiSection}>
						{isLoading ? (
							<div className={styles.loadingState}>
								<div className={styles.spinner} />
								<p>Getting suggestions based on your collection details...</p>
							</div>
						) : error ? (
							<div className={styles.errorState}>
								<p className={styles.errorMessage}>{error}</p>
								<Button
									variant="secondary"
									size="small"
									onClick={() => setShowSuggestions(false)}
								>
									Dismiss
								</Button>
							</div>
						) : suggestions ? (
							<div className={styles.suggestionBox}>
								<div className={styles.suggestionHeader}>
									<h3 className={styles.suggestionTitle}>Suggestions</h3>
									<button
										className={styles.dismissButton}
										onClick={() => setShowSuggestions(false)}
									>
										×
									</button>
								</div>
								<p className={styles.reasoning}>{suggestions.reasoning}</p>
								<div className={styles.suggestionActions}>
									<Button
										variant="secondary"
										size="small"
										onClick={() => applySuggestions(suggestions)}
									>
										Apply Suggestions
									</Button>
									<Button
										variant="secondary"
										size="small"
										onClick={fetchSuggestions}
									>
										Refresh Suggestions
									</Button>
								</div>
							</div>
						) : null}
					</section>
				)}

				{/* Metal Selection */}
				<section className={styles.section}>
					<h3 className={styles.sectionTitle}>Metals</h3>
					<p className={styles.sectionDescription}>
						Select the metals you want to use in this collection
					</p>
					<div className={styles.metalGrid}>
						{METALS.map((metal) => (
							<button
								key={metal}
								type="button"
								onClick={() => toggleMetal(metal)}
								className={`${styles.metalButton} ${
									formData.metals.includes(metal) ? styles.active : ''
								}`}
							>
								{metal.replace('-', ' ')}
							</button>
						))}
					</div>
				</section>

				{/* Gemstone Selection */}
				<section className={styles.section}>
					<h3 className={styles.sectionTitle}>Gemstones</h3>
					<p className={styles.sectionDescription}>
						Select gemstones to include in your collection palette
					</p>
					<div className={styles.gemstoneGrid}>
						{PRESET_GEMSTONES.map((gemstone) => (
							<button
								key={gemstone.id}
								type="button"
								onClick={() => toggleGemstone(gemstone.id)}
								className={`${styles.gemstoneButton} ${
									formData.gemstoneIds.includes(gemstone.id)
										? styles.active
										: ''
								}`}
							>
								<img
									src={gemstone.imageUrl}
									alt={gemstone.name}
									className={styles.gemstoneImage}
								/>
								<div className={styles.gemstoneName}>{gemstone.name}</div>
							</button>
						))}
					</div>
				</section>
			</div>

			{/* Actions */}
			<div className={styles.actions}>
				<Button type="button" variant="secondary" onClick={onBack}>
					Back
				</Button>
				<Button
					type="button"
					variant="primary"
					onClick={handleComplete}
					disabled={formData.metals.length === 0}
				>
					Create Collection
				</Button>
			</div>
		</div>
	);
};
