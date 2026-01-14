import { StateCreator } from 'zustand';
import { DesignQuizState, DesignHistoryEntry } from '../../types';

export interface DesignSlice {
  quizState: DesignQuizState | null;
  historyIndex: number;

  // Actions
  initializeDesign: (pieceId: string, sections: DesignQuizState['sections']) => void;
  updateSelection: (sectionId: string, optionIds: string[]) => void;
  undo: () => void;
  redo: () => void;
  resetDesign: () => void;
  setCurrentStep: (step: number) => void;
}

export const createDesignSlice: StateCreator<DesignSlice> = (set, get) => ({
  quizState: null,
  historyIndex: -1,

  initializeDesign: (pieceId, sections) => {
    const newState: DesignQuizState = {
      pieceId,
      currentStep: 0,
      totalSteps: sections.length,
      sections,
      history: [],
      canUndo: false,
      canRedo: false,
    };
    set({ quizState: newState, historyIndex: -1 });
  },

  updateSelection: (sectionId, optionIds) => {
    const state = get().quizState;
    if (!state) return;

    const section = state.sections.find((s) => s.id === sectionId);
    if (!section) return;

    const historyEntry: DesignHistoryEntry = {
      timestamp: new Date().toISOString(),
      sectionId,
      previousValue: section.selectedOptionIds,
      newValue: optionIds,
      action: 'change',
    };

    const updatedSections = state.sections.map((s) =>
      s.id === sectionId
        ? {
            ...s,
            selectedOptionIds: optionIds,
            isComplete: s.isRequired ? optionIds.length > 0 : true,
          }
        : s
    );

    // Trim any redo history when making a new change
    const newHistory = [...state.history.slice(0, get().historyIndex + 1), historyEntry];

    set({
      quizState: {
        ...state,
        sections: updatedSections,
        history: newHistory,
        canUndo: true,
        canRedo: false,
      },
      historyIndex: newHistory.length - 1,
    });
  },

  undo: () => {
    const state = get().quizState;
    const index = get().historyIndex;
    if (!state || index < 0) return;

    const historyEntry = state.history[index];
    const updatedSections = state.sections.map((s) =>
      s.id === historyEntry.sectionId
        ? { ...s, selectedOptionIds: historyEntry.previousValue as string[] }
        : s
    );

    set({
      quizState: {
        ...state,
        sections: updatedSections,
        canUndo: index > 0,
        canRedo: true,
      },
      historyIndex: index - 1,
    });
  },

  redo: () => {
    const state = get().quizState;
    const index = get().historyIndex;
    if (!state || index >= state.history.length - 1) return;

    const historyEntry = state.history[index + 1];
    const updatedSections = state.sections.map((s) =>
      s.id === historyEntry.sectionId
        ? { ...s, selectedOptionIds: historyEntry.newValue as string[] }
        : s
    );

    set({
      quizState: {
        ...state,
        sections: updatedSections,
        canUndo: true,
        canRedo: index + 2 < state.history.length,
      },
      historyIndex: index + 1,
    });
  },

  resetDesign: () => {
    set({ quizState: null, historyIndex: -1 });
  },

  setCurrentStep: (step) => {
    const state = get().quizState;
    if (!state) return;
    set({
      quizState: {
        ...state,
        currentStep: step,
      },
    });
  },
});
