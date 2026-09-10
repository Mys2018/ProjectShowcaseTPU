import { useMemo } from 'react';
import styles from './CuratorProjectCard.module.css'
import {
  type ProjectCardData,
  ProjectCardHorizontal,
  ProjectInnerStatus,
  ProjectPublicStatusLabel
} from "@/entities/project";
import {PartnerRow, PartnerRowSkeleton} from "@/entities/partner";
import { TagBadgeList } from "@/entities/tag";
import { Avatar } from "@/entities/user";
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

  console.log(project);
  return (
    <ProjectCardHorizontal
      project={project}
      partnerSlot={partner ? <PartnerRow partner={partner} /> : <PartnerRowSkeleton />}
      headerSlot={
        <div className={styles.header}>
          <div className={styles.badges}>
            <TagBadgeList tags={project.tags} />
          </div>

          <div className={styles.statusContainer}>
            <ProjectPublicStatusLabel status={project.status} />
            <ProjectInnerStatus status={project.status} />
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
              <Avatar fallbackType={'user'} size={'36px'} strokeColor={'white'} />
              <Avatar fallbackType={'user'} size={'36px'} strokeColor={'white'} />
              <Avatar fallbackType={'user'} size={'36px'} strokeColor={'white'} />
              <Avatar fallbackType={'user'} size={'36px'} strokeColor={'white'} />
              <Avatar fallbackType={'user'} size={'36px'} strokeColor={'white'} />
            </div>
          </div>
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
