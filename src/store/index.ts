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
        // Only persist collections and standalone pieces, not UI state or active design sessions
        collections: state.collections,
        standalonePieces: state.standalonePieces,
      }),
      // Migrate old data to new format
      version: 2,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Migrate collections that don't have gemstoneIds
          if (persistedState.collections) {
            persistedState.collections = persistedState.collections.map((collection: any) => ({
              ...collection,
              gemstoneIds: collection.gemstoneIds || [],
            }));
          }
        }
        if (version < 2) {
          // Add standalonePieces array if it doesn't exist
          persistedState.standalonePieces = persistedState.standalonePieces || [];
        }
        return persistedState as StoreState;
      },
    }
  )
);
