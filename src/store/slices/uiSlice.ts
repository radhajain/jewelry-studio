import { StateCreator } from 'zustand';
import { nanoid } from 'nanoid';
import { UIState, ModalType, Toast } from '../../types';

export interface UISlice extends UIState {
  // Actions
  openModal: (modal: ModalType) => void;
  closeModal: () => void;
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  toggleSidebar: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

export const createUISlice: StateCreator<UISlice> = (set) => ({
  theme: 'light',
  sidebarOpen: false,
  activeModal: null,
  toasts: [],

  openModal: (modal) => {
    set({ activeModal: modal });
  },

  closeModal: () => {
    set({ activeModal: null });
  },

  addToast: (toast) => {
    const newToast: Toast = {
      ...toast,
      id: nanoid(),
      duration: toast.duration || 3000,
    };
    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  toggleSidebar: () => {
    set((state) => ({ sidebarOpen: !state.sidebarOpen }));
  },

  setTheme: (theme) => {
    set({ theme });
  },
});
