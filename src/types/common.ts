import { Collection } from './collection';

export interface AppState {
  collections: Collection[];
  activeCollectionId: string | null;
  activePieceId: string | null;
  isLoading: boolean;
  error: string | null;
}

export interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  activeModal: ModalType | null;
  toasts: Toast[];
}

export type ModalType =
  | 'create-collection'
  | 'edit-collection'
  | 'delete-collection'
  | 'save-piece'
  | 'discard-changes';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  duration?: number;
}
