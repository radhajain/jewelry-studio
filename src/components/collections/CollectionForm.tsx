import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MetalColor, Gemstone, BezelDesign, MoodboardImage } from '../../types';
import { useStore } from '../../store';
import Input from '../common/Input';
import TextArea from '../common/TextArea';
import Button from '../common/Button';
import MoodboardUploader from './MoodboardUploader';
import styles from './CollectionForm.module.css';

const METALS: MetalColor[] = [
  'yellow-gold',
  'white-gold',
  'rose-gold',
  'platinum',
  'silver',
];

interface CollectionFormProps {
  collectionId?: string;
  onSuccess?: () => void;
}

export const CollectionForm: React.FC<CollectionFormProps> = ({
  collectionId,
  onSuccess,
}) => {
  const navigate = useNavigate();
  const createCollection = useStore((state) => state.createCollection);
  const updateCollection = useStore((state) => state.updateCollection);
  const existingCollection = useStore((state) =>
    collectionId ? state.collections.find((c) => c.id === collectionId) : null
  );

  const isEditing = !!collectionId && !!existingCollection;

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

  // Load existing collection data when editing
  useEffect(() => {
    if (existingCollection) {
      setFormData({
        name: existingCollection.name,
        description: existingCollection.description,
        theme: existingCollection.theme,
        moodboard: existingCollection.moodboard,
        colors: existingCollection.colors,
        gemstones: existingCollection.gemstones,
        bezelDesigns: existingCollection.bezelDesigns,
      });
    }
  }, [existingCollection]);

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

    if (isEditing) {
      updateCollection(collectionId!, formData);
      toast.success('Collection updated successfully!');
      if (onSuccess) {
        onSuccess();
      }
    } else {
      createCollection(formData);
      toast.success('Collection created successfully!');
      navigate('/');
    }
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
    <form onSubmit={handleSubmit} className={styles.form}>
      {/* Basic Information */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Basic Information</h3>
        <div className={styles.fields}>
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
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Moodboard</h3>
        <p className={styles.sectionDescription}>
          Upload images that capture the aesthetic and inspiration for your collection
        </p>
        <MoodboardUploader
          images={formData.moodboard}
          onImagesChange={(moodboard) =>
            setFormData({ ...formData, moodboard })
          }
        />
        {errors.moodboard && <p className={styles.error}>{errors.moodboard}</p>}
      </section>

      {/* Theme */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Theme</h3>

        {/* Mood Keywords */}
        <div className={styles.moodKeywords}>
          <label className={styles.label}>Mood Keywords</label>
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
          {formData.theme.mood.length > 0 && (
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
          )}
        </div>
      </section>

      {/* Colors & Materials */}
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Available Materials</h3>

        {/* Metal Selection */}
        <div>
          <label className={styles.label}>Metals</label>
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
                {metal.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Actions */}
      <div className={styles.actions}>
        <Button
          type="button"
          variant="secondary"
          onClick={() => (onSuccess ? onSuccess() : navigate(-1))}
        >
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {isEditing ? 'Save Changes' : 'Create Collection'}
        </Button>
      </div>
    </form>
  );
};
