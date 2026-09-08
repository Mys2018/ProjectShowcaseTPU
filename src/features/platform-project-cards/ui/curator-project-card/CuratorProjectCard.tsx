import { useMemo } from 'react';
import styles from './CuratorProjectCard.module.css'
import {
  type ProjectCardData,
  ProjectCardHorizontal,
  ProjectInnerStatus,
  ProjectPublicStatusLabel
} from "@/entities/project";
import {PartnerRow, PartnerRowSkeleton, usePartnerById} from "@/entities/partner";
import {TagBadgeList} from "@/entities/tag";
import {Avatar} from "@/entities/user";
import {PlatformBadgeSmall, usePlatformFinder} from "@/entities/platforms";

interface CuratorProjectCardProps {
  project: ProjectCardData
}

export const CuratorProjectCard = ({project}: CuratorProjectCardProps) => {

  const partnerId = project?.partnerId || ''
  const { data: partner } = usePartnerById(partnerId, Boolean(partnerId))
  const { findPlatformName } = usePlatformFinder()

  const resources = useMemo(() => [
    ...(project.repository || []),
    ...(project.taskTracker || []),
    ...(project.designEnvironment || [])
  ], [project.repository, project.taskTracker, project.designEnvironment]);

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
      sideSlot={
        <div className={styles.cardBody}>
          <div className={styles.bodyBlock}>
            <p>
              Команда:
            </p>
            <div className={styles.teamList}>
              <Avatar fallbackType={'user'} size={'36px'} strokeColor={'white'}/>
              <Avatar fallbackType={'user'} size={'36px'} strokeColor={'white'}/>
              <Avatar fallbackType={'user'} size={'36px'} strokeColor={'white'}/>
              <Avatar fallbackType={'user'} size={'36px'} strokeColor={'white'}/>
              <Avatar fallbackType={'user'} size={'36px'} strokeColor={'white'}/>
            </div>
          </div>
          {resources.length > 0 && (
            <div className={styles.bodyBlock}>
              <p>
                Ресурсы:
              </p>
              <div className={styles.resourceList}>
                {resources.map((platform, idx) => {
                  const platformName = findPlatformName(platform.platformId)
                  return (
                    <PlatformBadgeSmall
                      key={`${platform.platformId}-${idx}`}
                      link={platform.url}
                      platformName={platformName}
                    />
                  )
                })}
              </div>
            </div>
          )}
        </div>
      }
    />
  )
}
