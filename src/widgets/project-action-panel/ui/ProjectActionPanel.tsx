import { useLocation } from 'react-router-dom'
import { isActiveApplication, myApplicationsParams } from '../model/applications'
import { useToggleLikeProject } from '@/features/like-project'
import { useApplications } from '@/entities/application'
import { type ProjectCardData } from '@/entities/project'
import { useAuthStore, useMe } from '@/entities/user'
import { FloatingPanel } from '@/shared/ui/floating-panel'
import { useMobileChrome } from '@/shared/lib'

interface ProjectActionPanelProps {
  project: ProjectCardData
  /** Открыть шторку выбора компетенции — податься ещё на одну роль. */
  onOpenCompetencies: () => void
  /** Открыть шторку со своими заявками, где роли снимаются по одной. */
  onOpenApplications: () => void
  /** Гость или незаполненный профиль: вместо шторки показываем подсказку. */
  onBlocked: (reason: 'guest' | 'profile') => void
  onShowPoints: () => void
  onLeaveReview: () => void
  onShare: () => void
  /** Профиль заполнен — иначе откликнуться нельзя. */
  isProfileFilled: boolean
}

/**
 * Центр панели считается одной цепочкой приоритетов: завершён → идёт работа →
 * набор открыт. Первое совпадение выигрывает. Владелец отдельной ветки не имеет —
 * он такой же участник и может откликнуться на собственный проект.
 */
export function ProjectActionPanel({
  project,
  onOpenCompetencies,
  onOpenApplications,
  onBlocked,
  onShowPoints,
  onLeaveReview,
  onShare,
  isProfileFilled
}: ProjectActionPanelProps) {
  const { pathname } = useLocation()
  const { panelHidden } = useMobileChrome(true, pathname)

  const { mutate: toggleLike } = useToggleLikeProject(project.liked)
  const status = useAuthStore(state => state.status)
  const { data: me } = useMe()
  const isGuest = status !== 'authenticated' && status !== 'loading'

  const isRecruiting = project.status === 'active'
  const isCompleted = project.status === 'completed'
  const isInProgress = project.status === 'approved'

  const { data: applications } = useApplications(myApplicationsParams(project.id))
  const myActive = (applications?.applications ?? []).filter(isActiveApplication)

  const isMember = !!me && project.roles.some(role => role.placeUserIds.includes(Number(me.id)))

  // TODO: отзывов нет в API. Пока читаем флаг из ответа проекта, чтобы состояние
  // можно было проверить на моках; когда появится эндпоинт — заменить на запрос.
  const hasReview = (project as { hasMyReview?: boolean }).hasMyReview === true

  const handleApply = () => {
    if (isGuest) return onBlocked('guest')
    if (!isProfileFilled) return onBlocked('profile')
    onOpenCompetencies()
  }

  const center = (() => {
    if (isCompleted) {
      if (!isMember) return <FloatingPanel.Status>{completedLabel(project)}</FloatingPanel.Status>
      return hasReview ? (
        <FloatingPanel.Action tone="muted">Отзыв оставлен</FloatingPanel.Action>
      ) : (
        <FloatingPanel.Action tone="filled" onClick={onLeaveReview}>
          Оставить отзыв
        </FloatingPanel.Action>
      )
    }

    if (isInProgress) {
      return isMember ? (
        <FloatingPanel.Action tone="green" onClick={onShowPoints}>
          Смотреть баллы
        </FloatingPanel.Action>
      ) : (
        <FloatingPanel.Status tone="violet" dot>
          В работе
        </FloatingPanel.Status>
      )
    }

    // Статусы вне согласованного набора («не реализован», «отклонён», «на модерации»)
    // пока не оформлены — показываем нейтральный центр вместо чужой подписи.
    if (!isRecruiting) return <FloatingPanel.Status>Проект недоступен</FloatingPanel.Status>

    if (myActive.length > 0) {
      return (
        <FloatingPanel.Applied
          count={myActive.length}
          onOpen={handleApply}
          onCancel={onOpenApplications}
        />
      )
    }

    return (
      <FloatingPanel.Action tone="violet" onClick={handleApply}>
        Выбрать компетенцию
      </FloatingPanel.Action>
    )
  })()

  return (
    <FloatingPanel hidden={panelHidden}>
      <FloatingPanel.Back />
      {center}
      {isRecruiting ? (
        <FloatingPanel.Favorite active={project.liked} onClick={() => toggleLike(project.id)} />
      ) : (
        <FloatingPanel.Share onClick={onShare} />
      )}
    </FloatingPanel>
  )
}

// TODO: даты завершения в API пока нет — придёт полем проекта, тогда подставим сюда
const completedLabel = (project: ProjectCardData) => {
  const last = project.checkpoints?.checkpoints?.at(-1)?.deadline
  if (!last) return 'Завершён'
  // ru-RU уже добавляет «г.» к году — своё дописывать не надо
  return `Завершен ${last.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}`
}
