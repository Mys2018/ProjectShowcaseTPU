import clsx from 'clsx'
import type { ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './ProjectsGrid.module.css'
import { useFilterStore } from '@/features/filter'
import { LikeProjectButton } from '@/features/like-project'
import {
  NoRecruitingBlock,
  ProjectCardVertical,
  useLikedProjects,
  useProjects
} from '@/entities/project'
import { getSortedTags, TagBadgeList } from '@/entities/tag'
import { CompetencyBadgeList } from '@/entities/competency'
import { PartnerRow } from '@/entities/partner'
import { buildRoute, ProjectSkeleton } from '@/shared'
import NoProjectsSVG from '@/shared/assets/no_projects.svg?react'

const fallbackProjectsData = { projects: [], total: 0 }

interface ProjectsGridProps {
  type?: 'liked' | 'recruiting' | 'in-progress' | 'all'
  filters?: boolean
  emptyFallback?: ReactElement
}

export default function ProjectsGrid({ type = 'all', filters = false, emptyFallback }: ProjectsGridProps) {
  const navigate = useNavigate()

  const { tags, competencies, projectTypes, sort, isRelevanceSort, query, limit, page, reset } = useFilterStore()
  const {
    data: allProjectsData,
    isLoading: isAllLoading,
    isError: isAllError
  } = useProjects(
    {
      q: filters ? query : undefined,
      projectType: filters ? Array.from(projectTypes) : undefined,
      tagId: filters ? Array.from(tags) : undefined,
      status: type === 'recruiting' ? ['Recruiting', 'RecruitmentCompleted'] : type === 'in-progress' ? ['InProgress'] : undefined,
      roleTypeId: filters ? Array.from(competencies) : undefined,
      sort: filters ? (isRelevanceSort ? 'relevance' : sort) : undefined,
      limit: filters ? limit : undefined,
      offset: filters ? (page - 1) * limit : undefined
    },
    type !== 'liked'
  )
  const { data: likedProjectsData, isLoading: isLikedLoading, isError: isLikedError } = useLikedProjects({}, type === 'liked')
  const { projects, total } = type !== 'liked' ? allProjectsData || fallbackProjectsData : likedProjectsData || fallbackProjectsData
  const isLoading = type !== 'liked' ? isAllLoading : isLikedLoading
  const isError = type !== 'liked' ? isAllError : isLikedError

  if (isLoading) {
    return (
      <div className={styles.body}>
        {Array.from({ length: 16 }, (_, i) => (
          <ProjectSkeleton key={i} className={styles.skeleton} />
        ))}
      </div>
    )
  }

  if (!tags && !competencies && !projectTypes && !sort && !allProjectsData) {
    return <NoRecruitingBlock/>
  }

  if (isError) return <h2>Ошибка при загрузке проектов</h2>

  const hasActiveFilters =
    projectTypes.size !== 0 ||
    tags.size !== 0 ||
    competencies.size !== 0 ||
    Boolean(query?.trim())

  if (!total)
    return (
      emptyFallback ?? (
        <div className={styles.emptyContainer}>
          <div className={styles.wrapper}>
            <div>
              <NoProjectsSVG/>
              <h3>Нет подходящих проектов</h3>
              {hasActiveFilters && (
                <button className={styles.clearButton} onClick={reset}>
                  Сбросить все фильтры
                </button>
              )}
            </div>
          </div>
        </div>
      )
    )


  return (
    <div className={styles.body}>
      {projects.map(project => {
        const { id, liked, tags, primaryTag, roles } = project
        const competencies = [...roles]
          .sort((a, b) => (isRelevanceSort ? (b.relevance ?? 0) - (a.relevance ?? 0) : 0))
          .map(r => ({ id: r.roleId, name: r.meta.name, relevance: isRelevanceSort ? r.relevance : undefined }))

        const handleNavigate = () => {
          navigate(buildRoute.project(id))
        }

        return (
          <ProjectCardVertical
            key={project.id}
            className={styles.card}
            project={project}
            onClick={handleNavigate}
            headerSlot={
              <div className={styles.header}>
                <TagBadgeList visibleCount={1} tags={getSortedTags(tags, primaryTag)} />
                <LikeProjectButton
                  className={clsx(styles.like, liked && styles.visible)}
                  projectId={id}
                  liked={liked}
                  onClick={e => e.stopPropagation()}
                />
              </div>
            }
            bodySlot={<CompetencyBadgeList competencies={competencies} />}
            footerSlot={
              <div className={styles.footer}>
                <span className={styles.divider} />
                <PartnerRow partner={project.partner} />
              </div>
            }
          />
        )
      })}
    </div>
  )
}
