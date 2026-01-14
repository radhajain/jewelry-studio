import { StateCreator } from 'zustand';
import { nanoid } from 'nanoid';
import { Collection } from '../../types';

export interface CollectionsSlice {
  collections: Collection[];
  activeCollectionId: string | null;

  // Actions
  createCollection: (collection: Omit<Collection, 'id' | 'createdAt' | 'updatedAt' | 'pieces'>) => void;
  updateCollection: (id: string, updates: Partial<Collection>) => void;
  deleteCollection: (id: string) => void;
  setActiveCollection: (id: string | null) => void;
  getCollection: (id: string) => Collection | undefined;
}

export const createCollectionsSlice: StateCreator<CollectionsSlice> = (set, get) => ({
  collections: [],
  activeCollectionId: null,

  createCollection: (collectionData) => {
    const newCollection: Collection = {
      ...collectionData,
      id: nanoid(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pieces: [],
    };

    set((state) => ({
      collections: [...state.collections, newCollection],
      activeCollectionId: newCollection.id,
    }));
  },

  updateCollection: (id, updates) => {
    set((state) => ({
      collections: state.collections.map((collection) =>
        collection.id === id
          ? { ...collection, ...updates, updatedAt: new Date().toISOString() }
          : collection
      ),
    }));
  },

  deleteCollection: (id) => {
    set((state) => ({
      collections: state.collections.filter((c) => c.id !== id),
      activeCollectionId: state.activeCollectionId === id ? null : state.activeCollectionId,
    }));
  },

  setActiveCollection: (id) => {
    set({ activeCollectionId: id });
  },

  getCollection: (id) => {
    return get().collections.find((c) => c.id === id);
  },
});
