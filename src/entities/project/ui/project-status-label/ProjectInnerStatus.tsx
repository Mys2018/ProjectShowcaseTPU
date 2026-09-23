import React from 'react'
import './ProjectInnerStatus.module.css'
import type {ProjectStatus} from "../../model/types.ts";
import PublishedIcon from '@/shared/ui/icons/published_inner_status.svg?react'
import ChangesIcon from '@/shared/ui/icons/changes_inner_status.svg?react'
import ModerationIcon from '@/shared/ui/icons/moderation_inner_status.svg?react'
import ReportIcon from '@/shared/ui/icons/report_inner_status.svg?react'
import { InfoTooltip } from "@/shared";

export type InnerStatuses = 'published' | 'changes' | 'moderation' | 'report'

interface ProjectInnerStatusProps {
  status: ProjectStatus;
  children?: React.ReactNode;
  className?: string;
}

const getStatusData = (status: InnerStatuses, className: string = '') => {
  switch (status) {
    case 'published':
      return {
        icon: <PublishedIcon className={className} />,
        tooltipText: 'Проект опубликован',
      }
    case 'changes':
      return {
        icon: <ChangesIcon className={className} />,
        tooltipText: 'Есть неопубликованные изменения',
      }
    case 'moderation':
      return {
        icon: <ModerationIcon className={className} />,
        tooltipText: 'Проект на модерации',
      }
    case 'report':
      return {
        icon: <ReportIcon className={className} />,
        tooltipText: 'Получена жалоба',
      }
    default:
      return {
        icon: <PublishedIcon className={className} />,
        tooltipText: 'Некорректный статус',
      }
  }
}

const STATUS_MAP: Record<ProjectStatus, InnerStatuses> = {
  Recruiting: 'published',
  RecruitmentCompleted: 'published',
  InProgress: 'published',
  Completed: 'published',
  NotImplemented: 'published',
  // TODO Rejected Что-то придумать потом
  Rejected: 'report',
  Pending: 'moderation',
  NeedsRework: 'report',
  Archived: 'published'
}

export const ProjectInnerStatus = ({className, status, children }: ProjectInnerStatusProps) => {
  const innerStatus: InnerStatuses = STATUS_MAP[status];
  const { icon, tooltipText } = getStatusData(innerStatus, className);

  return (
    <InfoTooltip
      body={[{ text: [tooltipText] }]}
      size="large"
      pointer="topRight"

    >
      {children ?? icon}
    </InfoTooltip>
  )
}
