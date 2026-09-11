import { useState } from 'react'
import styles from './MyApplicationsPage.module.css'
import { getFilteredApplications } from '../lib/getFilteredApplications'
import { StudentApplicationProjectCard } from '@/widgets/student-project-card'
import { useApplications } from '@/entities/application'
import { NoProjectsFallback, CompletedProjects } from "@/entities/project"
import {BlankPhoto, CrossIcon, ROUTES} from '@/shared'
import {useNavigate} from "react-router-dom";


export function MyApplicationsPage() {
  const { data } = useApplications({ mode: 'AsStudent', offset: 0, limit: 20 })
  const navigate = useNavigate()
  const applications = data?.applications || []

  const thisYear = new Date().getFullYear()
  const { activeApplications, archivedApplications } = getFilteredApplications(applications)

  const hasActiveApplications = activeApplications.length > 0
  const hasArchivedApplications = archivedApplications.length > 0
  const [isBannerVisible, setIsBannerVisible] = useState(hasActiveApplications) // TODO показывать баннер только до начала рассмотрения

  return (
    <>
      {isBannerVisible && (
        <div className={styles.banner}>
          <button className={styles.closeButton} onClick={() => setIsBannerVisible(false)}>
            <CrossIcon />
          </button>

          <BlankPhoto className={styles.blank} />
          <div className={styles.description}>
            <h3 className={styles.heading}>Ваши заявки скоро посмотрят</h3>
            <p className={styles.paragraph}>
              Дождитесь окончания набора, чтобы наставники смогли приступить к рассмотрению откликов. А пока есть время, вы можете ещё найти
              интересные проекты для подачи заявок.
            </p>
          </div>
          <div className={styles.timer}>
            <p className={styles.paragraph}>Рассмотрение начнётся через</p>
            <div className={styles.badge}>7 дней {/* TODO количество дней до начала рассмотрения */}</div>
          </div>
        </div>
      )}
      <div className={styles.active}>
        <h3 className={styles.title}>Мои отклики</h3>
        <div className={styles.list}>
          {hasActiveApplications ? (
            activeApplications.map(application => (
              <StudentApplicationProjectCard
                key={application.applicationID}
                application={application}
                skeletonClassName={styles.skeletonBig}
              />
            ))
          ) : (
            <NoProjectsFallback
              className={styles.empty}
              title='Откликов пока нет'
              description='Переходите в каталог проектов, выбирайте интересующие и успевайте подать заявки до конца набора!'
              buttonText={'Выбрать проект'}
              buttonType={'green'}
              onClick={() => {
                navigate(ROUTES.PROJECTS.BASE)
              }}
            />
          )}
        </div>
      </div>
      <CompletedProjects
        title="История откликов"
        isEmpty={!hasArchivedApplications}
        emptyTitle={`У вас ещё не было откликов в ${thisYear} году`}
        emptySubtitle="Выбирайте подходящие проекты из каталога. Все проекты, на которые вы подали заявки, будут храниться здесь."
      >
        {archivedApplications.map(application => (
          <StudentApplicationProjectCard
            key={application.applicationID}
            application={application}
            skeletonClassName={styles.skeletonSmall}
          />
        ))}
      </CompletedProjects>
    </>
  )
}
