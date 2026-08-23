import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './ProjectActivities.module.css'
import type { CreateProjectFormValues } from '@/features/create-project/model/useProjectWizard'
import { getSwitchableRolesAmount, ROLES_TRANSLATIONS, useMe, usePreferencesStore, UserRow, UserRowSkeleton } from '@/entities/user'
import { useProjectDraft, useDeleteDraft } from '@/entities/project'
import { FloatingTabs, ROUTES, StagesWidget, YourPointsWidget, YourTasksWidget, type Activity, type ClosingDiscipline } from '@/shared'
import Pencil from '@/shared/ui/icons/pencil.svg?react'
import Trash from '@/shared/ui/icons/trash.svg?react'
import { usePageTitle } from '@/shared/model'

const TYPE_LABELS: Record<string, string> = {
  Study: 'Учебный',
  Case: 'Кейс',
  Real: 'Реальный',
}

function formatDraftDate(dateStr: string): string {
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return dateStr
  }
}

export const ProjectActivities = () => {
  usePageTitle('моей платформе');
  const navigate = useNavigate()
  const { data: user } = useMe()
  const { preferredRoleType, setPreferredRoleType } = usePreferencesStore()

  const { data: draft, isLoading: isDraftLoading } = useProjectDraft()
  const { mutate: deleteDraft, isPending: isDeleting } = useDeleteDraft()

  const draftValues = draft?.data as Partial<CreateProjectFormValues> | undefined
  const draftTitle = draftValues?.meta?.title || 'Без названия'
  const draftType = draftValues?.type ? (TYPE_LABELS[draftValues.type] || draftValues.type) : null
  const draftUpdatedAt = draft?.updatedAt ? formatDraftDate(draft.updatedAt) : null
  const hasDraft = !!draft?.data && Object.keys(draft.data).length > 0

  const handleContinueDraft = () => {
    navigate(`/my-platform/${ROUTES.MY_PLATFORM_CREATE}?draft=true`)
  }

  const handleDeleteDraft = () => {
    deleteDraft()
  }

  const mockedData: { activities?: Activity[]; closingDisciplines: ClosingDiscipline[] } = {
    activities: [
      {
        type: 'currentStage',
        title: 'Подготовка презентации',
        deadline: '5-06-2026',
        progressSteps: 5,
        progressCurrentStep: 5,
        unitType: 'points'
      },
      {
        type: 'upcomingStage',
        title: 'Подготовка презентации',
        progressSteps: 1,
        progressCurrentStep: 0,
        unitType: 'points'
      },
      {
        type: 'keyPoint',
        title: 'Постерная сессия 1',
        deadline: '29-05-2026',
        status: 'completed',
        number: 1,
        extra: 'tooltip'
      }
    ],
    closingDisciplines: [
      {
        title: 'УИРС-1',
        currentProgress: 18,
        maxProgress: 36
      },
      {
        title: 'УИРС-2',
        currentProgress: 0,
        maxProgress: 36
      }
    ]
  } // TODO заменить на реальные данные

  const switchableRoles = user ? getSwitchableRolesAmount(user.roles) : []
  const tabItems = switchableRoles.map(role => ({ label: ROLES_TRANSLATIONS[role.type], value: role.type }))

  const activitiesRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const bgRef = useRef<HTMLSpanElement>(null)
  const shapeRef = useRef<HTMLSpanElement>(null)

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop

    const activitiesElement = activitiesRef.current
    const contentElement = contentRef.current
    const bgElement = bgRef.current
    const shapeElement = shapeRef.current

    if (activitiesElement) activitiesElement.scrollTop = scrollTop
    if (contentElement) contentElement.scrollTop = scrollTop
    if (bgElement) bgElement.style.transform = `translateY(-${scrollTop}px)`
    if (shapeElement) shapeElement.style.transform = `translateY(-${Math.min(338, scrollTop)}px)`
  }

  return (
    <main className={`${styles.container} ${styles[preferredRoleType.toLowerCase()]}`} onScroll={handleScroll}>
      <span className={`${styles.background} ${styles.fixed}`} />
      <span className={styles.background} ref={bgRef} />
      <span className={`${styles.background} ${styles.shaped}`} ref={shapeRef} />

      <aside className={styles.userRow}>{user ? <UserRow user={user} /> : <UserRowSkeleton />}</aside>

      <div className={styles.titleContainer}>
        {user && <h1 className={`ellipsis ${styles.welcomeMessage}`}>C возвращением, {user.meta.firstName}!</h1>}
      </div>

      {switchableRoles.length > 1 && (
        <aside className={styles.switchContainer}>
          <FloatingTabs className={styles.roleSwitcher} items={tabItems} value={preferredRoleType} onChange={setPreferredRoleType} />
        </aside>
      )}

      <aside className={styles.activities} ref={activitiesRef} onScroll={handleScroll}>
        <YourTasksWidget data={mockedData.activities} />
        <YourPointsWidget disciplines={mockedData.closingDisciplines} tpuPoints={307} />
      </aside>
      <div className={styles.content} ref={contentRef} onScroll={handleScroll}>
        <div className={styles.bannerContainer}>
          <span className={styles.banner} />
        </div>
        <section className={styles.stagesWidget}>
          <StagesWidget />
        </section>
        <section className={styles.projects}>
          <h3 className={styles.title}>Проекты для вас</h3>
          {/*<ProjectsGrid />*/}

          {isDraftLoading && (
            <div className={styles.templateDraftCard}>
              <p className={styles.draftCardTitle}>Загрузка черновиков...</p>
            </div>
          )}

          {hasDraft && (
            <div className={styles.draftsList}>
              <h4 className={styles.draftsTitle}>Черновики</h4>
              <div className={styles.templateDraftCard}>
                <div className={styles.draftCardInfo}>
                  <p className={styles.draftCardTitle}>{draftTitle}</p>
                  <div className={styles.draftCardMeta}>
                    {draftType && <span className={styles.draftCardType}>{draftType}</span>}
                    {draftUpdatedAt && <span className={styles.draftCardDate}>Изменён: {draftUpdatedAt}</span>}
                  </div>
                </div>
                <div className={styles.draftCardActions}>
                  <button
                    className={styles.draftContinueBtn}
                    onClick={handleContinueDraft}
                  >
                    <Pencil />
                    Продолжить
                  </button>
                  <button
                    className={styles.draftDeleteBtn}
                    onClick={handleDeleteDraft}
                    disabled={isDeleting}
                  >
                    <Trash />
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
