import { create } from 'zustand';

export type EditBlockType = 'aboutMe' | 'interests' | 'competencies' | null;

interface ProfileEditStore {
  activeEditBlock: EditBlockType;
  hasUnsavedChanges: boolean;
  setActiveEditBlock: (block: EditBlockType) => void;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
}

export const useProfileEditStore = create<ProfileEditStore>((set) => ({
  activeEditBlock: null,
  hasUnsavedChanges: false,
  setActiveEditBlock: (block) => set({ activeEditBlock: block }),
  setHasUnsavedChanges: (hasChanges) => set({ hasUnsavedChanges: hasChanges }),
}));
