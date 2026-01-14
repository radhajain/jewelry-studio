import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MetalColor, Gemstone, BezelDesign, MoodboardImage } from '../../types';
import { useStore } from '../../store';
import Input from '../common/Input';
import TextArea from '../common/TextArea';
import Button from '../common/Button';
import MoodboardUploader from './MoodboardUploader';
import styles from './CollectionForm.module.scss';

const METALS: MetalColor[] = [
	'yellow-gold',
	'white-gold',
	'rose-gold',
	'platinum',
	'silver',
];

const CollectionForm: React.FC = () => {
	const navigate = useNavigate();
	const createCollection = useStore((state) => state.createCollection);

	const [formData, setFormData] = useState({
		name: '',
		description: '',
		theme: {
			primaryColor: '#1C1917',
			secondaryColor: '#78716C',
			accentColor: '#D6D3D1',
			mood: [] as string[],
		},
		moodboard: [] as MoodboardImage[],
		colors: {
			metals: ['yellow-gold'] as MetalColor[],
			accents: ['#1C1917', '#78716C'],
		},
		gemstones: [] as Gemstone[],
		bezelDesigns: [] as BezelDesign[],
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

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();

		if (!validate()) {
			toast.error('Please fill in all required fields');
			return;
		}

		createCollection(formData);
		toast.success('Collection created successfully!');
		navigate('/');
	};

	const addMood = () => {
		if (moodInput.trim() && !formData.theme.mood.includes(moodInput.trim())) {
			setFormData({
				...formData,
				theme: {
					...formData.theme,
					mood: [...formData.theme.mood, moodInput.trim()],
				},
			});
			setMoodInput('');
		}
	};

	const removeMood = (mood: string) => {
		setFormData({
			...formData,
			theme: {
				...formData.theme,
				mood: formData.theme.mood.filter((m) => m !== mood),
			},
		});
	};

	const toggleMetal = (metal: MetalColor) => {
		const metals = formData.colors.metals.includes(metal)
			? formData.colors.metals.filter((m) => m !== metal)
			: [...formData.colors.metals, metal];

		setFormData({
			...formData,
			colors: { ...formData.colors, metals },
		});
	};

	return (
		<form onSubmit={handleSubmit} className={styles.formContainer}>
			{/* Basic Information */}
			<section className={styles.formSection}>
				<h2>Basic Information</h2>
				<div className={styles.formGroup}>
					<Input
						label="Collection Name"
						value={formData.name}
						onChange={(e) => setFormData({ ...formData, name: e.target.value })}
						placeholder="e.g., Spring 2026 Collection"
						error={errors.name}
						required
					/>

					<TextArea
						label="Description"
						value={formData.description}
						onChange={(e) =>
							setFormData({ ...formData, description: e.target.value })
						}
						placeholder="Describe the inspiration and vision for this collection..."
						error={errors.description}
						rows={4}
						required
					/>
				</div>
			</section>

			{/* Moodboard */}
			<section className={styles.formSection}>
				<h2>Moodboard</h2>
				<p>
					Upload images that capture the aesthetic and inspiration for your
					collection
				</p>
				<MoodboardUploader
					images={formData.moodboard}
					onImagesChange={(moodboard) =>
						setFormData({ ...formData, moodboard })
					}
				/>
				{errors.moodboard && <p>{errors.moodboard}</p>}
			</section>

			{/* Theme */}
			<section className={styles.formSection}>
				<h2>Theme</h2>

				{/* Mood Keywords */}
				<div className={styles.moodKeywords}>
					<label className="input-label">Mood Keywords</label>
					<div className={styles.moodInputGroup}>
						<input
							type="text"
							value={moodInput}
							onChange={(e) => setMoodInput(e.target.value)}
							onKeyPress={(e) =>
								e.key === 'Enter' && (e.preventDefault(), addMood())
							}
							placeholder="e.g., elegant, bold, delicate"
							className={`${styles.moodInput} input`}
						/>
						<Button type="button" onClick={addMood} variant="secondary">
							Add
						</Button>
					</div>
					<div className={styles.moodTags}>
						{formData.theme.mood.map((mood) => (
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
				</div>
			</section>

			{/* Colors & Materials */}
			<section className={styles.formSection}>
				<h2>Colors & Materials</h2>

				{/* Metal Selection */}
				<div className={styles.metalSelection}>
					<label className="input-label">Available Metals</label>
					<div className={styles.metalGrid}>
						{METALS.map((metal) => (
							<button
								key={metal}
								type="button"
								onClick={() => toggleMetal(metal)}
								className={`${styles.metalButton} ${
									formData.colors.metals.includes(metal) ? styles.active : ''
								}`}
							>
								<span>{metal.replace('-', ' ')}</span>
							</button>
						))}
					</div>
				</div>
			</section>

			{/* Actions */}
			<div className={styles.formActions}>
				<Button type="button" variant="secondary" onClick={() => navigate(-1)}>
					Cancel
				</Button>
				<Button type="submit" variant="primary">
					Create Collection
				</Button>
			</div>
		</form>
	);
};

export default CollectionForm;
