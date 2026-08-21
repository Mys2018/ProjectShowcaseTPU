import {useModalStore} from "@/shared/model";
import { SelectCompetencyModal } from '@/features/my-competencies/ui/modal-competency/SelectCompetencyModal.tsx'
import type {ModalType} from "@/shared/model/useModalStore.ts";
import React from "react";
import {LinkModal} from "@/shared/ui/modals/link-modal/LinkModal.tsx";
import { ConfirmModal } from "@/shared/ui";
import {AddCheckpointsModal} from "@/shared/ui/modals/add-checkpoints-modal/AddCheckpointsModal.tsx";
import {SelectProjectLinksModal} from "@/features/create-project/ui/components/select-project-links-modal/SelectProjectLinksModal.tsx";
import {AvatarUploadModal} from "@/widgets/profile-header/ui/AvatarUploadModal.tsx";
import {InviteUserModal} from "@/features/create-project/ui/components/invite-user-modal/InviteUserModal.tsx";
const MODAL_COMPONENTS : Record<NonNullable<ModalType>, React.ElementType> = {
  COMPETENCY_CHOICE: SelectCompetencyModal,
  LINK_UPDATE: LinkModal,
  CONFIRM_SAVE: ConfirmModal,
  CONFIRM_CANCEL: ConfirmModal,
  ADD_CHECKPOINT: AddCheckpointsModal,
  ADD_LINK: LinkModal,
  SELECT_PROJECT_LINKS: SelectProjectLinksModal,
  AVATAR_UPLOAD: AvatarUploadModal,
  INVITE_USER: InviteUserModal,
}

export function ModalRoot() {

  const { activeModal, closeModal, modalProps } = useModalStore()

  if (!activeModal) return null;

  const SpecificModal = MODAL_COMPONENTS[activeModal]

  return <SpecificModal isOpen={true} onClose={closeModal} {...(modalProps as Record<string, unknown>)} />
}