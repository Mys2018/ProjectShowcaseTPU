import { useMemo } from 'react';
import styles from './CuratorProjectCard.module.css'
import { useNavigate } from "react-router-dom";
import {
  type ProjectCardData,
  ProjectCardHorizontal,
  ProjectCardTeam,
  ProjectInnerStatus,
  ProjectPublicStatusLabel,
  getPublicProjectStatus,
  useProjectTeam,
  useProjectGrading,
  useSetProjectStatus
} from "@/entities/project";
import { PartnerRow, PartnerRowSkeleton } from "@/entities/partner";
import { TagBadgeList } from "@/entities/tag";
import { PlatformBadgeSmall } from "@/entities/platforms";
import { ApplicationBlock, useApplications } from "@/entities/application";
import { GradingStatus } from "@/entities/project/ui";
import { ArchiveButton, FilledButton } from "@/shared/ui/elements/buttons";
import { useModalStore } from "@/shared/model";
import { ROUTES } from "@/shared";
import {CompetencyBadgeList} from "@/entities/competency";

interface CuratorProjectCardProps {
  project: ProjectCardData
}

export const CuratorProjectCard = ({ project }: CuratorProjectCardProps) => {
  const openModal = useModalStore(state => state.openModal);
  const partner = project?.partner

  const isProjectInProgress = project?.status === 'InProgress';
  const grading = useProjectGrading(project?.id, isProjectInProgress);

  const { data: team } = useProjectTeam(project.id)
  const { data: applicationsData } = useApplications({
    mode: 'AsOwner',
    projectId: project.id,
    type: 'Application',
    status: 'pending',
    offset: 0,
    limit: 1
  })

  const navigate = useNavigate();
  const setStatusMutation = useSetProjectStatus();

  const handleArchive = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setStatusMutation.mutate({ projectId: project.id, status: 'NotImplemented' });
  };

  const applicationCount = applicationsData?.total ?? 0

  const freeCompetencies = useMemo(() => {
    return (project.roles ?? [])
      .filter(role => {
        const placesTaken = role.placeUserIds?.length ?? 0;
        const placesCount = role.placesCount ?? role.places;
        if (placesCount !== undefined && placesCount > 0) {
          return placesCount - placesTaken > 0;
        }
        return true;
      })
      .map(role => ({
        id: role.roleId,
        name: role.meta.name,
      }));
  }, [project.roles]);

  const resources = useMemo(() => [
    ...(project.repository || []),
    ...(project.taskTracker || []),
    ...(project.otherPlatforms || project.designEnvironment || [])
  ], [project.repository, project.taskTracker, project.otherPlatforms, project.designEnvironment]);

  const publicStatus = getPublicProjectStatus(project);

  return (
    <ProjectCardHorizontal
      project={project}
      mainSlot={partner ? <PartnerRow partner={partner} /> : <PartnerRowSkeleton />}
      onClick={() => {
        if (project.status === 'NeedsRework') {
          navigate(`${ROUTES.PROJECTS.CREATE}?projectId=${project.id}`)
          return
        }
        navigate(`${ROUTES.PROJECTS.BASE}/${project.id}`)
      }}
      headerSlot={
        <div className={styles.header}>
          <div className={styles.badges}>
            <TagBadgeList tags={project.tags} />
          </div>

          <div className={styles.statusContainer}>
            <ProjectPublicStatusLabel status={publicStatus} />
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
            {team && team.length > 0 ? (
              <ProjectCardTeam
                members={team}
                max={6}
                project={project}
              />
            ) : (
              <div className={styles.emptyBlock}>
                Еще нет
              </div>
            )}
          </div>

          {(project.status === 'Recruiting' || publicStatus === 'Recruiting' || publicStatus === 'RecruitmentCompleted') ? (
            <div className={styles.bodyBlock}>
              <p>
                Свободные компетенции:
              </p>
              {freeCompetencies.length > 0 ? (
                <CompetencyBadgeList competencies={freeCompetencies} label="" />
              ) : (
                <div className={styles.emptyBlock}>
                  отсутствуют
                </div>
              )}
            </div>
          ) : (
            <div className={styles.bodyBlock}>
              <p>
                Ресурсы:
              </p>
              {resources.length > 0 ? (
                <div className={styles.resourceList}>
                  {resources.map((platform, idx) => (
                    <PlatformBadgeSmall
                      key={`${platform.platformId}-${idx}`}
                      link={platform.url}
                      platformName={platform.name}
                    />
                  ))}
                </div>
              ) : (
                <div className={styles.emptyBlock}>
                  отсутствуют
                </div>
              )}
            </div>
          )}
        </div>
      }

      footerSlot={
        <div className={styles.footer}>
          {project.status !== 'Completed' && project.status !== 'NotImplemented' && project.status !== 'Archived' ? (
            <ArchiveButton
              color='grey'
              disabled={setStatusMutation.isPending}
              onClick={handleArchive}
            />
          ) : (
            <div />
          )}
          <div className={styles.rightSide}>
            {isProjectInProgress && grading && grading.state !== 'Closed' && (
              <>
                <GradingStatus
                  type={grading.state}
                  count={grading.unratedCount}
                  onClick={() => openModal('BLOCKED_GRADING')}
                />
                {(grading.state === 'Open' ||
                  grading.state === 'WarningNeedsGrading' ||
                  grading.state === 'DangerNeedsGrading') && (
                  <FilledButton
                    textButton="Проставить баллы"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`${ROUTES.MANAGE.BASE}?projectId=${project.id}#grades`, {
                        state: { projectId: project.id }
                      });
                    }}
                  />
                )}
              </>
            )}
            {
              (project.status === 'Recruiting' || publicStatus === 'Recruiting' || publicStatus === 'RecruitmentCompleted') && <ApplicationBlock
                applicationCount={applicationCount}
                notification={applicationCount > 0}
                onClick={(e) => {
                  e.stopPropagation()
                  navigate(`${ROUTES.MANAGE.BASE}?projectId=${project.id}#teams`, {
                    state: { projectId: project.id }
                  })
                }}
                buttonText={"Смотреть"}
              />
            }
          </div>

        </div>
      }
    />
  )
}


