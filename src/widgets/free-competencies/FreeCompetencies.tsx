import styles from './FreeCompetencies.module.css'
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useIsProfileFilled } from "@/entities/user/lib";
import { useAuthStore } from "@/entities/user";
import { FeedBackButton } from "@/features/feedback-button";
import CheckIcon from '@/shared/ui/icons/check.svg?react';
import FeedBackIcon from '@/shared/ui/icons/feedback.svg?react';
import StarDetailIcon from '@/shared/ui/icons/starDetail.svg?react';
import Plus from '@/shared/ui/icons/plus.svg?react'
import { InfoTooltip, ROUTES } from "@/shared";
import { useApplications, updateApplicationStatus, createApplication, applicationKeys, type ApplicationStatus } from "@/entities/application";
import { useMutation, useQueryClient } from '@tanstack/react-query';

const useCreateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (roleId: string) => createApplication({ roleId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.lists() })
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
    },
  });
};

interface FreeCompetenciesProps {
  roles: {
    roleId: string,
    placesCount: number,
    minPlacesCount: number,
    places: number,
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
}

export const FreeCompetencies = ({ roles }: FreeCompetenciesProps) => {

  const [selectedCompetencies, setSelectedCompetencies] = useState<string[]>([])

  const { isProfileFilled } = useIsProfileFilled()
  const status = useAuthStore(state => state.status)
  const navigate = useNavigate()

  const { data: myApplications } = useApplications({ limit: 100, offset: 0, mode: 'AsStudent' })
  const createApplicationMutation = useCreateApplication()
  const updateApplicationStatusMutation = useUpdateApplicationStatus()

  const currentApplications = useMemo(() => {
    if (!myApplications?.applications) return [];
    const roleIds = roles.map(r => r.roleId);
    return myApplications.applications.filter(app => roleIds.includes(app.roleID) && (app.status === 'pending' || app.status === 'approved'));
  }, [myApplications, roles]);

  const isAppliedToProject = currentApplications.length > 0;
  const displaySelected = isAppliedToProject ? currentApplications.map(app => app.roleID) : selectedCompetencies;

  const toggleFeedBack = async () => {
    if (isAppliedToProject) {
      try {
        await Promise.all(
          currentApplications.map(app =>
            updateApplicationStatusMutation.mutateAsync({ applicationId: app.applicationID, status: 'closed' })
          )
        );
        setSelectedCompetencies([]);
      } catch (error) {
        console.error("Failed to cancel applications", error);
      }
    } else {
      try {
        await Promise.all(
          selectedCompetencies.map(roleId =>
            createApplicationMutation.mutateAsync(roleId)
          )
        );
      } catch (error) {
        console.error("Failed to create applications", error);
      }
    }
  }

  const toggleCompetencySelect = (roleId: string) => {
    if (isAppliedToProject) return;

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
          Выберите компетенции для отклика:
        </h3>
      </div>

      <div className={styles.competenciesList}>
        {
          roles.map((role) => {
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
                          pointer={'topLeft'}
                          type={'help'}
                        />
                      </div>
                    )}
                  </div>

                  {
                    role.skills.length !== 0 ? (
                      <ul className={styles.skillsList}>
                        {
                          role.skills.map((skill) => (
                            <li className={`${styles.skill} ${skill.requireSkill ? styles.required : ''}`}
                              key={skill.skillName}>
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
        }
      </div>

      <div className={styles.footer}>
        {
          status === 'authenticated' ? (
            isProfileFilled ?
              <>
                <FeedBackButton
                  isActiveFeedBack={isAppliedToProject}
                  toggleFeedBack={toggleFeedBack}
                  disabled={!isAppliedToProject && selectedCompetencies.length === 0}
                />
              </> :
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
                  toggleFeedBack={toggleFeedBack}
                  disabled={true}
                />
              </InfoTooltip>
          )
            :
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
                toggleFeedBack={toggleFeedBack}
                disabled={true}
              />
            </InfoTooltip>

        }


        <p className={styles.countFree}>
          {displaySelected.length}/{MAX_SELECTIONS}
        </p>
      </div>
    </div>
  )
}