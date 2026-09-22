import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import {AvatarUploadModal} from "@/widgets/profile-header/ui/AvatarUploadModal.tsx";
import { MyHoursModal } from "@/widgets/scoring-table";
import { SelectCompetencyModal } from '@/features/my-competencies/ui/modal-competency/SelectCompetencyModal.tsx'
import {SelectProjectLinksModal} from "@/features/create-project/ui/components/select-project-links-modal/SelectProjectLinksModal.tsx";
import {InviteUserModal} from "@/features/create-project/ui/components/invite-user-modal/InviteUserModal.tsx";
import {useModalStore} from "@/shared/model";
import type {ModalType} from "@/shared/types";
import {LinkModal} from "@/shared/ui/modals/link-modal/LinkModal.tsx";
import { ConfirmModal } from "@/shared/ui";
import {AddCheckpointsModal} from "@/shared/ui/modals/add-checkpoints-modal/AddCheckpointsModal.tsx";
import {StartModal} from "@/shared/ui/modals/start-modal";
import { BlockedGradingModal } from "@/shared/ui/modals/blocked-grading-modal";
import { ComplaintModal } from "@/shared/ui/modals/complaint-modal";

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
  START_MODAL: StartModal,
  BLOCKED_GRADING: BlockedGradingModal,
  COMPLAINT_MODAL: ComplaintModal,
  MY_PROJECT_HOURS: MyHoursModal,
}


export function ModalRoot() {
  const location = useLocation()
  const { activeModal, closeModal, modalProps } = useModalStore()

  useEffect(() => {
    if (activeModal) {
      closeModal()
    }
  }, [location.pathname])

  if (!activeModal) return null;

  const SpecificModal = MODAL_COMPONENTS[activeModal]

  return <SpecificModal isOpen={true} onClose={closeModal} {...(modalProps as Record<string, unknown>)} />
}