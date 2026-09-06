import React, {useMemo} from 'react'
import './ProjectInnerStatus.module.css'
import type {ProjectStatus} from "@/entities/project";
import PublishedIcon from '@/shared/ui/icons/published_inner_status.svg?react'
import ChangesIcon from '@/shared/ui/icons/changes_inner_status.svg?react'
import ModerationIcon from '@/shared/ui/icons/moderation_inner_status.svg?react'
import ReportIcon from '@/shared/ui/icons/report_inner_status.svg?react'
import { InfoTooltip } from "@/shared";

export type InnerStatuses = 'published' | 'changes' | 'moderation' | 'report'

interface ProjectInnerStatusProps {
  status: ProjectStatus;
  children?: React.ReactNode;
}

const getStatusData = (status: InnerStatuses) => {
  switch (status) {
    case 'published':
      return {
        icon: <PublishedIcon />,
        tooltipText: 'Проект опубликован',
      }
    case 'changes':
      return {
        icon: <ChangesIcon />,
        tooltipText: 'Есть неопубликованные изменения',
      }
    case 'moderation':
      return {
        icon: <ModerationIcon />,
        tooltipText: 'Проект на модерации',
      }
    case 'report':
      return {
        icon: <ReportIcon />,
        tooltipText: 'Получена жалоба',
      }
    default:
      return {
        icon: <PublishedIcon />,
        tooltipText: '',
      }
  }
}

const STATUS_MAP: Record<string, InnerStatuses> = {
  Recruiting: 'published',
  RecruitmentCompleted: 'published',
  InProgress: 'published',
  Completed: 'published',
  NotImplemented: 'published',
  Pending: 'moderation',
  NeedsRework: 'report',
}

export const ProjectInnerStatus = ({ status, children }: ProjectInnerStatusProps) => {
  
  const innerStatus = useMemo(() => STATUS_MAP[status], [status])
  const { icon, tooltipText } = getStatusData(innerStatus);

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
