import { useNavigate } from 'react-router-dom'
import styles from './ProjectCardFactory.module.css'
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

  return (
    <ProjectCardVertical
      project={project}
      onClick={() => void navigate(buildRoute.project(project.id))}
      headerSlot={<TagBadgeList visibleCount={1} tags={getSortedTags(project.tags, project.primaryTag)} />}
      bodySlot={<CompetencyBadgeList row competencies={project.roles.map(r => ({ id: r.roleId, name: r.meta.name }))} />}
      footerSlot={
        <div className={styles.cardFooter}>
          <span className={styles.divider} />
          {partner ? <PartnerRow partner={partner} /> : <PartnerRowSkeleton />}
        </div>
      }
    />
  )
}
