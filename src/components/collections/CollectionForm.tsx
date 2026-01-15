import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { BezelDesign } from '../../types';
import { useStore } from '../../store';
import { CollectionWizardStep1, Step1Data } from './CollectionWizardStep1';
import { CollectionWizardStep2, Step2Data } from './CollectionWizardStep2';
import styles from './CollectionForm.module.css';

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

  // Initialize step1Data with existing collection data if editing
  const getInitialStep1Data = (): Step1Data | null => {
    if (existingCollection) {
      return {
        name: existingCollection.name,
        description: existingCollection.description,
        moodboard: existingCollection.moodboard,
        moodKeywords: existingCollection.theme.mood,
      };
    }
    return null;
  };

  // Wizard state
  const [currentStep, setCurrentStep] = useState<1 | 2>(1);
  const [step1Data, setStep1Data] = useState<Step1Data | null>(getInitialStep1Data());

  const handleStep1Complete = (data: Step1Data) => {
    setStep1Data(data);
    setCurrentStep(2);
  };

  const handleStep2Complete = (data: Step2Data) => {
    if (!step1Data) return;

    const collectionData = {
      name: step1Data.name,
      description: step1Data.description,
      theme: {
        primaryColor: '#1C1917',
        secondaryColor: '#78716C',
        accentColor: '#D6D3D1',
        mood: step1Data.moodKeywords,
      },
      moodboard: step1Data.moodboard,
      colors: {
        metals: data.metals,
        accents: ['#1C1917', '#78716C'],
      },
      gemstoneIds: data.gemstoneIds,
      bezelDesigns: [] as BezelDesign[],
    };

    if (isEditing) {
      updateCollection(collectionId!, collectionData);
      toast.success('Collection updated successfully!');
      if (onSuccess) {
        onSuccess();
      }
    } else {
      createCollection(collectionData);
      toast.success('Collection created successfully!');
      navigate('/');
    }
  };

  const handleCancel = () => {
    if (onSuccess) {
      onSuccess();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className={styles.form}>
      {currentStep === 1 ? (
        <CollectionWizardStep1
          initialData={step1Data || undefined}
          onNext={handleStep1Complete}
          onCancel={handleCancel}
        />
      ) : (
        <CollectionWizardStep2
          step1Data={step1Data!}
          initialData={
            existingCollection
              ? {
                  metals: existingCollection.colors.metals,
                  gemstoneIds: existingCollection.gemstoneIds,
                }
              : undefined
          }
          isEditing={isEditing}
          onComplete={handleStep2Complete}
          onBack={() => setCurrentStep(1)}
        />
      )}
    </div>
  );
};
