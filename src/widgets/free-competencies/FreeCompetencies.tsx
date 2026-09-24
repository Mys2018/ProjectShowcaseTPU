import styles from './FreeCompetencies.module.css'
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FeedBackButton } from "@/features/feedback-button";
import { useIsProfileFilled, useAuthStore, useMe } from "@/entities/user";
import { useApplications, updateApplicationStatus, createApplication, applicationKeys, type ApplicationStatus } from "@/entities/application";
import {
  projectQueryKeys,
  useProjectTeam,
  useParticipatingProjects,
  isActiveParticipatingProject,
  isProjectCourseEligible,
  getCourseRestrictionText,
  type ProjectCardData
} from "@/entities/project";
import CheckIcon from '@/shared/ui/icons/check.svg?react';
import FeedBackIcon from '@/shared/ui/icons/feedback.svg?react';
import StarDetailIcon from '@/shared/ui/icons/starDetail.svg?react';
import Plus from '@/shared/ui/icons/plus.svg?react'
import { InfoTooltip, ROUTES } from "@/shared";

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
    applicationsCount?: number,
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
  const userGrade = me?.grade ? Number(me.grade) : null
  const isCourseEligible = status === 'authenticated' && userGrade !== null ? isProjectCourseEligible(project?.type, userGrade) : true
  const courseRestrictionText = getCourseRestrictionText(project?.type)
  const navigate = useNavigate()

  const { data: myApplications } = useApplications({ limit: 100, offset: 0, mode: 'AsStudent', type: 'Application' }, status === 'authenticated')
  const { data: participatingProjects } = useParticipatingProjects({ offset: 0, limit: 100 }, status === 'authenticated')

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
    return myApplications.applications.filter(
      app => app.applicationType === 'Application' && roleIds.includes(app.roleID) && (app.status === 'pending' || app.status === 'approved')
    );
  }, [myApplications, roles]);

  const MAX_PROJECT_SELECTIONS = 2;
  const MAX_GLOBAL_APPLICATIONS = 5;

  // Активные (не рассмотренные) заявки в текущем проекте
  const pendingApplications = useMemo(() => {
    return currentApplications.filter(app => app.status === 'pending')
  }, [currentApplications])

  const isAppliedToProject = pendingApplications.length > 0;

  // Все активные (не рассмотренные) заявки студента во всех проектах
  const allActiveApplications = useMemo(() => {
    return (myApplications?.applications ?? []).filter(
      app => app.applicationType === 'Application' && app.status === 'pending'
    )
  }, [myApplications])

  const totalActiveApplicationsCount = allActiveApplications.length
  const remainingGlobalApplications = Math.max(
    0,
    MAX_GLOBAL_APPLICATIONS - totalActiveApplicationsCount
  )
  const isGlobalLimitReached = remainingGlobalApplications <= 0

  // Компетенции, которые уже заняты пользователем
  const myOccupiedRoleIds = useMemo(() => {
    const fromApps = currentApplications
      .filter(app => app.status === 'approved')
      .map(app => app.roleID)
    const fromPlaces = myUserId
      ? roles.filter(r => r.placeUserIds?.includes(myUserId)).map(r => r.roleId)
      : []
    const myTeamMember = myUserId && teamMembers ? teamMembers.find(m => m.userId === myUserId) : null
    const fromTeamRoles = myTeamMember?.roles
      ? roles.filter(r => myTeamMember.roles?.includes(r.meta.name)).map(r => r.roleId)
      : []
    return Array.from(new Set([...fromApps, ...fromPlaces, ...fromTeamRoles]))
  }, [currentApplications, myUserId, roles, teamMembers])

  // Уже приняли в *активный* проект: NotImplemented/Completed/Archived/Rejected
  // место «активного» участия не занимают — иначе нельзя откликнуться снова.
  const isAcceptedInOtherActiveProject = (participatingProjects?.projects ?? [])
    .filter(isActiveParticipatingProject)
    .some((p) => !project?.id || String(p.id) !== String(project.id))

  const isAcceptedInCurrentProject = myOccupiedRoleIds.length > 0

  // Блокировка новых откликов из-за чужого активного проекта (не текущего).
  // Участие в текущем проекте не показываем как «уже есть активный» — там свои UX-состояния.
  const isBlockedByActiveProject = isAcceptedInOtherActiveProject

  const isAcceptedInAnyProject =
    isAcceptedInOtherActiveProject || isAcceptedInCurrentProject

  // Компетенции, которые отмечаются галочкой (занятые + отправленные на рассмотрение + выбранные)
  const displaySelected = useMemo(() => {
    return Array.from(new Set([
      ...myOccupiedRoleIds,
      ...pendingApplications.map(app => app.roleID),
      ...selectedCompetencies
    ]))
  }, [myOccupiedRoleIds, pendingApplications, selectedCompetencies])

  // Проверка: есть ли в компетенции хотя бы одно свободное место
  const isRoleFree = (role: FreeCompetenciesProps['roles'][number]) => {
    const placesTaken = role.placeUserIds?.length ?? role.places ?? 0
    return role.placesCount - placesTaken > 0
  }

  // Не отображаем в списке те, которые заняты другими людьми или самим пользователем
  const visibleRoles = useMemo(() => {
    return roles.filter(role => {
      const hasPendingApp = pendingApplications.some(app => app.roleID === role.roleId)
      return (isRoleFree(role) || hasPendingApp) && !myOccupiedRoleIds.includes(role.roleId)
    })
  }, [roles, myOccupiedRoleIds, pendingApplications])

  const isProjectNotRecruiting = !!(project && project.status !== 'Recruiting' && project.status !== 'RecruitmentCompleted')

  // Сколько компетенций можно ещё выбрать в этом отклике:
  // min(слоты в проекте, оставшийся глобальный лимит pending-заявок).
  const remainingProjectSlots = Math.max(0, MAX_PROJECT_SELECTIONS - pendingApplications.length)
  const maxSelectableNow = Math.max(
    0,
    Math.min(remainingProjectSlots, remainingGlobalApplications)
  )

  // Нельзя подавать заявки, если:
  // - курс студента не подходит для типа проекта (!isCourseEligible)
  // - человека уже приняли в один проект (isAcceptedInAnyProject)
  // - исчерпан глобальный лимит в 5 откликов (isGlobalLimitReached)
  // - проект не находится в статусе набора
  // - нет свободных компетенций
  const canApply =
    isCourseEligible &&
    !isAcceptedInAnyProject &&
    !isGlobalLimitReached &&
    !isProjectNotRecruiting &&
    visibleRoles.length > 0
    && maxSelectableNow > 0

  const applicationsRemainingLabel = (() => {
    if (remainingGlobalApplications <= 0) {
      return `Лимит откликов исчерпан (${MAX_GLOBAL_APPLICATIONS} из ${MAX_GLOBAL_APPLICATIONS})`
    }
    if (remainingGlobalApplications === 1) {
      return 'Можно отправить ещё 1 отклик'
    }
    if (remainingGlobalApplications >= 2 && remainingGlobalApplications <= 4) {
      return `Можно отправить ещё ${remainingGlobalApplications} отклика`
    }
    return `Можно отправить ещё ${remainingGlobalApplications} откликов`
  })()

  const activeProjectRestrictionText = 'У вас уже есть активный проект'
  const globalLimitRestrictionText = `Лимит откликов исчерпан (${totalActiveApplicationsCount} из ${MAX_GLOBAL_APPLICATIONS})`

  const toggleFeedBack = async () => {
    if (isBatchPending) return;

    if (isAppliedToProject) {
      // allSettled: частичный провал не должен прерывать остальные отмены,
      // иначе половина заявок остаётся активной, а UI об этом не знает.
      // Отменяем только не рассмотренные (pending) заявки, одобренные не трогаем.
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
      if (!canApply || selectedCompetencies.length === 0) return;
      const results = await Promise.allSettled(
        selectedCompetencies.map(roleId =>
          createApplicationMutation.mutateAsync(roleId)
        )
      );
      // Промежуточный провал Promise.all рвал батч после первого же отказа:
      // часть заявок уже создана, пользователь ретраит — и дублирует их.
      // Ошибки самих заявок React Query кладёт в мутацию, общий фидбек не нужен.
      const failed = results.filter(r => r.status === 'rejected').length;
      if (failed === 0) {
        setSelectedCompetencies([]);
      } else {
        console.error("Failed to create applications", failed);
      }
    }
  }

  const toggleCompetencySelect = (roleId: string) => {
    if (!canApply) return;

    // Нельзя снять выбор с уже занятой роли
    if (myOccupiedRoleIds.includes(roleId)) return;

    // Нельзя кликом снять заявку, которая уже отправлена (для этого кнопка «Отменить отклик»)
    if (pendingApplications.some(app => app.roleID === roleId)) return;

    // Если есть отправленная нерассмотренная заявка — сначала нужно дождаться ответа или отменить её
    if (isAppliedToProject) return;

    setSelectedCompetencies(prevState => {
      if (prevState.includes(roleId)) {
        return prevState.filter(id => id !== roleId);
      }

      if (prevState.length >= maxSelectableNow) {
        return prevState;
      }

      return [...prevState, roleId];
    });
  }

  const isMaxSelected =
    selectedCompetencies.length >= maxSelectableNow && maxSelectableNow >= 0

  // Если свободных компетенций нет, полностью скрываем блок
  if (visibleRoles.length === 0) {
    return null
  }

  return (
    <div className={styles.freeCompetencies}>

      <div className={styles.header}>
        <h3 className={styles.title}>
          {(!canApply && !isAppliedToProject)
            ? 'Компетенции проекта:'
            : 'Выберите компетенции для отклика:'}
        </h3>
      </div>


      <div className={styles.competenciesList}>
        {visibleRoles.map((role) => {
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
                  {/*{!isDimmed && (*/}
                  {/*  <div className={styles.tooltipWrapper} onClick={(e) => e.stopPropagation()}>*/}
                  {/*    <InfoTooltip*/}
                  {/*      className={styles.tooltip}*/}
                  {/*      iconClassName={styles.tooltipIcon}*/}
                  {/*      title="Заголовок тултипа"*/}
                  {/*      body={[*/}
                  {/*        {*/}
                  {/*          text: ['Бла бла']*/}
                  {/*        }*/}
                  {/*      ]}*/}
                  {/*      size={'small'}*/}
                  {/*      pointer={'topRight'}*/}
                  {/*      type={'help'}*/}
                  {/*    />*/}
                  {/*  </div>*/}
                  {/*)}*/}
                </div>

                {role.skills.length !== 0 ? (
                  <ul className={styles.skillsList}>
                    {role.skills.map((skill, skillIdx) => (
                      <li
                        className={`${styles.skill} ${skill.requireSkill ? styles.required : ''}`}
                        key={skill.skillId || `${skill.skillName}-${skillIdx}`}
                      >
                        {skill.skillName}
                        {skill.requireSkill && (
                          <StarDetailIcon
                            className={styles.starIcon}
                            color={`${isSelected ? 'var(--color-brand-green)' : 'white'}`}
                          />
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className={styles.withoutSkills}>
                    Определённые навыки не требуются
                  </p>
                )}
              </div>

              <div className={styles.aside}>
                <div className={styles.response}>
                  <p className={styles.countRes}>
                    {role.applicationsCount ?? 0}
                  </p>
                  <FeedBackIcon
                    className={styles.feedbackIcon}
                    color={`${isSelected ? 'white' : 'var(--color-gray-600)'} `}
                  />
                </div>

                {
                  canApply &&  <div className={`${styles.plusButton} ${isSelected ? styles.selected : ''}`}>
                    {isSelected ? (
                      <CheckIcon className={styles.checkIcon} />
                    ) : (
                      <Plus className={styles.plusIcon} />
                    )}
                  </div>
                }


              </div>
            </div>
          )
        })}
      </div>

      {(
        canApply ||
        isAppliedToProject ||
        !isCourseEligible ||
        isBlockedByActiveProject ||
        isGlobalLimitReached
      ) && (
        <div className={styles.footer}>
          {isAppliedToProject ? (
            <FeedBackButton
              isActiveFeedBack={true}
              toggleFeedBack={() => void toggleFeedBack()}
              disabled={isBatchPending}
            />
          ) : !isCourseEligible ? (
            // Study: 1–2, Real: 3–4, Case: 1–4 — текст из getCourseRestrictionText
            <div className={styles.courseRestricted}>
              {courseRestrictionText}
            </div>
          ) : isBlockedByActiveProject ? (
            <div className={styles.courseRestricted}>
              {activeProjectRestrictionText}
            </div>
          ) : isGlobalLimitReached ? (
            <div className={styles.courseRestricted}>
              {globalLimitRestrictionText}
            </div>
          ) : canApply ? (
            status === 'authenticated' ? (
              isProfileFilled ? (
                // Других тултипов на кнопке нет (гость/профиль уже заняли слот) —
                // сюда кладём предупреждение про оставшиеся отклики.
                <InfoTooltip
                  body={[
                    {
                      text: [
                        maxSelectableNow < remainingGlobalApplications
                          ? `${applicationsRemainingLabel}. В этом проекте можно выбрать до ${maxSelectableNow}.`
                          : applicationsRemainingLabel,
                      ],
                    },
                  ]}
                  size="small"
                  pointer="topRight"
                >
                  <FeedBackButton
                    isActiveFeedBack={false}
                    toggleFeedBack={() => void toggleFeedBack()}
                    disabled={selectedCompetencies.length === 0 || isBatchPending}
                  />
                </InfoTooltip>
              ) : (
                <InfoTooltip
                  title="Заполните профиль для отлика на проект"
                  body={[
                    {
                      text: [
                        'Для подачи заявки необходимо заполнить блок «О себе» и указать свои навыки. Это поможет наставнику оценить вашу кандидатуру.'
                      ]
                    }
                  ]}
                  size={'small'}
                  pointer={'topRight'}
                  greenButtonText={'Перейти к заполнению'}
                  onClickGreenButtonText={() => {
                    navigate(ROUTES.PROFILE.BASE)
                  }}
                >
                  <FeedBackButton
                    isActiveFeedBack={false}
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
                onClickGreenButtonText={() => {
                  navigate(ROUTES.LOGIN)
                }}
              >
                <FeedBackButton
                  isActiveFeedBack={false}
                  toggleFeedBack={() => void toggleFeedBack()}
                  disabled={true}
                />
              </InfoTooltip>
            )
          ) : null}

          {canApply && (
            <p className={styles.countFree}>
              {selectedCompetencies.length + pendingApplications.length}/{MAX_PROJECT_SELECTIONS}
            </p>
          )}
        </div>
      )}

    </div>
  )
}
