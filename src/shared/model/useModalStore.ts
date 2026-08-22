import {create} from "zustand";
import type {ModalType} from "@/shared/types";

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