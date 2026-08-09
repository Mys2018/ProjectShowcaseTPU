import {useModalStore} from "@/shared/model";
import { SelectCompetencyModal } from '@/features/my-competencies/ui/modal-competency/SelectCompetencyModal.tsx'
import type {ModalType} from "@/shared/model/useModalStore.ts";
import React from "react";
import {LinkModal} from "@/features/link-modal/LinkModal.tsx";
import { ConfirmModal } from "@/shared/ui";
import {AddCheckpointsModal} from "@/shared/ui/add-checkpoints-modal/AddCheckpointsModal.tsx";
import {SelectProjectLinksModal} from "@/features/create-project/ui/components/select-project-links-modal/SelectProjectLinksModal.tsx";

const MODAL_COMPONENTS : Record<NonNullable<ModalType>, React.ElementType> = {
  COMPETENCY_CHOICE: SelectCompetencyModal,
  LINK_UPDATE: LinkModal,
  CONFIRM_SAVE: ConfirmModal,
  CONFIRM_CANCEL: ConfirmModal,
  ADD_CHECKPOINT: AddCheckpointsModal,
  ADD_LINK: LinkModal,
  SELECT_PROJECT_LINKS: SelectProjectLinksModal,
}

export function ModalRoot() {

  const { activeModal, closeModal, modalProps } = useModalStore()

  if (!activeModal) return null;

  const SpecificModal = MODAL_COMPONENTS[activeModal]

  return <SpecificModal isOpen={true} onClose={closeModal} {...(modalProps as Record<string, unknown>)} />
}