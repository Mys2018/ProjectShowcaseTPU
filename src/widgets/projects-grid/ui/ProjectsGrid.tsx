import clsx from 'clsx'
import type { ReactElement } from 'react'
import { useNavigate } from 'react-router-dom'
import styles from './ProjectsGrid.module.css'
import { useFilterStore } from '@/features/filter'
import { LikeProjectButton } from '@/features/like-project'
import { ProjectCardVertical, useLikedProjects, useProjects } from '@/entities/project'
import { getSortedTags, TagBadgeList } from '@/entities/tag'
import { CompetencyBadgeList } from '@/entities/competency'
import { PartnerRow } from '@/entities/partner'
import { BlankPhoto, buildRoute } from '@/shared'

const fallbackProjectsData = { projects: [], total: 0 }

interface ProjectsGridProps {
  type?: 'liked' | 'recruiting' | 'in-progress' | 'all'
  emptyFallback?: ReactElement
}

export default function ProjectsGrid({ type = 'all', emptyFallback }: ProjectsGridProps) {
  const navigate = useNavigate()

  const { tags, competencies, projectTypes, sort, isRelevanceSort, query, limit, page, reset } = useFilterStore()
  const {
    data: allProjectsData,
    isLoading: isAllLoading,
    isError: isAllError
  } = useProjects(
    {
      q: query,
      projectType: Array.from(projectTypes),
      tagId: Array.from(tags),
      status: type === 'recruiting' ? ['Recruiting'] : type === 'in-progress' ? ['InProgress'] : undefined,
      roleTypeId: Array.from(competencies),
      sort: isRelevanceSort ? 'relevance' : sort,
      limit: limit,
      offset: (page - 1) * limit
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
        {Array.from({ length: 16 }, (_, i) => <ProjectSkeleton key={i} className={styles.skeleton}/>)}
      </div>
    )
  }
  if (isError) return <h2>Ошибка при загрузке проектов</h2>
  if (!total)
    return (
      emptyFallback ?? (
        <div className={styles.emptyContainer}>
          <div className={styles.wrapper}>
            <BlankPhoto className={styles.blank} />
            <div>
              <h3>Нет подходящих проектов</h3>
              {(projectTypes.size !== 0 || tags.size !== 0 || competencies.size !== 0) && (
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
        const competencies = roles.map(r => ({ id: r.roleId, name: r.meta.name }))

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
            bodySlot={<CompetencyBadgeList row competencies={competencies} />}
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
