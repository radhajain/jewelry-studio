import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createCollectionsSlice, CollectionsSlice } from './slices/collectionsSlice';
import { createDesignSlice, DesignSlice } from './slices/designSlice';
import { createUISlice, UISlice } from './slices/uiSlice';

type StoreState = CollectionsSlice & DesignSlice & UISlice;

export const useStore = create<StoreState>()(
  persist(
    (...a) => ({
      ...createCollectionsSlice(...a),
      ...createDesignSlice(...a),
      ...createUISlice(...a),
    }),
    {
      name: 'jewelry-studio-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        // Only persist collections, not UI state or active design sessions
        collections: state.collections,
      }),
    }
  )
);
