import { create } from 'zustand';

interface GlobalState {
  isFromQurbani: boolean;
  setIsFromQurbani: (value: boolean) => void;
  getIsFromQurbani: () => boolean;
}

const useGlobalStore = create<GlobalState>((set, get) => ({
  isFromQurbani: false,

  setIsFromQurbani: (value: boolean) => set({ isFromQurbani: value }),

  getIsFromQurbani: () => get().isFromQurbani,
}));

export default useGlobalStore;
