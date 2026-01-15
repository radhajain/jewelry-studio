import React, { useState } from 'react';
import { MoodboardImage } from '../../types';
import Button from '../common/Button';
import Input from '../common/Input';
import styles from './CollectionWizardStep1.module.css';
import MoodboardUploader from './MoodboardUploader';

export interface Step1Data {
	name: string;
	description: string;
	moodboard: MoodboardImage[];
	moodKeywords: string[];
}

interface CollectionWizardStep1Props {
	initialData?: Partial<Step1Data>;
	onNext: (data: Step1Data) => void;
	onCancel: () => void;
}

export const CollectionWizardStep1: React.FC<CollectionWizardStep1Props> = ({
	initialData,
	onNext,
	onCancel,
}) => {
	const [formData, setFormData] = useState<Step1Data>({
		name: initialData?.name || '',
		description: initialData?.description || '',
		moodboard: initialData?.moodboard || [],
		moodKeywords: initialData?.moodKeywords || [],
	});

	const [errors, setErrors] = useState<Record<string, string>>({});
	const [moodInput, setMoodInput] = useState('');

	const validate = () => {
		const newErrors: Record<string, string> = {};

		if (!formData.name.trim()) {
			newErrors.name = 'Collection name is required';
		}

		if (!formData.description.trim()) {
			newErrors.description = 'Description is required';
		}

		if (formData.moodboard.length === 0) {
			newErrors.moodboard = 'Please upload at least one moodboard image';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleNext = () => {
		if (validate()) {
			onNext(formData);
		}
	};

	const addMood = () => {
		if (moodInput.trim() && !formData.moodKeywords.includes(moodInput.trim())) {
			setFormData({
				...formData,
				moodKeywords: [...formData.moodKeywords, moodInput.trim()],
			});
			setMoodInput('');
		}
	};

	const removeMood = (mood: string) => {
		setFormData({
			...formData,
			moodKeywords: formData.moodKeywords.filter((m) => m !== mood),
		});
	};

	return (
		<div className={styles.container}>
			<div className={styles.content}>
				{/* Basic Information */}
				<section className={styles.section}>
					<h3 className={styles.sectionTitle}>Basic Information</h3>
					<div className={styles.fields}>
						<Input
							label="Collection Name"
							value={formData.name}
							onChange={(e) =>
								setFormData({ ...formData, name: e.target.value })
							}
							placeholder="e.g., Spring 2026 Collection"
							error={errors.name}
							required
						/>

						<Input
							label="Description"
							value={formData.description}
							onChange={(e) =>
								setFormData({ ...formData, description: e.target.value })
							}
							placeholder="Describe the inspiration and vision for this collection..."
							error={errors.description}
							required
						/>
					</div>
				</section>

				{/* Moodboard */}
				<section className={styles.section}>
					<h3 className={styles.sectionTitle}>Moodboard</h3>
					<p className={styles.sectionDescription}>
						Upload images that capture the aesthetic and inspiration for your
						collection
					</p>
					<MoodboardUploader
						images={formData.moodboard}
						onImagesChange={(moodboard) =>
							setFormData({ ...formData, moodboard })
						}
					/>
					{errors.moodboard && (
						<p className={styles.error}>{errors.moodboard}</p>
					)}
				</section>

				{/* Style Keywords */}
				<section className={styles.section}>
					<h3 className={styles.sectionTitle}>Style Keywords</h3>
					<p className={styles.sectionDescription}>
						Add keywords that describe the mood and style of your collection
					</p>
					<div className={styles.moodKeywords}>
						<div className={styles.moodInputGroup}>
							<input
								type="text"
								value={moodInput}
								onChange={(e) => setMoodInput(e.target.value)}
								onKeyPress={(e) =>
									e.key === 'Enter' && (e.preventDefault(), addMood())
								}
								placeholder="e.g., elegant, bold, delicate"
								className={styles.moodInput}
							/>
							<Button type="button" onClick={addMood} variant="secondary">
								Add
							</Button>
						</div>
						{formData.moodKeywords.length > 0 && (
							<div className={styles.moodTags}>
								{formData.moodKeywords.map((mood) => (
									<span key={mood} className={styles.moodTag}>
										{mood}
										<button
											type="button"
											onClick={() => removeMood(mood)}
											className={styles.removeButton}
										>
											×
										</button>
									</span>
								))}
							</div>
						)}
					</div>
				</section>
			</div>

			{/* Actions */}
			<div className={styles.actions}>
				<Button type="button" variant="secondary" onClick={onCancel}>
					Cancel
				</Button>
				<Button type="button" variant="primary" onClick={handleNext}>
					Next: Select Materials
				</Button>
			</div>
		</div>
	);
};
