import { useMemo } from 'react';
import styles from './CuratorProjectCard.module.css'
import {
  type ProjectCardData,
  ProjectCardHorizontal,
  ProjectCardTeam,
  ProjectInnerStatus,
  ProjectPublicStatusLabel
} from "@/entities/project";
import {PartnerRow, PartnerRowSkeleton} from "@/entities/partner";
import { TagBadgeList } from "@/entities/tag";
import { PlatformBadgeSmall } from "@/entities/platforms";
import { ArchiveButton } from "@/shared/ui/elements/buttons";
import {ApplicationBlock} from "@/entities/application/ui/application-block/ApplicationBlock.tsx";

interface CuratorProjectCardProps {
  project: ProjectCardData
}

export const CuratorProjectCard = ({ project }: CuratorProjectCardProps) => {

  const partner = project?.partner

  const resources = useMemo(() => [
    ...(project.repository || []),
    ...(project.taskTracker || []),
    ...(project.otherPlatforms || project.designEnvironment || [])
  ], [project.repository, project.taskTracker, project.otherPlatforms, project.designEnvironment]);

  return (
    <ProjectCardHorizontal
      project={project}
      mainSlot={partner ? <PartnerRow partner={partner} /> : <PartnerRowSkeleton />}
      headerSlot={
        <div className={styles.header}>
          <div className={styles.badges}>
            <TagBadgeList tags={project.tags} />
          </div>

          <div className={styles.statusContainer}>
            {
              !(project.status === 'Pending' || project.status === 'NeedsRework') && <ProjectPublicStatusLabel status={project.status} />
            }
            <ProjectInnerStatus status={project.status} />
          </div>
        </div>
      }
      sideSlot={
        <div className={styles.cardBody}>
          <ProjectCardTeam
            members={project.team ? project.team.map(m => ({
              id: m.userId,
              firstName: m.meta?.firstName || '',
              lastName: m.meta?.lastName || '',
              profilePicture: m.profilePicture,
              roles: m.roles,
            })) : undefined}
            max={3}
          />
          {resources.length > 0 && (
            <div className={styles.bodyBlock}>
              <p>
                Ресурсы:
              </p>
              <div className={styles.resourceList}>
                {resources.map((platform, idx) => {
                  return (
                    <PlatformBadgeSmall
                      key={`${platform.platformId}-${idx}`}
                      link={platform.url}
                      platformName={platform.name}
                    />
                  )
                })}
              </div>
            </div>
          )}
        </div>
      }
      footerSlot={
        <div className={styles.footer}>
          <ArchiveButton color='grey' />
          <ApplicationBlock applicationCount={67} notification={true} onClick={() => {}} buttonText={"Смотреть"}/>
        </div>
      }
    />
  )
}
