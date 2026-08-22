import styles from './FreeCompetencies.module.css'
import CheckIcon from '@/shared/ui/icons/check.svg?react';
import FeedBackIcon from '@/shared/ui/icons/feedback.svg?react';
import StarDetailIcon from '@/shared/ui/icons/starDetail.svg?react';
import Plus from '@/shared/ui/icons/plus.svg?react'
import {useState} from "react";
import {InfoTooltip, ROUTES} from "@/shared";
import {FeedBackButton} from "@/shared/ui/elements/buttons";
import {useIsProfileFilled} from "@/entities/user/lib";
import {useAuthStore} from "@/entities/user";
import {useNavigate} from "react-router-dom";

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

export const FreeCompetencies = ({roles}: FreeCompetenciesProps) => {

  const [selectedCometencies, setSelectedCometencies] = useState<string[]>([])

  const [isActiveFeedBack, setIsActiveFeedBack] = useState<boolean>(false)

  const {isProfileFilled} = useIsProfileFilled()
  const status = useAuthStore(state => state.status)
  const navigate = useNavigate()

  const toggleFeedBack = () => {
    return setIsActiveFeedBack(!isActiveFeedBack)
  }

  const toggleCometencySelect = (roleId: string) => {
    setSelectedCometencies(prevState => {
      let nextState;
      if (prevState.includes(roleId)) {
        nextState = prevState.filter(id => id != roleId)
      } else if (prevState.length >= 2) {
        nextState = prevState
      } else {
        nextState = [...prevState, roleId]
      }

      if (nextState.length === 0) {
        setIsActiveFeedBack(false)
      }
      return nextState
    })
  }

  const MAX_SELECTIONS = 2;
  const isMaxSelected = selectedCometencies.length >= MAX_SELECTIONS;


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

              const isSelected = selectedCometencies.includes(role.roleId);
              const isDimmed = isMaxSelected && !isSelected;

              return (
                  <div
                      key={role.roleId}
                      className={`${styles.competency} ${isSelected ? styles.selected : ''} ${isDimmed ? styles.dimmed : ''}`}
                      onClick={() => toggleCometencySelect(role.roleId)}
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
                              importantText={'Важно тут!'}
                              link={'sdfsdsdsds'}
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
                        <FeedBackIcon className={styles.feedbackIcon} color={`${isSelected ? 'white' : 'var(--color-gray-600)'} `}/>
                      </div>

                      <div className={`${styles.plusButton} ${isSelected ? styles.selected : ''}`}>
                        {isSelected ?
                          <CheckIcon className={styles.checkIcon}/> :
                          <Plus className={styles.plusIcon}/>
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
                      isActiveFeedBack={isActiveFeedBack}
                      toggleFeedBack={toggleFeedBack}
                      disabled={selectedCometencies.length === 0}
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
                    onClickGreenButtonText={() => { navigate(`/${ROUTES.MY_PROFILE}`) }}
                  >
                    <FeedBackButton
                      isActiveFeedBack={isActiveFeedBack}
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
                  isActiveFeedBack={isActiveFeedBack}
                  toggleFeedBack={toggleFeedBack}
                  disabled={true}
                />
              </InfoTooltip>

          }


          <p className={styles.countFree}>
            {selectedCometencies.length}/{MAX_SELECTIONS}
          </p>
        </div>
      </div>
  )
}