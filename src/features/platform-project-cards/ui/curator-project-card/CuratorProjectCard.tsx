import styles from './CuratorProjectCard.module.css'
import {
  type ProjectCardData,
  ProjectCardHorizontal,
  ProjectInnerStatus,
  ProjectPublicStatusLabel
} from "@/entities/project";
import {PartnerRow, PartnerRowSkeleton, usePartnerById} from "@/entities/partner";
import {TagBadgeList} from "@/entities/tag";

interface CuratorProjectCardProps {
  project: ProjectCardData
}

export const CuratorProjectCard = ({project}: CuratorProjectCardProps) => {

  const partnerId = project?.partnerId || ''
  const { data: partner } = usePartnerById(partnerId, Boolean(partnerId))

  return (
    <ProjectCardHorizontal
      project={project}
      partnerSlot={partner ? <PartnerRow partner={partner}/> : <PartnerRowSkeleton/>}
      headerSlot={
        <div className={styles.header}>
          <div className={styles.badges}>
            <TagBadgeList  tags={project.tags}/>
          </div>

          <div className={styles.statusContainer}>
            <ProjectPublicStatusLabel status={project.status}/>
            <ProjectInnerStatus status={project.status}/>
          </div>
        </div>
      }
    />
  )
}
