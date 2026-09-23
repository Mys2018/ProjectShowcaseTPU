import { useState } from 'react'
import styles from './MyApplicationsPage.module.css'
import { getFilteredApplications } from '../lib/getFilteredApplications'
import { useNavigate } from 'react-router-dom'
import { StudentApplicationProjectCard } from '@/widgets/student-project-card'
import { useApplications } from '@/entities/application'
import { useCurrentCheckpoints, getDaysUntilCheckpoint, isCheckpointPassed } from '@/entities/checkpoint'
import { NoProjectsFallback, CompletedProjects } from '@/entities/project'
import MyApplications from '@/shared/assets/no_applications.svg?react'
import { BlankPhoto, ROUTES } from '@/shared'
import { ClosingBanner } from '@/shared/ui/closing-banner'

export function MyApplicationsPage() {
  const { data } = useApplications({ mode: 'AsStudent', type: 'Application', offset: 0, limit: 100 })
  const { data: currentCheckpoint } = useCurrentCheckpoints()
  const navigate = useNavigate()
  const applications = data?.applications || []
  const checkpoints = currentCheckpoint?.checkpoints
  const firstCheckpoint = checkpoints?.[0]

  const thisYear = new Date().getFullYear()
  const { activeApplications, archivedApplications } = getFilteredApplications(applications)

  const hasActiveApplications = activeApplications.length > 0
  const hasArchivedApplications = archivedApplications.length > 0
  const [isDismissed, setIsDismissed] = useState(false)

  const daysUntilFirstCheckpoint = getDaysUntilCheckpoint(firstCheckpoint)
  const isBannerVisible = !isDismissed && hasActiveApplications && daysUntilFirstCheckpoint !== null && !isCheckpointPassed(firstCheckpoint)

  return (
    <div className={styles.container}>
      <ClosingBanner
        backgroundClass={styles.banner}
        title={'Ваши заявки скоро посмотрят'}
        description={
          'Дождитесь окончания набора, чтобы наставники смогли приступить к рассмотрению откликов. А пока есть время, вы можете ещё найти интересные проекты для подачи заявок.'
        }
        isBannerVisible={isBannerVisible}
        setIsBannerVisible={() => setIsDismissed(true)}
        image={<BlankPhoto />}
        timerText={'Рассмотрение начнётся через'}
        timerValue={String(daysUntilFirstCheckpoint ?? 0)}
      />

      <div className={styles.active}>
        <h3 className={styles.title}>Мои отклики</h3>
        <div className={styles.list}>
          {hasActiveApplications ? (
            activeApplications.map(application => (
              <StudentApplicationProjectCard key={application.applicationID} application={application} />
            ))
          ) : (
            <NoProjectsFallback
              className={styles.empty}
              title='Откликов пока нет'
              description='Переходите в каталог проектов, выбирайте интересующие и успевайте подать заявки до конца набора!'
              buttonText={'Выбрать проект'}
              image={<MyApplications />}
              buttonType={'green'}
              onClick={() => {
                navigate(ROUTES.PROJECTS.BASE)
              }}
            />
          )}
        </div>
      </div>
      <CompletedProjects
        title='История откликов'
        isEmpty={!hasArchivedApplications}
        emptyTitle={`У вас ещё не было откликов в ${thisYear} году`}
        emptySubtitle='Выбирайте подходящие проекты из каталога. Все проекты, на которые вы подали заявки, будут храниться здесь.'
      >
        {archivedApplications.map(application => (
          <StudentApplicationProjectCard key={application.applicationID} application={application} />
        ))}
      </CompletedProjects>
    </div>
  )
}
