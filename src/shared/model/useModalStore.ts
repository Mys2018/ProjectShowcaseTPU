import {create} from "zustand";

export type ModalType = 'COMPETENCY_CHOICE' | 'LINK_UPDATE' | 'CONFIRM_SAVE' | 'CONFIRM_CANCEL' | 'ADD_CHECKPOINT' | 'ADD_LINK' | 'SELECT_PROJECT_LINKS' | 'AVATAR_UPLOAD' | 'INVITE_USER' | null
interface ModalStore {
  activeModal: ModalType,
  modalProps: unknown,
  openModal: (type: ModalType, props?: unknown) => void,
  closeModal: () => void,
}

export const useModalStore = create<ModalStore>((set) => ({
  activeModal: null,
  modalProps: {},
  openModal: (type, props) => set({ activeModal: type, modalProps: props }),
  closeModal: () => set({ activeModal: null, modalProps: {} }),
}))