import { useNavigate } from 'react-router-dom'
import styles from './ProjectCardFactory.module.css'
import { LikeProjectButton } from '@/features/like-project'
import { getSortedTags, TagBadgeList } from '@/entities/tag'
import { ProjectCardVertical, type ProjectCardData } from '@/entities/project'
import { CompetencyBadgeList } from '@/entities/competency'
import { PartnerRow, PartnerRowSkeleton, usePartnerById } from '@/entities/partner'
import { buildRoute } from '@/shared'

interface ProjectCardFactoryProps {
  project: ProjectCardData
}

export const ProjectCardFactory = ({ project }: ProjectCardFactoryProps) => {
  const navigate = useNavigate()
  const { data: partner } = usePartnerById(project.partnerId)

  const {id, liked, tags, primaryTag, roles} = project
  const competencies = roles.map(r => ({ id: r.roleId, name: r.meta.name }))

  const handleNavigate = () => {
    navigate(buildRoute.project(id))
  }

  return (
    <ProjectCardVertical
      className={styles.card}
      project={project}
      onClick={handleNavigate}
      headerSlot={
        <div className={styles.header}>
          <TagBadgeList visibleCount={1} tags={getSortedTags(tags, primaryTag)} />
          <LikeProjectButton className={styles.like} projectId={id} liked={liked} onClick={e => e.stopPropagation()} />
        </div>
      }
      bodySlot={<CompetencyBadgeList row competencies={competencies} />}
      footerSlot={
        <div className={styles.footer}>
          <span className={styles.divider} />
          {partner ? <PartnerRow partner={partner} /> : <PartnerRowSkeleton />}
        </div>
      }
    />
  )
}
