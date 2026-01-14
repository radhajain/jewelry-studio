import { PieceType } from './piece';

// Quiz/Design Interface Types

export interface DesignQuizState {
  pieceId: string;
  currentStep: number;
  totalSteps: number;
  sections: QuizSection[];
  history: DesignHistoryEntry[];
  canUndo: boolean;
  canRedo: boolean;
}

export interface QuizSection {
  id: string;
  title: string;
  description: string;
  order: number;
  isRequired: boolean;
  isComplete: boolean;

  // The quiz question type
  questionType: 'single-choice' | 'multi-choice' | 'slider' | 'color-picker' | 'text-input';

  // Options to display as cards
  options: QuizOption[];

  // Current selection
  selectedOptionIds: string[];
}

export interface QuizOption {
  id: string;
  label: string;
  description?: string;
  illustration: string; // SVG, image URL, or icon
  value: unknown; // The actual value to apply to design

  // Visual presentation
  imageUrl?: string;
  iconName?: string;

  // Dependencies (conditional options)
  dependsOn?: {
    sectionId: string;
    optionId: string;
  };

  // Preview hint
  previewHint?: string;
}

export interface DesignHistoryEntry {
  timestamp: string;
  sectionId: string;
  previousValue: unknown;
  newValue: unknown;
  action: 'select' | 'deselect' | 'change';
}

// Configuration for each piece type
export interface PieceTypeConfig {
  type: PieceType;
  displayName: string;
  icon: string;
  sections: QuizSectionConfig[];
}

export interface QuizSectionConfig {
  id: string;
  title: string;
  description: string;
  questionType: QuizSection['questionType'];
  options: QuizOptionConfig[];
  defaultValue?: unknown;
  isRequired: boolean;
  order: number;
}

export interface QuizOptionConfig {
  id: string;
  label: string;
  description?: string;
  value: unknown;
  illustration: string;
  dependsOn?: { sectionId: string; optionId: string };
}
