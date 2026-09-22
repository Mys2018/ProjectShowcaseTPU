import type { ReactElement, ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './MyPlatformPage.module.css'
import { usePreferencesStore } from '@/entities/user'
import { useCurrentCheckpoints, type Checkpoint } from '@/entities/checkpoint'
import { assertNever, Banner, Callout, FilledButton, ROUTES } from '@/shared'

const getDayPlural = (count: number) => {
  if (count < 0) return '0 дней'

  const mod10 = count % 10
  const mod100 = count % 100

  if (mod100 >= 11 && mod100 <= 19) {
    return `${count} дней`
  }
  if (mod10 === 1) {
    return `${count} день`
  }
  if (mod10 >= 2 && mod10 <= 4) {
    return `${count} дня`
  }
  return `${count} дней`
}

const getBannerInfo = (
  status: 'recruiting' | 'in-progress' | 'ended',
  checkpoints: Checkpoint[] | undefined
): { title: string; description?: string; badgeText?: ReactNode } => {
  if (!checkpoints) {
    return {
      title: 'Добро пожаловать!'
    }
  }

  switch (status) {
    case 'recruiting':
      return {
        title: 'Набор на проекты открыт!',
        description: 'Выбирай проекты, подавай отклики и прокачивай навыки',
        badgeText: (
          <>
            <span className={styles.light}>Осталось</span>{' '}
            {getDayPlural(Math.ceil((checkpoints[0].deadline.getTime() - new Date().getTime()) / 1000 / 3600 / 24))}
          </>
        )
      }
    case 'ended':
      return {
        title: 'Сезон закончился',
        description: 'Мы вовсю готовим новые проекты, не пропусти начало сезона!'
      }
    case 'in-progress':
      return {
        title: 'Набор на проекты закончился',
        description: 'Работа над проектами идёт полным ходом',
        badgeText: (
          <>
            <span className={styles.light}>Защита через</span>{' '}
            {getDayPlural(Math.ceil((checkpoints[checkpoints.length - 1].deadline.getTime() - new Date().getTime()) / 1000 / 3600 / 24))}
          </>
        )
      }
    default:
      return assertNever(status)
  }
}

export function MyPlatformBanner({ children }: { children?: ReactElement }) {
  const navigate = useNavigate()
  const preferredRoleType = usePreferencesStore(s => s.preferredRoleType)
  const { data: currentCheckpoint } = useCurrentCheckpoints()
  const checkpoints = currentCheckpoint?.checkpoints
  const isRecruiting = checkpoints && checkpoints[0].deadline.getTime() > new Date().getTime()
  const isEnded = checkpoints && checkpoints[checkpoints.length - 1].deadline.getTime() < new Date().getTime()
  switch (preferredRoleType) {
    case 'Student':
      return (
        <Banner
          className={styles.banner}
          {...getBannerInfo(isRecruiting ? 'recruiting' : isEnded ? 'ended' : 'in-progress', checkpoints)}
          mainSlot={
            <FilledButton className={styles.button} textButton='Выбрать проекты' onClick={() => void navigate(ROUTES.PROJECTS.BASE)} />
          }
        >
          {children}
        </Banner>
      )
    case 'Curator':
      return (
        <Banner
          className={styles.banner}
          title='Создавайте проекты и ведите команды'
          description='Создавайте кейсы и привлекайте мотивированных студентов ТПУ'
          mainSlot={
            <FilledButton
              className={styles.button}
              textButton='Создать новый проект'
              onClick={() => void navigate(ROUTES.PROJECTS.CREATE)}
            />
          }
        >
          {children}
        </Banner>
      )
    case 'Moderator':
      return (
        <Banner
          className={styles.banner}
          title='Верификация проектов и стандарты в системе'
          mainSlot={
            <Callout>
              Ваш контроль задаёт уровень всей платформы. Внимательно проверяйте входящие заявки, чтобы открывать дорогу только качественным
              проектам.
            </Callout>
          }
        >
          {children}
        </Banner>
      )
    case null:
      return null
    default:
      return assertNever(preferredRoleType)
  }
}
