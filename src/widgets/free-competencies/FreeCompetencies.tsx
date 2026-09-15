import styles from './FreeCompetencies.module.css'
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useIsProfileFilled, useAuthStore, useMe } from "@/entities/user";
import { FeedBackButton } from "@/features/feedback-button";
import CheckIcon from '@/shared/ui/icons/check.svg?react';
import FeedBackIcon from '@/shared/ui/icons/feedback.svg?react';
import StarDetailIcon from '@/shared/ui/icons/starDetail.svg?react';
import Plus from '@/shared/ui/icons/plus.svg?react'
import { InfoTooltip, ROUTES } from "@/shared";
import { useApplications, updateApplicationStatus, createApplication, applicationKeys, type ApplicationStatus } from "@/entities/application";
import { projectQueryKeys, useProjectTeam, type ProjectCardData } from "@/entities/project";
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useCreateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roleId: string) => createApplication({ roleId, type: 'Application' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.lists() })
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.appliedList() })
    }
  })
};

const useUpdateApplicationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ applicationId, status }: { applicationId: string; status: ApplicationStatus }) =>
      updateApplicationStatus(applicationId, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.appliedList() });
      queryClient.invalidateQueries({ queryKey: projectQueryKeys.participatingList() });
    },
  });
};

interface FreeCompetenciesProps {
  roles: {
    roleId: string,
    placesCount: number,
    minPlacesCount: number,
    places: number,
    placeUserIds?: number[],
    skills:
    {
      skillId: string,
      skillName: string,
      requireSkill?: boolean
    }[],
    meta: {
      name: string,
      description: string
    }
  }[]
  project?: ProjectCardData
}

export const FreeCompetencies = ({ roles, project }: FreeCompetenciesProps) => {

  const [selectedCompetencies, setSelectedCompetencies] = useState<string[]>([])

  const { isProfileFilled } = useIsProfileFilled()
  const status = useAuthStore(state => state.status)
  const { data: me } = useMe()
  const myUserId = me ? Number(me.id) : null
  const navigate = useNavigate()

  const { data: myApplications } = useApplications({ limit: 100, offset: 0, mode: 'AsStudent' })
  const createApplicationMutation = useCreateApplication()
  const updateApplicationStatusMutation = useUpdateApplicationStatus()

  // Пока хотя бы одна заявка в полёте — кнопка заблокирована: второй клик по
  // «Откликнуться» дублировал бы заявки, а по «Отменить» — устраивал шторм
  // отмен прямо во время первого батча.
  const isBatchPending = createApplicationMutation.isPending || updateApplicationStatusMutation.isPending

  const { data: teamMembers } = useProjectTeam(project?.id ?? '', !!project?.id)

  const currentApplications = useMemo(() => {
    if (!myApplications?.applications) return [];
    const roleIds = roles.map(r => r.roleId);
    return myApplications.applications.filter(app => roleIds.includes(app.roleID) && (app.status === 'pending' || app.status === 'approved'));
  }, [myApplications, roles]);

  // Проверяем, состоит ли пользователь в команде проекта (по списку занявших места, по одобренной заявке, по составу команды или владелец)
  const isMemberByPlaces = useMemo(() => {
    if (!myUserId) return false
    return roles.some(r => r.placeUserIds?.includes(myUserId))
  }, [roles, myUserId])

  const hasApprovedApplication = useMemo(() => {
    return currentApplications.some(app => app.status === 'approved')
  }, [currentApplications])

  const isMemberByTeam = useMemo(() => {
    if (!myUserId || !teamMembers) return false
    return teamMembers.some(member => member.userId === myUserId)
  }, [myUserId, teamMembers])

  const isOwner = !!myUserId && !!project && project.ownerId === myUserId
  const isInTeam = isMemberByPlaces || hasApprovedApplication || isOwner || isMemberByTeam

  // Активные (не рассмотренные) заявки
  const pendingApplications = useMemo(() => {
    return currentApplications.filter(app => app.status === 'pending')
  }, [currentApplications])

  const isAppliedToProject = pendingApplications.length > 0;

  // Компетенции, которые уже заняты пользователем
  const myOccupiedRoleIds = useMemo(() => {
    const fromApps = currentApplications
      .filter(app => app.status === 'approved')
      .map(app => app.roleID)
    const fromPlaces = myUserId
      ? roles.filter(r => r.placeUserIds?.includes(myUserId)).map(r => r.roleId)
      : []
    return Array.from(new Set([...fromApps, ...fromPlaces]))
  }, [currentApplications, myUserId, roles])

  // Компетенции, которые отмечаются галочкой
  const displaySelected = useMemo(() => {
    if (isInTeam) {
      return Array.from(new Set([
        ...myOccupiedRoleIds,
        ...pendingApplications.map(app => app.roleID)
      ]))
    }
    if (isAppliedToProject) {
      return pendingApplications.map(app => app.roleID)
    }
    return selectedCompetencies
  }, [isInTeam, myOccupiedRoleIds, isAppliedToProject, pendingApplications, selectedCompetencies])

  // Проверка: есть ли в компетенции хотя бы одно свободное место
  const isRoleFree = (role: FreeCompetenciesProps['roles'][number]) => {
    const placesTaken = role.placeUserIds?.length ?? role.places ?? 0
    return role.placesCount - placesTaken > 0
  }

  // Для тех, кто ещё не откликнулся (и не занимает роль), показываем только свободные компетенции.
  // Уже занятые компетенции не должны появляться у людей, кто ещё не откликнулся.
  const visibleRoles = useMemo(() => {
    return roles.filter(role => {
      if (displaySelected.includes(role.roleId)) {
        return true
      }
      return isRoleFree(role)
    })
  }, [roles, displaySelected])

  const toggleFeedBack = async () => {
    if (isBatchPending || isInTeam) return;

    if (isAppliedToProject) {
      // allSettled: частичный провал не должен прерывать остальные отмены,
      // иначе половина заявок остаётся активной, а UI об этом не знает.
      const results = await Promise.allSettled(
        pendingApplications.map(app =>
          updateApplicationStatusMutation.mutateAsync({ applicationId: app.applicationID, status: 'cancelled' })
        )
      );
      const failed = results.filter(r => r.status === 'rejected').length;
      if (failed === 0) {
        setSelectedCompetencies([]);
      } else {
        console.error("Failed to cancel applications", failed);
      }
    } else {
      const results = await Promise.allSettled(
        selectedCompetencies.map(roleId =>
          createApplicationMutation.mutateAsync(roleId)
        )
      );
      // Промежуточный провал Promise.all рвал батч после первого же отказа:
      // часть заявок уже создана, пользователь ретраит — и дублирует их.
      // Ошибки самих заявок React Query кладёт в мутацию, общий фидбек не нужен.
      const failed = results.filter(r => r.status === 'rejected').length;
      if (failed > 0) {
        console.error("Failed to create applications", failed);
      }
    }
  }

  const toggleCompetencySelect = (roleId: string) => {
    if (isAppliedToProject || isInTeam) return;

    setSelectedCompetencies(prevState => {
      let nextState;
      if (prevState.includes(roleId)) {
        nextState = prevState.filter(id => id != roleId)
      } else if (prevState.length >= 2) {
        nextState = prevState
      } else {
        nextState = [...prevState, roleId]
      }

      return nextState
    })
  }

  const MAX_SELECTIONS = 2;
  const isMaxSelected = displaySelected.length >= MAX_SELECTIONS;


  return (
    <div className={styles.freeCompetencies}>

      <div className={styles.header}>
        <h3 className={styles.title}>
          {isInTeam
            ? 'Компетенции проекта:'
            : !isAppliedToProject && visibleRoles.length === 0
              ? 'Компетенции проекта:'
              : 'Выберите компетенции для отклика:'}
        </h3>
      </div>

      <div className={styles.competenciesList}>
        {visibleRoles.length === 0 ? (
          <p className={styles.emptyCompetencies}>
            Все компетенции уже заняты
          </p>
        ) : (
          visibleRoles.map((role) => {
            const isSelected = displaySelected.includes(role.roleId);
            const isDimmed = isMaxSelected && !isSelected;

            return (
              <div
                key={role.roleId}
                className={`${styles.competency} ${isSelected ? styles.selected : ''} ${isDimmed ? styles.dimmed : ''}`}
                onClick={() => toggleCompetencySelect(role.roleId)}
              >
                <div className={styles.leftHalfRole}>
                  <div className={styles.competencyHeader}>
                    <p className={styles.role}>
                      {role.meta.name}
                    </p>
                    {!isDimmed && (
                      <div className={styles.tooltipWrapper} onClick={(e) => e.stopPropagation()}>
                        <InfoTooltip
                          className={styles.tooltip}
                          iconClassName={styles.tooltipIcon}
                          title="Заголовок тултипа"
                          body={
                            [
                              {
                                text: [
                                  'Бла бла',
                                ]
                              },
                            ]
                          }
                          size={'small'}
                          pointer={'topRight'}
                          type={'help'}
                        />
                      </div>
                    )}
                  </div>

                  {
                    role.skills.length !== 0 ? (
                      <ul className={styles.skillsList}>
                        {
                          role.skills.map((skill, skillIdx) => (
                            <li className={`${styles.skill} ${skill.requireSkill ? styles.required : ''}`}
                              key={skill.skillId || `${skill.skillName}-${skillIdx}`}>
                              {skill.skillName}
                              {skill.requireSkill && (
                                <>
                                  <StarDetailIcon
                                    className={styles.starIcon}
                                    color={`${isSelected ? 'var(--color-brand-green)' : 'white'}`}
                                  />
                                </>
                              )}
                            </li>
                          ))
                        }
                      </ul>
                    ) : (
                      <p className={styles.withoutSkills}>
                        Определённые навыки не требуются
                      </p>
                    )
                  }

                </div>

                <div className={styles.aside}>

                  <div className={styles.response}>
                    <p className={styles.countRes}>
                      {67}
                    </p>
                    <FeedBackIcon className={styles.feedbackIcon} color={`${isSelected ? 'white' : 'var(--color-gray-600)'} `} />
                  </div>

                  <div className={`${styles.plusButton} ${isSelected ? styles.selected : ''}`}>
                    {isSelected ?
                      <CheckIcon className={styles.checkIcon} /> :
                      <Plus className={styles.plusIcon} />
                    }
                  </div>

                </div>

              </div>
            )

          })
        )}
      </div>

      <div className={styles.footer}>
        {
          isInTeam ? (
            <FeedBackButton
              isActiveFeedBack={false}
              toggleFeedBack={() => {}}
              disabled={true}
              isInTeam={true}
            />
          ) : !isAppliedToProject && visibleRoles.length === 0 ? (
            <FeedBackButton
              isActiveFeedBack={false}
              toggleFeedBack={() => {}}
              disabled={true}
              customText="Набор завершён"
            />
          ) : status === 'authenticated' ? (
            isProfileFilled ? (
              <FeedBackButton
                isActiveFeedBack={isAppliedToProject}
                toggleFeedBack={() => void toggleFeedBack()}
                disabled={(!isAppliedToProject && selectedCompetencies.length === 0) || isBatchPending}
              />
            ) : (
              <InfoTooltip
                title='Заполните профиль для отлика на проект'
                body={[
                  {
                    text: ['Для подачи заявки необходимо заполнить блок «О себе» и указать свои навыки. Это поможет наставнику оценить вашу кандидатуру.']
                  }
                ]}
                size={'small'}
                pointer={'topRight'}
                greenButtonText={'Перейти к заполнению'}
                onClickGreenButtonText={() => { navigate(ROUTES.PROFILE.BASE) }}
              >
                <FeedBackButton
                  isActiveFeedBack={isAppliedToProject}
                  toggleFeedBack={() => void toggleFeedBack()}
                  disabled={true}
                />
              </InfoTooltip>
            )
          ) : (
            <InfoTooltip
              body={[
                {
                  text: ['Откликаться на проекты могут только зарегистрированные пользователи.']
                }
              ]}
              size={'small'}
              pointer={'topRight'}
              greenButtonText={'Войти в аккаунт'}
              onClickGreenButtonText={() => { navigate(ROUTES.LOGIN) }}
            >
              <FeedBackButton
                isActiveFeedBack={isAppliedToProject}
                toggleFeedBack={() => void toggleFeedBack()}
                disabled={true}
              />
            </InfoTooltip>
          )
        }

        {!isInTeam && visibleRoles.length > 0 && (
          <p className={styles.countFree}>
            {displaySelected.length}/{MAX_SELECTIONS}
          </p>
        )}
      </div>
    </div>
  )
}