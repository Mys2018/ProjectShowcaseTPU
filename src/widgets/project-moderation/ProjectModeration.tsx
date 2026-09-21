import clsx from 'clsx'
import styles from './ProjectModeration.module.css'
import { ApproveProjectButton, RejectProjectButton, RequestChangesProjectButton } from '@/features/moderate-projects'
import { getProjectFormatTranslation, ProjectInfo, ProjectReviewComment, useProjectReview, type ProjectCardData } from '@/entities/project'
import { CheckpointList } from '@/entities/checkpoint'
import { getSortedTags, TagBadge, TagBadgeList } from '@/entities/tag'
import { ProjectSkeleton } from '@/shared'

interface ProjectModerationProps {
  project: ProjectCardData
}

export function ProjectModeration({ project }: ProjectModerationProps) {
  const { data: review, isLoading: isReviewLoading } = useProjectReview(project.id)
  const sortedTags = getSortedTags(project.tags, project.primaryTag)
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.top}>
            <h2 className={clsx(styles.title, 'ellipsis')} title={project.meta.title}>
              Проверка проекта «{project.meta.title}»
            </h2>
            <h3 className={styles.subtitle}>
              Тип проекта: <span className={styles.regular}>{getProjectFormatTranslation(project.type)}</span>
            </h3>
          </div>
          {isReviewLoading ? <ProjectSkeleton /> : review && <ProjectReviewComment comment={review} />}
        </div>
        <ProjectInfo
          project={project}
          primaryTagSlot={<TagBadge tag={sortedTags[0]} />}
          tagsSlot={<TagBadgeList tags={sortedTags.slice(1)} />}
          checkpointsSlot={<CheckpointList checkpoints={project.checkpoints} />}
        />
      </div>
      <div className={styles.buttons}>
        <RejectProjectButton projectId={project.id} />
        <div className={styles.end}>
          <RequestChangesProjectButton projectId={project.id} />
          <ApproveProjectButton projectId={project.id} />
        </div>
      </div>
    </div>
  )
}
