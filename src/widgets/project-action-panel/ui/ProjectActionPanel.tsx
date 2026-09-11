import { useLocation } from 'react-router-dom'
import { isActiveApplication, myApplicationsParams } from '../model/applications'
import { useIsInOtherProject, useProjectLimitReached } from '../model/participation'
import { useToggleLikeProject } from '@/features/like-project'
import { useApplications } from '@/entities/application'
import { getPublicProjectStatus, hasFreePlaces, ProjectPublicStatusLabel, type ProjectCardData } from '@/entities/project'
import { useAuthStore, useMe } from '@/entities/user'
import { FloatingPanel } from '@/shared/ui/floating-panel'
import { useMobileChrome } from '@/shared/lib'
import { ROUTES } from '@/shared'

interface ProjectActionPanelProps {
  project: ProjectCardData
  /** Открыть шторку выбора компетенции — податься ещё на одну роль. */
  onOpenCompetencies: () => void
  /** Открыть шторку со своими заявками. Её содержимое делают отдельно. */
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
 * Сколько компетенций одного проекта можно занять одновременно — столько же,
 * сколько разрешает выбрать шторка отклика (MAX_SELECTIONS в FreeCompetencies).
 */
const MAX_ROLES_PER_PROJECT = 2

/**
 * Центр панели — одна цепочка приоритетов, первое совпадение выигрывает.
 *
 * Порядок не случаен. Сначала идут фазы проекта: если проект завершён или
 * отклонён, никакие мои заявки уже ничего не значат. Дальше личные состояния,
 * и внутри них нерассмотренная заявка бьёт участие — пока хоть одна висит
 * без ответа, человеку важнее «чем закончилось», чем «я уже в команде».
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
  const { panelTransform, panelAnimate, panelHidden } = useMobileChrome(true, pathname)

  const { mutate: toggleLike } = useToggleLikeProject(project.liked)
  const status = useAuthStore(state => state.status)
  const { data: me } = useMe()
  const isGuest = status !== 'authenticated' && status !== 'loading'

  const publicStatus = getPublicProjectStatus(project)
  const isRecruitmentPhase = publicStatus === 'Recruiting' || publicStatus === 'RecruitmentCompleted'

  const { data: applications } = useApplications(myApplicationsParams(project.id))
  const myActive = (applications?.applications ?? []).filter(isActiveApplication)
  const hasPending = myActive.some(a => a.status === 'pending')

  const isMember = !!me && project.roles.some(role => role.placeUserIds.includes(Number(me.id)))

  // Запрашиваем только когда ответ может на что-то повлиять: гостю и на завершённом
  // проекте эти состояния всё равно не покажутся.
  const crossProjectMatters = !isGuest && isRecruitmentPhase
  const isInOtherProject = useIsInOtherProject(project.id, crossProjectMatters && !isMember)
  const limitReached = useProjectLimitReached(project.id, crossProjectMatters && !isMember)

  // Свободное место — то, которое ещё никем не занято; подавался я на него или нет,
  // значения не имеет (решение дизайнера).
  const canTakeMore = hasFreePlaces(project) && myActive.length < MAX_ROLES_PER_PROJECT

  // TODO: отзывов нет в API. Пока читаем флаг из ответа проекта, чтобы состояние
  // можно было проверить на моках; когда появится эндпоинт — заменить на запрос.
  const hasReview = (project as { hasMyReview?: boolean }).hasMyReview === true

  const handleApply = () => {
    if (isGuest) return onBlocked('guest')
    if (!isProfileFilled) return onBlocked('profile')
    onOpenCompetencies()
  }

  const projectStatus = <ProjectPublicStatusLabel status={publicStatus} variant="panel" />

  const center = (() => {
    /* ── Фазы проекта ────────────────────────────────────────────────── */

    if (publicStatus === 'Completed') {
      if (!isMember) return projectStatus
      return hasReview ? (
        <FloatingPanel.Action tone="muted">Отзыв оставлен</FloatingPanel.Action>
      ) : (
        <FloatingPanel.Action tone="filled" onClick={onLeaveReview}>
          Оставить отзыв
        </FloatingPanel.Action>
      )
    }

    if (publicStatus === 'InProgress') {
      return isMember ? (
        <FloatingPanel.Action tone="green" onClick={onShowPoints}>
          Смотреть баллы
        </FloatingPanel.Action>
      ) : (
        projectStatus
      )
    }

    // Отклонён модератором, не реализован, на модерации, на доработке —
    // откликаться некуда, показываем сквозной статус проекта.
    if (!isRecruitmentPhase) return projectStatus

    /* ── Личные состояния внутри набора ──────────────────────────────── */

    // Хоть одна заявка без ответа — даже если остальные уже приняли.
    if (hasPending) {
      return (
        <FloatingPanel.Applied actionText="Посмотреть" onAction={onOpenApplications}>
          Вы откликнулись
        </FloatingPanel.Applied>
      )
    }

    if (isMember) {
      return canTakeMore ? (
        <FloatingPanel.Applied actionText="Выбрать ещё" tone="outline" onAction={handleApply}>
          Вы в команде
        </FloatingPanel.Applied>
      ) : (
        <FloatingPanel.Note>Вы в команде</FloatingPanel.Note>
      )
    }

    // Взяли в другой проект — второй параллельно вести нельзя.
    if (isInOtherProject) return <FloatingPanel.Note>Вы уже в другом проекте</FloatingPanel.Note>

    // Лимит проектов исчерпан: компетенции показать можно, откликнуться — нет.
    if (limitReached) {
      return (
        <FloatingPanel.Action tone="locked" onClick={onOpenCompetencies}>
          Посмотреть компетенции
        </FloatingPanel.Action>
      )
    }

    // Мест не осталось — это и есть «Набор завершён».
    if (publicStatus === 'RecruitmentCompleted') return projectStatus

    return (
      <FloatingPanel.Action tone="violet" onClick={handleApply}>
        Выбрать компетенцию
      </FloatingPanel.Action>
    )
  })()

  // Сердце — только пока я никак не связан с проектом. Откликнулся или уже
  // в команде — вместо него «поделиться» (решение дизайнера).
  const canFavorite = isRecruitmentPhase && !isMember && myActive.length === 0

  return (
    <FloatingPanel transform={panelTransform} animate={panelAnimate} hidden={panelHidden}>
      {/* Фолбэк тот же, что у десктопной ссылки на этой странице, — иначе
          «назад» с телефона и с компьютера уводило бы в разные места. */}
      <FloatingPanel.Back fallback={ROUTES.PROJECTS.RECRUITMENT} />
      {center}
      {canFavorite ? (
        <FloatingPanel.Favorite active={project.liked} onClick={() => toggleLike(project.id)} />
      ) : (
        <FloatingPanel.Share onClick={onShare} />
      )}
    </FloatingPanel>
  )
}
