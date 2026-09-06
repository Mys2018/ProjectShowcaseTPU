import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import clsx from 'clsx'
import styles from './DraftProjectCard.module.css'
import { ProjectCardHorizontal } from '@/entities/project'
import { TagBadgeList } from '@/entities/tag'
import {
  mapDraftToProjectCardData,
  getDraftProgress,
  type ProjectDraftResponse,
} from '@/entities/draft'
import { OutlineButton } from '@/shared/ui/elements/buttons'
import { ROUTES } from '@/shared'
import { ProgressBlock } from '@/shared/ui/create-project-progress-widget/CreateProjectProgressWidget.tsx'
import {PartnerRow, PartnerRowSkeleton, usePartnerById} from '@/entities/partner'
import type { CreateProjectFormValues } from '@/features/create-project'

export interface DraftProjectCardProps {
  draft: ProjectDraftResponse | Partial<CreateProjectFormValues> | null | undefined
  className?: string
  onContinue?: () => void
}

export const DraftProjectCard = ({ draft, className, onContinue }: DraftProjectCardProps) => {
  const navigate = useNavigate()

  const draftProject = useMemo(() => {
    return mapDraftToProjectCardData(draft)
  }, [draft])

  const progress = useMemo(() => {
    return getDraftProgress(draft)
  }, [draft])

  const partnerId = draftProject?.partnerId || ''
  const { data: partner } = usePartnerById(partnerId, Boolean(partnerId))

  const handleContinue = () => {
    if (onContinue) {
      onContinue()
    } else {
      navigate(`${ROUTES.PROJECTS.CREATE}?draft=true`)
    }
  }

  if (!draftProject) return null

  return (
    <ProjectCardHorizontal
      className={clsx(styles.card, className)}
      project={draftProject}
      mainSlot={partner ? <PartnerRow partner={partner}/> : <PartnerRowSkeleton/>}
      headerSlot={
        draftProject.tags.length > 0 ? (
          <div className={styles.headerSlot}>
            <TagBadgeList tags={draftProject.tags} visibleCount={3} />
            <p>черновик</p>
          </div>
        ) : undefined
      }
      sideSlot={
        <div className={styles.progress}>
          <div className={styles.progressRow}>
            <ProgressBlock step={3} progress={progress.steps[3]} />
            <p className={!progress.steps[3] ? styles.empty : ''}>
              Требования к продукту
            </p>
          </div>

          <div className={styles.progressRow}>
            <ProgressBlock step={4} progress={progress.steps[4]} />
            <p className={!progress.steps[4] ? styles.empty : ''}>
              Компетенции
            </p>
          </div>

          <div className={styles.progressRow}>
            <ProgressBlock step={5} progress={progress.steps[5]} />
            <p className={!progress.steps[5] ? styles.empty : ''}>
              Даты и ресурсы
            </p>
          </div>
        </div>
      }
      footerSlot={
        <div className={styles.footerDraft}>
          <p>Заполнен на {progress.total}%</p>
          <OutlineButton
            textButton={'Продолжить заполнять'}
            onClick={handleContinue}
          />
        </div>
      }
    />
  )
}
