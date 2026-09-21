import type { ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './MyPlatformPage.module.css'
import { usePreferencesStore } from '@/entities/user'
import { assertNever, Banner, Callout, FilledButton, ROUTES } from '@/shared'

export function MyPlatformBanner({ children }: { children?: ReactElement }) {
  const navigate = useNavigate()
  const preferredRoleType = usePreferencesStore(s => s.preferredRoleType)

  switch (preferredRoleType) {
    case 'Student':
      return (
        <Banner
          className={styles.banner}
          title='Набор на проекты открыт!'
          description='Выбирай проекты, подавай отклики и прокачивай навыки'
          badgeText={
            <>
              <span className={styles.light}>Осталось</span> 7 дней
            </>
          }
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
