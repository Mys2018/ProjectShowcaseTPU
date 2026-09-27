import styles from './ScoringTable.module.css'
import { ScoringTable } from './ScoringTable'
import { useProjectScoring } from '../model/useProjectScoring'

import { ProjectSkeleton } from '@/shared'

export function ProjectScoringTable({ projectId }: { projectId: string }) {
  const { data, isLoading, isError } = useProjectScoring(projectId)

  if (isLoading) {
    return (
      <div className={styles.frame} aria-busy="true" aria-label="Загрузка таблицы часов">
        <ProjectSkeleton style={{ width: '100%', height: 260, borderRadius: 20 }} />
      </div>
    )
  }
  if (isError || !data) return <p className={styles.state}>Не удалось загрузить часы</p>
  if (data.sprints.length === 0) return <p className={styles.state}>Спринтов пока нет</p>

  return <ScoringTable model={data} />
}
